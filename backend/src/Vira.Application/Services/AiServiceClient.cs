using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Vira.Abstractions.DTOs;
using Vira.Application.Interfaces;

namespace Vira.Application.Services;

/// <summary>
/// Calls the Python ai-service over a pooled <see cref="HttpClient"/> (registered via
/// <c>AddHttpClient</c> in ApplicationExtensions, where <c>BaseAddress</c> is set from
/// <c>AiSettings.BaseUrl</c> — so paths here are relative).
/// </summary>
public class AiServiceClient(HttpClient http) : IAiModelClient
{
    private readonly HttpClient _http = http;

    // camelCase + string enums so the JSON matches the FastAPI Pydantic models. Scoped to this
    // client on purpose — it must not leak into the MVC serializer.
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() }
    };

    public async Task<JsonElement> GeneratePortraitAsync(PortraitRequestDto request, CancellationToken ct = default)
    {
        using var response = await _http.PostAsJsonAsync("portrait", request, JsonOptions, ct);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<JsonElement>(JsonOptions, ct);
    }
}
