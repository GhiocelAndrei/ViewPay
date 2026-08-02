using Vira.Application.Interfaces;

namespace Vira.Application.Services;

/// <summary>
/// Calls the Python ai-service over a pooled <see cref="HttpClient"/> (registered via
/// <c>AddHttpClient</c> in ApplicationExtensions). TODO: implement IAiModelClient methods.
/// </summary>
public class AiServiceClient(HttpClient http) : IAiModelClient
{
    private readonly HttpClient _http = http;
    // TODO: POST /portrait, /assistant/chat, etc.
}
