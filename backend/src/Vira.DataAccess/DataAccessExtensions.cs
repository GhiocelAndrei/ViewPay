using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Vira.DataAccess;

public static class DataAccessExtensions
{
    public static IServiceCollection AddDataAccess(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<ViraDbContext>(options => options.UseNpgsql(connectionString));
        // TODO: repositories only if we ever go beyond EF; migrations live in this project.
        return services;
    }
}
