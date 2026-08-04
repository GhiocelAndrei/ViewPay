using Vira.Abstractions.Common;

namespace Vira.Abstractions.Models.Creators;

/// <summary>
/// A creator's intake questionnaire — self-reported preferences and business intent gathered at
/// onboarding. Feeds the portrait's Positioning + Business facets (docs/ai). This is NOT the
/// hidden-construct personality test; it is a flat, low-friction questionnaire.
/// </summary>
public class CreatorQuestionnaire : Entity
{
    public Guid CreatorId { get; set; }

    /// <summary>Categories the creator wants to work in.</summary>
    public List<CreatorCategory> PreferredCategories { get; set; } = [];

    /// <summary>Categories the creator refuses — feeds veto logic.</summary>
    public List<CreatorCategory> ExcludedCategories { get; set; } = [];

    // ── Campaign-fulfillment capability ──────────────────────────────────────────────────────
    // The deal is always pay-per-view; what varies is whether a creator can satisfy a campaign's
    // logistics. Product: brand ships it (AcceptsShippedProducts) or creator buys it
    // (CanPurchaseProducts). Location: how far the creator will travel (TravelWillingness).

    /// <summary>Creator will accept a product the brand ships to their City/County.</summary>
    public bool AcceptsShippedProducts { get; set; }

    /// <summary>Creator is willing to buy the campaign product themselves (e.g. reimbursed).</summary>
    public bool CanPurchaseProducts { get; set; }

    /// <summary>How far the creator will travel for a location-based campaign.</summary>
    public TravelWillingness TravelWillingness { get; set; }

    /// <summary>Free-text goals (e.g. "grow to 500k", "land a long-term beauty partnership").</summary>
    public List<string> Goals { get; set; } = [];

    /// <summary>Values / causes the creator cares about.</summary>
    public List<string> Values { get; set; } = [];

    /// <summary>Preferred content formats (e.g. "tutorial", "storytime", "review", "skit").</summary>
    public List<string> PreferredFormats { get; set; } = [];

    /// <summary>Content languages (e.g. "ro", "en").</summary>
    public List<string> ContentLanguages { get; set; } = [];

    /// <summary>Specific brands the creator refuses — feeds veto logic.</summary>
    public List<string> ExcludedBrands { get; set; } = [];

    // Brand-safety self-declarations — feed the veto logic on sensitive categories.
    public bool AllowsAlcohol { get; set; }
    public bool AllowsGambling { get; set; }
    public bool AllowsPolitical { get; set; }

    /// <summary>How many collaborations the creator can take per month.</summary>
    public int CollabCapacityPerMonth { get; set; }

    /// <summary>The creator's own words about who follows them (self-report vs. what we infer).</summary>
    public string SelfDescribedAudience { get; set; } = string.Empty;

    /// <summary>Brands the creator has worked with before — a professionalism signal.</summary>
    public List<PriorSponsorship> PriorSponsorships { get; set; } = [];
}

/// <summary>A past brand collaboration. Value object (not an <see cref="Entity"/>), stored as JSONB.</summary>
public class PriorSponsorship
{
    public string BrandName { get; set; } = string.Empty;
    public CreatorCategory Category { get; set; }
}
