using Vira.Application.Interfaces;

namespace Vira.Application.Services;

/// <summary>
/// TikTok module (D1): OAuth code exchange, token refresh, video.list/query, over a pooled
/// <see cref="HttpClient"/>. TODO: implement ITikTokClient methods.
/// </summary>
public class TikTokClient(HttpClient http) : ITikTokClient
{
    private readonly HttpClient _http = http;
    // TODO: /v2/oauth/token/, /v2/user/info/, /v2/video/list/, /v2/video/query/
}
