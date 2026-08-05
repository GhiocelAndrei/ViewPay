using Vira.Abstractions.Common;

namespace Vira.Abstractions.Models.Campaigns;

/// <summary>
/// A business's onboarding questionnaire — self-reported at signup, separate from any campaign.
/// Feeds later matching (verticals, audience, brand-safety) and gives the brand dashboard context.
/// Mirrors the creator-side <c>CreatorQuestionnaire</c> pattern: a flat mix of predefined choices
/// and free text.
/// </summary>
public class BusinessQuestionnaire : Entity
{
    public Guid BusinessId { get; set; }

    // ── Predefined ───────────────────────────────────────────────────────────────────────────
    /// <summary>Content verticals the brand operates in / wants creators from.</summary>
    public List<CreatorCategory> Verticals { get; set; } = [];
    public CompanySize CompanySize { get; set; }
    public BudgetBand BudgetBand { get; set; }
    public List<AudienceAge> TargetAudienceAges { get; set; } = [];
    public CampaignObjective PrimaryGoal { get; set; }

    // Brand-safety preferences — the brand's own no-go adjacencies (distinct from creator declarations).
    public bool AvoidsAlcohol { get; set; }
    public bool AvoidsGambling { get; set; }
    public bool AvoidsPolitical { get; set; }

    // ── Free text ────────────────────────────────────────────────────────────────────────────
    /// <summary>What the business does, in their own words.</summary>
    public string Description { get; set; } = string.Empty;
    /// <summary>Brand values / tone.</summary>
    public List<string> Values { get; set; } = [];
    public string Website { get; set; } = string.Empty;
    /// <summary>Competitor brands the business doesn't want to be associated with — feeds veto logic later.</summary>
    public List<string> CompetitorBrands { get; set; } = [];
    /// <summary>Products or services the brand wants promoted.</summary>
    public string ProductsToPromote { get; set; } = string.Empty;
}
