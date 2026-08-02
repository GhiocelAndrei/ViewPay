namespace Vira.Abstractions.Settings;

/// <summary>Bound from configuration section "Ai". Consumed by the AI HttpClient in Application.</summary>
public class AiSettings
{
    public string BaseUrl { get; set; } = string.Empty;   // Python ai-service URL
    public string ApiKey { get; set; } = string.Empty;    // Anthropic key (server-side only)
    public int TimeoutSeconds { get; set; } = 100;
}
