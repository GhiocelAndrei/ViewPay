import { useMemo, useState } from "react";
import { Icon } from "../../components/Icon";
import { Card, CardHeader, Chip, DemoBadge, PageHeader, StatTile } from "../../components/ui";
import { cn } from "../../lib/cn";
import { t } from "@vira/core";
import { leaderboard } from "@vira/core";
import { formatCompactNumber, formatMoney, formatViews } from "@vira/core";

/**
 * The creators working on this brand's campaigns.
 *
 * The totals are integer sums of amounts that are already final — exact, and no
 * payout is derived from them (CLAUDE.md #1, #4). Nothing on this screen
 * divides money; where a per-mille figure is needed the gateway supplies it.
 */
export default function CreatorsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return leaderboard;
    return leaderboard.filter(
      (row) =>
        row.displayName.toLowerCase().includes(needle) ||
        row.handle.toLowerCase().includes(needle),
    );
  }, [query]);

  const totalViews = leaderboard.reduce((sum, row) => sum + row.validatedViews, 0);
  const totalPaidMinor = leaderboard.reduce((sum, row) => sum + row.earnedMinor, 0);

  return (
    <div className="mx-auto max-w-container px-6 py-10 md:px-12">
      <PageHeader title={t.creators.title} subtitle={t.creators.subtitle} action={<DemoBadge />} />

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <StatTile
          label={t.creators.totalCreators}
          value={String(leaderboard.length)}
          icon="group"
          hint={t.brand.verifiedActive}
        />
        <StatTile
          label={t.creators.totalValidatedViews}
          value={formatCompactNumber(totalViews)}
          icon="visibility"
        />
        <StatTile
          label={t.creators.totalPaid}
          value={formatMoney(totalPaidMinor, { compactZeroCents: true })}
          icon="payments"
        />
      </div>

      <Card className="mt-6 overflow-hidden">
        <CardHeader
          title={t.brand.leaderboard}
          action={
            <div className="relative">
              <Icon
                name="search"
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.creators.search}
                aria-label={t.creators.search}
                className={cn(
                  "w-48 rounded border border-white/10 bg-surface-container-lowest py-2 pl-9 pr-3 sm:w-64",
                  "font-body text-[13px] text-on-surface placeholder:text-on-surface-variant/40",
                  "outline-none transition-colors focus:border-primary/60",
                )}
              />
            </div>
          }
        />

        {filtered.length === 0 ? (
          <p className="px-6 py-10 text-center text-[13px] text-on-surface-variant">
            {t.creators.noResults}
          </p>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {filtered.map((row, index) => (
              <div key={row.handle} className="flex items-center gap-3 px-5 py-4 md:gap-4 md:px-6">
                <span className="numeric w-5 shrink-0 text-[13px] text-on-surface-variant/60">
                  {index + 1}
                </span>
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5">
                  <span className="font-display text-[13px] font-semibold">
                    {row.displayName.charAt(0)}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-[14px] font-semibold text-on-surface">
                    {row.displayName}
                  </p>
                  <p className="truncate text-[12px] text-on-surface-variant">
                    {/* On phones the numbers ride under the name instead of columns. */}
                    <span className="md:hidden">
                      <span className="numeric">{formatViews(row.validatedViews)}</span> ·{" "}
                    </span>
                    {row.handle} · {t.creators.campaignsCount(row.campaignsCount)}
                  </p>
                </div>

                {row.underReview && (
                  <Chip tone="amber" icon="pending" className="hidden sm:inline-flex">
                    {t.earnings.status.underReview}
                  </Chip>
                )}

                <div className="hidden text-right md:block">
                  <p className="numeric text-[13px] text-on-surface-variant">
                    {formatViews(row.validatedViews)}
                  </p>
                  <p className="label-caps text-[9px]">{t.analytics.table.views}</p>
                </div>

                <p
                  className={cn(
                    "numeric shrink-0 text-right text-[15px] font-semibold md:w-24",
                    row.underReview ? "text-on-surface-variant/50" : "text-on-surface",
                  )}
                >
                  {formatMoney(row.earnedMinor)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
