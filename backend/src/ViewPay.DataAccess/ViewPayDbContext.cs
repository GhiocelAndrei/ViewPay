using Microsoft.EntityFrameworkCore;
using ViewPay.Abstractions.Models.Billing;
using ViewPay.Abstractions.Models.Campaigns;
using ViewPay.Abstractions.Models.Creators;
using ViewPay.Abstractions.Models.Identity;
using ViewPay.Abstractions.Models.Media;

namespace ViewPay.DataAccess;

/// <summary>
/// EF Core context. Postgres, schema-per-service (D4). Skeleton only —
/// TODO: entity configuration (owned types, JSONB, schemas) + migrations.
/// </summary>
public class ViewPayDbContext(DbContextOptions<ViewPayDbContext> options) : DbContext(options)
{
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<Creator> Creators => Set<Creator>();
    public DbSet<TikTokConnection> TikTokConnections => Set<TikTokConnection>();
    public DbSet<CreatorClip> CreatorClips => Set<CreatorClip>();
    public DbSet<CreatorPortrait> Portraits => Set<CreatorPortrait>();
    public DbSet<Business> Businesses => Set<Business>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<Match> Matches => Set<Match>();
    public DbSet<FeedClip> FeedClips => Set<FeedClip>();
    public DbSet<TestClip> TestClips => Set<TestClip>();
    public DbSet<ViewSnapshot> ViewSnapshots => Set<ViewSnapshot>();
    public DbSet<SimulatedPayout> Payouts => Set<SimulatedPayout>();
}
