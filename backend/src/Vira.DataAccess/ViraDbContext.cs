using Microsoft.EntityFrameworkCore;
using Vira.Abstractions.Common;
using Vira.Abstractions.Models.Campaigns;
using Vira.Abstractions.Models.Identity;

namespace Vira.DataAccess;

/// <summary>
/// EF Core context. Postgres, schema-per-service (D4).
/// Scoped to the auth + business + campaign slice so the first migration stays focused. The
/// creator / media / billing / match DbSets return with their own persistence slice (they are
/// currently served from the in-memory seed, not the DB).
/// </summary>
public class ViraDbContext(DbContextOptions<ViraDbContext> options) : DbContext(options)
{
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<Business> Businesses => Set<Business>();
    public DbSet<BusinessQuestionnaire> BusinessQuestionnaires => Set<BusinessQuestionnaire>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();

    // Deferred until their persistence slices land (kept as a map of what's coming):
    // Creators, TikTokConnections, CreatorClips, Portraits, CreatorQuestionnaires,
    // Matches, FeedClips, TestClips, ViewSnapshots, Payouts.

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Campaign>(e =>
        {
            // Money is integer EUR cents — store the raw long, no floating point (CLAUDE.md rule 1).
            e.Property(c => c.Budget).HasConversion(m => m.Cents, v => new Money(v));

            // Value objects stored as JSONB.
            e.OwnsOne(c => c.Brief, o => o.ToJson());
            e.OwnsOne(c => c.TargetStyleVector, o => o.ToJson());
            e.OwnsOne(c => c.AccessRule, o => o.ToJson());
        });

        b.Entity<BusinessQuestionnaire>(e =>
        {
            // Scalar collections → Postgres arrays / primitive-collection columns.
            e.PrimitiveCollection(q => q.Verticals);
            e.PrimitiveCollection(q => q.TargetAudienceAges);
            e.PrimitiveCollection(q => q.Values);
            e.PrimitiveCollection(q => q.CompetitorBrands);
        });
    }
}
