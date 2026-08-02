using ViewPay.Abstractions.Common;

namespace ViewPay.Abstractions.DTOs;

/// <summary>Example DTO — the shape returned to the client for a creator portrait. TODO: flesh out.</summary>
public class PortraitDto
{
    public StyleVector StyleVector { get; set; } = new();
    public string NarrativeDossier { get; set; } = string.Empty;
    // TODO: claims with evidence links, versions, etc.
}
