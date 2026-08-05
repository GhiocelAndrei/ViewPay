namespace Vira.Abstractions.Settings;

/// <summary>Bound from configuration section "Firebase". Business-auth token verification + storage.</summary>
public class FirebaseSettings
{
    public string ProjectId { get; set; } = string.Empty;

    /// <summary>Path to a service-account JSON file (local dev).</summary>
    public string CredentialsPath { get; set; } = string.Empty;

    /// <summary>Service-account JSON as an inline string (cloud — injected from Key Vault).
    /// Takes precedence over <see cref="CredentialsPath"/> when set.</summary>
    public string CredentialsJson { get; set; } = string.Empty;

    public string StorageBucket { get; set; } = string.Empty;

    /// <summary>True when a credential is configured; auth init is skipped otherwise (e.g. placeholder env).</summary>
    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(CredentialsJson) || !string.IsNullOrWhiteSpace(CredentialsPath);
}
