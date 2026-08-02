using Vira.Abstractions.Common;

namespace Vira.Abstractions.Models.Creators;

/// <summary>
/// AI-generated creator portrait. Stored as versioned JSONB with model/prompt/ontology versions
/// so any past score is reproducible (dev-doc §8).
/// </summary>
public class CreatorPortrait : Entity
{
    public Guid CreatorId { get; set; }
    public StyleVector StyleVector { get; set; } = new();
    public string NarrativeDossier { get; set; } = string.Empty;

    public string ModelVersion { get; set; } = string.Empty;
    public string PromptVersion { get; set; } = string.Empty;
    public string OntologyVersion { get; set; } = string.Empty;

    public List<PortraitClaim> Claims { get; set; } = [];
}

/// <summary>
/// A single claim. <see cref="EvidenceClipId"/> is REQUIRED — "no claim without evidence."
/// </summary>
public class PortraitClaim : Entity
{
    public Guid PortraitId { get; set; }
    public string Statement { get; set; } = string.Empty;
    public string Dimension { get; set; } = string.Empty;
    public Guid EvidenceClipId { get; set; }        // the proving clip — required
    public double? EvidenceTimestampSec { get; set; }
}
