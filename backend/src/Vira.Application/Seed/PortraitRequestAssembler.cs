using Vira.Abstractions.DTOs;
using Vira.Abstractions.Models.Creators;
using Vira.Application.Services;

namespace Vira.Application.Seed;

/// <summary>
/// Assembles the <see cref="PortraitRequestDto"/> the ai-service consumes from a seeded creator.
/// Kept in Application so the controller stays a thin pass-through.
/// </summary>
public static class PortraitRequestAssembler
{
    public static PortraitRequestDto From(CreatorSeedRecord record) => new()
    {
        CreatorId = record.Creator.Id,
        DisplayName = record.Creator.DisplayName,
        FollowerCount = record.Creator.FollowerCount,
        Category = record.Category,
        City = record.Creator.City,
        County = record.Creator.County,
        Clips = [.. record.Clips.Select(ToClipDto)],
        Aggregates = ClipAggregates.From(record.Clips),
        Questionnaire = ToQuestionnaireDto(record.Questionnaire)
    };

    private static ClipDto ToClipDto(CreatorClip c) => new()
    {
        TikTokVideoId = c.TikTokVideoId,
        Title = c.Title,
        CoverImageUrl = c.CoverImageUrl,
        EmbedLink = c.EmbedLink,
        ViewCount = c.ViewCount,
        LikeCount = c.LikeCount,
        CommentCount = c.CommentCount,
        ShareCount = c.ShareCount,
        TikTokCreateTime = c.TikTokCreateTime
    };

    private static QuestionnaireDto ToQuestionnaireDto(CreatorQuestionnaire q) => new()
    {
        PreferredCategories = q.PreferredCategories,
        ExcludedCategories = q.ExcludedCategories,
        AcceptsShippedProducts = q.AcceptsShippedProducts,
        CanPurchaseProducts = q.CanPurchaseProducts,
        TravelWillingness = q.TravelWillingness,
        Goals = q.Goals,
        Values = q.Values,
        PreferredFormats = q.PreferredFormats,
        ContentLanguages = q.ContentLanguages,
        ExcludedBrands = q.ExcludedBrands,
        AllowsAlcohol = q.AllowsAlcohol,
        AllowsGambling = q.AllowsGambling,
        AllowsPolitical = q.AllowsPolitical,
        CollabCapacityPerMonth = q.CollabCapacityPerMonth,
        SelfDescribedAudience = q.SelfDescribedAudience,
        PriorSponsorships = [.. q.PriorSponsorships.Select(p => new PriorSponsorshipDto
        {
            BrandName = p.BrandName,
            Category = p.Category
        })]
    };
}
