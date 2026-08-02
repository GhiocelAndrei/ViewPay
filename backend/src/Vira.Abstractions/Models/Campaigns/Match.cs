using Vira.Abstractions.Common;

namespace Vira.Abstractions.Models.Campaigns;

/// <summary>
/// Creator↔campaign match. Matching is <b>information, not a gate</b> (dev-doc §7): shown and
/// explained, but creators choose freely. An absolute veto forces 0%.
/// </summary>
public class Match : Entity
{
    public Guid CreatorId { get; set; }
    public Guid CampaignId { get; set; }

    public double Score { get; set; }                 // 0..1
    public string Factors { get; set; } = string.Empty;      // JSON factor breakdown
    public string Explanation { get; set; } = string.Empty;  // AI-generated, grounded (D10)

    public bool VetoTriggered { get; set; }           // mocked category / praised competitor → 0%
    public bool LockedByFollowerGate { get; set; }    // product-placement + below threshold
}
