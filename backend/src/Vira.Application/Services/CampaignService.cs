using Microsoft.EntityFrameworkCore;
using Vira.Abstractions.DTOs;
using Vira.DataAccess;

namespace Vira.Application.Services;

public interface ICampaignService
{
    Task<CampaignDto> CreateAsync(Guid businessId, CreateCampaignDto dto, CancellationToken ct = default);
    Task<IReadOnlyList<CampaignDto>> ListAsync(Guid businessId, CancellationToken ct = default);
}

/// <summary>Creates and lists a business's campaigns. Money is integer EUR cents throughout.</summary>
public class CampaignService(ViraDbContext db) : ICampaignService
{
    public async Task<CampaignDto> CreateAsync(Guid businessId, CreateCampaignDto dto, CancellationToken ct = default)
    {
        var campaign = CampaignMapper.ToEntity(businessId, dto);
        db.Campaigns.Add(campaign);
        await db.SaveChangesAsync(ct);
        return CampaignMapper.ToDto(campaign);
    }

    public async Task<IReadOnlyList<CampaignDto>> ListAsync(Guid businessId, CancellationToken ct = default)
    {
        var campaigns = await db.Campaigns
            .Where(c => c.BusinessId == businessId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(ct);
        return campaigns.Select(CampaignMapper.ToDto).ToList();
    }
}
