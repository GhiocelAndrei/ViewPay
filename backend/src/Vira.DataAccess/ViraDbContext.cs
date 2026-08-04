using Microsoft.EntityFrameworkCore;
using Vira.Abstractions.Models.Billing;
using Vira.Abstractions.Models.Campaigns;
using Vira.Abstractions.Models.Creators;
using Vira.Abstractions.Models.Identity;
using Vira.Abstractions.Models.Media;

namespace Vira.DataAccess;

/// <summary>
/// EF Core context. Postgres, schema-per-service (D4). Skeleton only —
/// TODO: entity configuration (owned types, JSONB, schemas) + migrations.
/// </summary>
public class ViraDbContext(DbContextOptions<ViraDbContext> options) : DbContext(options)
{
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<Creator> Creators => Set<Creator>();
    public DbSet<TikTokConnection> TikTokConnections => Set<TikTokConnection>();
    public DbSet<CreatorClip> CreatorClips => Set<CreatorClip>();
    public DbSet<CreatorPortrait> Portraits => Set<CreatorPortrait>();
    public DbSet<CreatorQuestionnaire> CreatorQuestionnaires => Set<CreatorQuestionnaire>();
    public DbSet<Business> Businesses => Set<Business>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<Match> Matches => Set<Match>();
    public DbSet<FeedClip> FeedClips => Set<FeedClip>();
    public DbSet<TestClip> TestClips => Set<TestClip>();
    public DbSet<ViewSnapshot> ViewSnapshots => Set<ViewSnapshot>();
    public DbSet<SimulatedPayout> Payouts => Set<SimulatedPayout>();
}
