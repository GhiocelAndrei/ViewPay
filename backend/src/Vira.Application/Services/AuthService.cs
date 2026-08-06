using FirebaseAdmin.Auth;
using Microsoft.EntityFrameworkCore;
using Vira.Abstractions.DTOs;
using Vira.Abstractions.Models.Campaigns;
using Vira.Abstractions.Models.Identity;
using Vira.Application.Interfaces;
using Vira.DataAccess;

namespace Vira.Application.Services;

/// <summary>Firebase-backed auth + server-side sessions over the EF <see cref="ViraDbContext"/>.</summary>
public class AuthService(ViraDbContext db) : IAuthService
{
    private static readonly TimeSpan SessionLifetime = TimeSpan.FromDays(14);

    public async Task<AuthResultDto> AuthenticateWithFirebaseAsync(string idToken, CancellationToken ct = default)
    {
        var decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken, ct);
        var uid = decoded.Uid;
        var email = decoded.Claims.TryGetValue("email", out var e) ? e?.ToString() ?? string.Empty : string.Empty;

        var account = await db.Accounts.FirstOrDefaultAsync(a => a.FirebaseUid == uid, ct);
        Business? business;
        if (account is null)
        {
            account = new Account { Email = email, Type = AccountType.Business, FirebaseUid = uid };
            db.Accounts.Add(account);
            business = new Business { AccountId = account.Id, CompanyName = string.Empty };
            db.Businesses.Add(business);
        }
        else
        {
            business = await db.Businesses.FirstOrDefaultAsync(x => x.AccountId == account.Id, ct);
            if (business is null)
            {
                business = new Business { AccountId = account.Id, CompanyName = string.Empty };
                db.Businesses.Add(business);
            }
        }

        var session = new Session { AccountId = account.Id, ExpiresAt = DateTimeOffset.UtcNow + SessionLifetime };
        db.Sessions.Add(session);
        await db.SaveChangesAsync(ct);

        var onboardingComplete = await db.BusinessQuestionnaires.AnyAsync(q => q.BusinessId == business.Id, ct);

        return new AuthResultDto
        {
            SessionId = session.Id,
            ExpiresAt = session.ExpiresAt,
            Me = new MeDto
            {
                AccountId = account.Id,
                Email = account.Email,
                Type = account.Type,
                BusinessId = business.Id,
                CompanyName = string.IsNullOrWhiteSpace(business.CompanyName) ? null : business.CompanyName,
                OnboardingComplete = onboardingComplete
            }
        };
    }

    public async Task<SessionInfo?> ResolveSessionAsync(Guid sessionId, CancellationToken ct = default)
    {
        var session = await db.Sessions.FirstOrDefaultAsync(s => s.Id == sessionId, ct);
        if (session is null || session.ExpiresAt <= DateTimeOffset.UtcNow)
            return null;

        var account = await db.Accounts.FirstOrDefaultAsync(a => a.Id == session.AccountId, ct);
        if (account is null)
            return null;

        var businessId = await db.Businesses
            .Where(b => b.AccountId == account.Id)
            .Select(b => (Guid?)b.Id)
            .FirstOrDefaultAsync(ct);

        return new SessionInfo(account.Id, account.Type, businessId);
    }

    public async Task<MeDto?> GetMeAsync(Guid accountId, CancellationToken ct = default)
    {
        var account = await db.Accounts.FirstOrDefaultAsync(a => a.Id == accountId, ct);
        if (account is null)
            return null;

        var business = await db.Businesses.FirstOrDefaultAsync(b => b.AccountId == accountId, ct);
        var onboardingComplete = business is not null
            && await db.BusinessQuestionnaires.AnyAsync(q => q.BusinessId == business.Id, ct);

        return new MeDto
        {
            AccountId = account.Id,
            Email = account.Email,
            Type = account.Type,
            BusinessId = business?.Id,
            CompanyName = string.IsNullOrWhiteSpace(business?.CompanyName) ? null : business!.CompanyName,
            OnboardingComplete = onboardingComplete
        };
    }

    public async Task LogoutAsync(Guid sessionId, CancellationToken ct = default)
    {
        await db.Sessions.Where(s => s.Id == sessionId).ExecuteDeleteAsync(ct);
    }
}
