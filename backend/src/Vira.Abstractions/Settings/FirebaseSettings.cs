namespace Vira.Abstractions.Settings;

/// <summary>Bound from configuration section "Firebase". Business-auth token verification + storage.</summary>
public class FirebaseSettings
{
    public string ProjectId { get; set; } = string.Empty;
    public string CredentialsPath { get; set; } = string.Empty;
    public string StorageBucket { get; set; } = string.Empty;
}
