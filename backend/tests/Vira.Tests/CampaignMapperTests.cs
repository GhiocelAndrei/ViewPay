using Vira.Abstractions.Common;
using Vira.Abstractions.DTOs;
using Vira.Abstractions.Models.Campaigns;
using Vira.Application.Services;
using Xunit;

namespace Vira.Tests;

/// <summary>
/// Money path (CLAUDE.md rules 1 & 9): campaign budgets are integer EUR cents and must survive the
/// DTO ↔ entity mapping without any floating-point rounding.
/// </summary>
public class CampaignMapperTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(150_000)]          // €1,500.00
    [InlineData(2_000_000)]        // €20,000.00
    [InlineData(9_007_199_254_740_993)] // 2^53 + 1 — NOT representable as a double; proves the integer path
    public void Budget_round_trips_verbatim(long budgetMinor)
    {
        var dto = new CreateCampaignDto
        {
            Title = "T",
            Objective = CampaignObjective.Awareness,
            BudgetMinor = budgetMinor
        };

        var entity = CampaignMapper.ToEntity(Guid.NewGuid(), dto);
        Assert.Equal(budgetMinor, entity.Budget.Cents);

        var back = CampaignMapper.ToDto(entity);
        Assert.Equal(budgetMinor, back.BudgetMinor);
    }

    [Fact]
    public void Money_stores_cents_exactly()
    {
        Assert.Equal(long.MaxValue, new Money(long.MaxValue).Cents);
    }

    [Fact]
    public void ToEntity_maps_brief_access_rule_and_defaults_to_active()
    {
        var businessId = Guid.NewGuid();
        var dto = new CreateCampaignDto
        {
            Title = "Launch",
            Objective = CampaignObjective.Launch,
            BudgetMinor = 500_000,
            Hashtags = ["#lumina"],
            Mention = "@lumina",
            ProductPlacement = true,
            MinFollowerThreshold = 10_000,
            Message = "Show the product in daylight."
        };

        var e = CampaignMapper.ToEntity(businessId, dto);

        Assert.Equal(businessId, e.BusinessId);
        Assert.Equal(CampaignObjective.Launch, e.Brief.Objective);
        Assert.Equal(["#lumina"], e.Brief.Hashtags);
        Assert.True(e.AccessRule.ProductPlacement);
        Assert.Equal(10_000, e.AccessRule.MinFollowerThreshold);
        Assert.Equal(CampaignStatus.Active, e.Status);
    }
}
