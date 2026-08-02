using Mapster;

namespace Vira.Application.Mapping;

/// <summary>Entity ↔ DTO maps (Mapster). Scanned at startup. TODO: add maps.</summary>
public class MappingRegister : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        // config.NewConfig<CreatorPortrait, PortraitDto>();
    }
}
