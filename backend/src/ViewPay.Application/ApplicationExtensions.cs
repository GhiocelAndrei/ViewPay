using Mapster;
using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ViewPay.Abstractions.Settings;
using ViewPay.Application.Interfaces;
using ViewPay.Application.Mapping;
using ViewPay.Application.Services;
using ViewPay.DataAccess;

namespace ViewPay.Application;

public static class ApplicationExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services, string connectionString)
    {
        // DataAccess layer (EF Core / Postgres)
        services.AddDataAccess(connectionString);

        // Mapster (scans IRegister configs in this assembly)
        var mapsterConfig = TypeAdapterConfig.GlobalSettings;
        mapsterConfig.Scan(typeof(MappingRegister).Assembly);
        services.AddSingleton(mapsterConfig);
        services.AddScoped<IMapper, ServiceMapper>();

        // External-service clients over pooled HttpClient (IHttpClientFactory).
        // AiSettings is bound in Program.cs; the delegate runs lazily at client-creation time.
        services.AddHttpClient<IAiModelClient, AiServiceClient>((sp, client) =>
        {
            var ai = sp.GetRequiredService<IOptions<AiSettings>>().Value;
            if (!string.IsNullOrWhiteSpace(ai.BaseUrl))
                client.BaseAddress = new Uri(ai.BaseUrl);
            client.Timeout = TimeSpan.FromSeconds(ai.TimeoutSeconds);
        });
        services.AddHttpClient<ITikTokClient, TikTokClient>();

        // TODO: register application services (IPortraitService, IMatchingService, ...)
        //       and FluentValidation validators here.

        return services;
    }
}
