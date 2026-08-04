using System.Text.Json;
using Vira.Abstractions.DTOs;

namespace Vira.Application.Interfaces;

/// <summary>
/// Black-box AI contract (dev-doc §8). Business logic depends only on this; the implementation
/// (an HttpClient over the Python ai-service) lives in Application/Services.
/// </summary>
public interface IAiModelClient
{
    /// <summary>POSTs the assembled portrait payload to the ai-service and returns its raw response.
    /// (Typed once the Python pipeline returns a stable shape; for now the service echoes a stub.)</summary>
    Task<JsonElement> GeneratePortraitAsync(PortraitRequestDto request, CancellationToken ct = default);
}
