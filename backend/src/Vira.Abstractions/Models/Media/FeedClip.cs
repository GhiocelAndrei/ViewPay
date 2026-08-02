using Vira.Abstractions.Common;

namespace Vira.Abstractions.Models.Media;

/// <summary>One of the ~30 example ad clips in the feed. Hosted by us in Firebase Storage (D7).</summary>
public class FeedClip : Entity
{
    public string FileUrl { get; set; } = string.Empty;
    public int Order { get; set; }
    public string BrandName { get; set; } = string.Empty;
    public string? Caption { get; set; }
}

/// <summary>The real test clip posted demo-morning; its views climb live via TikTok polling.</summary>
public class TestClip : Entity
{
    public string TikTokVideoId { get; set; } = string.Empty;
    public Guid CampaignId { get; set; }
}

/// <summary>
/// Append-only view snapshot from <c>video.query</c> polling. Gaps are <b>marked, never
/// interpolated</b> (dev-doc §14). The UI tweens between real values; the data stays raw.
/// </summary>
public class ViewSnapshot : Entity
{
    public Guid TestClipId { get; set; }
    public long ViewCount { get; set; }
    public DateTimeOffset CapturedAt { get; set; }
    public bool IsGap { get; set; }
}
