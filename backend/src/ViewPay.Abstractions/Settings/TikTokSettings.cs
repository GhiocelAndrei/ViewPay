namespace ViewPay.Abstractions.Settings;

/// <summary>Bound from configuration section "TikTok". Login Kit + Display API (sandbox).</summary>
public class TikTokSettings
{
    public string ClientKey { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string RedirectUri { get; set; } = string.Empty;
}
