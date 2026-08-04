using Vira.Abstractions.Common;

namespace Vira.Abstractions.DTOs;

/// <summary>Lightweight creator row for the list endpoint — enough to pick an id to drill into.</summary>
public class CreatorSummaryDto
{
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public CreatorCategory Category { get; set; }
    public long FollowerCount { get; set; }
    public string? City { get; set; }
    public int ClipCount { get; set; }
}
