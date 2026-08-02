namespace Vira.Application.Interfaces;

/// <summary>
/// Black-box AI contract (dev-doc §8). Business logic depends only on this; the implementation
/// (an HttpClient over the Python ai-service) lives in Application/Services. TODO: define methods.
/// </summary>
public interface IAiModelClient
{
    // e.g. Task<PortraitDto> GeneratePortraitAsync(...);  — added later
}
