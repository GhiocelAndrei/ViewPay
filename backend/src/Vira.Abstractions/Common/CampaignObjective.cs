namespace Vira.Abstractions.Common;

/// <summary>
/// What a campaign (or a brand, as its primary goal) is trying to achieve. Drives the suggested
/// requirements and the cost-per-1k-views rate on the brand UI.
/// </summary>
public enum CampaignObjective
{
    Awareness,
    Visits,
    Offer,
    Launch,
    Community
}
