using Vira.Abstractions.DTOs;
using Vira.Abstractions.Models.Creators;

namespace Vira.Application.Services;

/// <summary>
/// Derives portrait aggregates from a creator's clip list. Computed on the fly, never stored —
/// aggregates are a pure function of the clips and storing them would only invite staleness.
/// </summary>
public static class ClipAggregates
{
    public static AggregatesDto From(IReadOnlyList<CreatorClip> clips)
    {
        if (clips.Count == 0)
            return new AggregatesDto();

        long totalViews = 0, totalLikes = 0, totalComments = 0, totalShares = 0;
        foreach (var c in clips)
        {
            totalViews += c.ViewCount;
            totalLikes += c.LikeCount;
            totalComments += c.CommentCount;
            totalShares += c.ShareCount;
        }

        // Integer (truncating) division — these are counts, never money or ratios.
        return new AggregatesDto
        {
            AvgViews = totalViews / clips.Count,
            AvgLikes = totalLikes / clips.Count,
            AvgComments = totalComments / clips.Count,
            AvgShares = totalShares / clips.Count,
            // Ratio 0..1 — double is deliberate (not on the money path). Guard divide-by-zero.
            EngagementRate = totalViews == 0
                ? 0.0
                : (double)(totalLikes + totalComments + totalShares) / totalViews
        };
    }
}
