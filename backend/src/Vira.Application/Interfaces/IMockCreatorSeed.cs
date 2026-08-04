using Vira.Abstractions.Common;
using Vira.Application.Seed;

namespace Vira.Application.Interfaces;

/// <summary>
/// In-memory source of mocked Romanian creators (profile + clips + questionnaire). Stands in for
/// the DB / TikTok Display API until those land, behind the same controller surface. Registered as
/// a singleton, so the Guids it generates at startup are stable for the process lifetime.
/// </summary>
public interface IMockCreatorSeed
{
    IReadOnlyList<CreatorSeedRecord> All { get; }
    CreatorSeedRecord? ById(Guid id);
    IEnumerable<CreatorSeedRecord> ByCategory(CreatorCategory category);
}
