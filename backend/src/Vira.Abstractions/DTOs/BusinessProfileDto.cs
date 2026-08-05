using Vira.Abstractions.Common;

namespace Vira.Abstractions.DTOs;

/// <summary>The business onboarding questionnaire — used for both <c>PUT</c> (save) and <c>GET</c> (read).
/// Mirrors <see cref="Models.Campaigns.BusinessQuestionnaire"/> plus the company name.</summary>
public class BusinessProfileDto
{
    public string CompanyName { get; set; } = string.Empty;

    public List<CreatorCategory> Verticals { get; set; } = [];
    public CompanySize CompanySize { get; set; }
    public BudgetBand BudgetBand { get; set; }
    public List<AudienceAge> TargetAudienceAges { get; set; } = [];
    public CampaignObjective PrimaryGoal { get; set; }

    public bool AvoidsAlcohol { get; set; }
    public bool AvoidsGambling { get; set; }
    public bool AvoidsPolitical { get; set; }

    public string Description { get; set; } = string.Empty;
    public List<string> Values { get; set; } = [];
    public string Website { get; set; } = string.Empty;
    public List<string> CompetitorBrands { get; set; } = [];
    public string ProductsToPromote { get; set; } = string.Empty;
}
