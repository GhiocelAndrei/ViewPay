using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Vira.DataAccess;

/// <summary>
/// Design-time factory so <c>dotnet ef</c> can build the model without running the API host
/// (which does startup work like Firebase init + auto-migrate). The connection string here is
/// only used to select the Npgsql provider — migration scaffolding never opens a connection.
/// </summary>
public class ViraDbContextFactory : IDesignTimeDbContextFactory<ViraDbContext>
{
    public ViraDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<ViraDbContext>()
            .UseNpgsql("Host=localhost;Port=5432;Database=vira;Username=postgres;Password=postgres")
            .Options;
        return new ViraDbContext(options);
    }
}
