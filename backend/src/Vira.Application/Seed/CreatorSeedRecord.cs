using Vira.Abstractions.Common;
using Vira.Abstractions.Models.Creators;

namespace Vira.Application.Seed;

/// <summary>
/// A creator and everything attached to them, kept together so no cross-list FK lookup is needed.
/// (The category rides here too because <see cref="Creator.Niche"/> is a free display string.)
/// </summary>
public sealed record CreatorSeedRecord(
    Creator Creator,
    CreatorCategory Category,
    IReadOnlyList<CreatorClip> Clips,
    CreatorQuestionnaire Questionnaire);
