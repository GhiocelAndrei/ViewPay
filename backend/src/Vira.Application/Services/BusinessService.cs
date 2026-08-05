using Microsoft.EntityFrameworkCore;
using Vira.Abstractions.DTOs;
using Vira.Abstractions.Models.Campaigns;
using Vira.Application.Interfaces;
using Vira.DataAccess;

namespace Vira.Application.Services;

public interface IBusinessService
{
    Task SaveProfileAsync(Guid businessId, BusinessProfileDto dto, CancellationToken ct = default);
    Task<BusinessProfileDto?> GetProfileAsync(Guid businessId, CancellationToken ct = default);
}

/// <summary>Persists the business onboarding questionnaire + company name.</summary>
public class BusinessService(ViraDbContext db) : IBusinessService
{
    public async Task SaveProfileAsync(Guid businessId, BusinessProfileDto dto, CancellationToken ct = default)
    {
        var business = await db.Businesses.FirstOrDefaultAsync(b => b.Id == businessId, ct)
            ?? throw new InvalidOperationException($"Business {businessId} not found.");
        business.CompanyName = dto.CompanyName;

        var q = await db.BusinessQuestionnaires.FirstOrDefaultAsync(x => x.BusinessId == businessId, ct);
        if (q is null)
        {
            q = new BusinessQuestionnaire { BusinessId = businessId };
            db.BusinessQuestionnaires.Add(q);
        }
        Apply(dto, q);
        await db.SaveChangesAsync(ct);
    }

    public async Task<BusinessProfileDto?> GetProfileAsync(Guid businessId, CancellationToken ct = default)
    {
        var business = await db.Businesses.FirstOrDefaultAsync(b => b.Id == businessId, ct);
        if (business is null)
            return null;
        var q = await db.BusinessQuestionnaires.FirstOrDefaultAsync(x => x.BusinessId == businessId, ct);
        if (q is null)
            return null;

        return new BusinessProfileDto
        {
            CompanyName = business.CompanyName,
            Verticals = q.Verticals,
            CompanySize = q.CompanySize,
            BudgetBand = q.BudgetBand,
            TargetAudienceAges = q.TargetAudienceAges,
            PrimaryGoal = q.PrimaryGoal,
            AvoidsAlcohol = q.AvoidsAlcohol,
            AvoidsGambling = q.AvoidsGambling,
            AvoidsPolitical = q.AvoidsPolitical,
            Description = q.Description,
            Values = q.Values,
            Website = q.Website,
            CompetitorBrands = q.CompetitorBrands,
            ProductsToPromote = q.ProductsToPromote
        };
    }

    private static void Apply(BusinessProfileDto dto, BusinessQuestionnaire q)
    {
        q.Verticals = dto.Verticals;
        q.CompanySize = dto.CompanySize;
        q.BudgetBand = dto.BudgetBand;
        q.TargetAudienceAges = dto.TargetAudienceAges;
        q.PrimaryGoal = dto.PrimaryGoal;
        q.AvoidsAlcohol = dto.AvoidsAlcohol;
        q.AvoidsGambling = dto.AvoidsGambling;
        q.AvoidsPolitical = dto.AvoidsPolitical;
        q.Description = dto.Description;
        q.Values = dto.Values;
        q.Website = dto.Website;
        q.CompetitorBrands = dto.CompetitorBrands;
        q.ProductsToPromote = dto.ProductsToPromote;
    }
}
