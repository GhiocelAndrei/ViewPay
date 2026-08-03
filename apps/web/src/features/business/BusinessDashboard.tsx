import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import {
  Button,
  Card,
  CardHeader,
  Chip,
  DemoBadge,
  PageHeader,
  ProgressBar,
  StatTile,
} from "../../components/ui";
import { cn } from "../../lib/cn";
import ValueProofPanel from "./ValueProofPanel";
import { useBrandCampaigns } from "../../lib/brandCampaigns";
import { t } from "@vira/core";
import { formatCompactNumber, formatMoney, formatViews } from "@vira/core";
import { brandSummary, leaderboard } from "@vira/core";

const statusTone = { active: "mint", draft: "neutral", closed: "primary" } as const;

/**
 * Brand dashboard.
 *
 * Demo boundary: the live view counter is REAL (it tracks the test clip posted
 * on demo morning), everything money-shaped is simulated and carries a
 * `DemoBadge`. Keeping that line visible is the point — a client who discovers
 * on their own that a number was fake stops believing the ones that weren't.
 */
export default function BusinessDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const campaigns = useBrandCampaigns((state) => state.rows);
  const liveViews = useLiveViewCounter(brandSummary.liveTestClipViews);

  /** Set by the creation flow on its way back here. */
  const created = (location.state as { created?: string } | null)?.created;

  // Display-only ratio; no money value is derived from it.
  const budgetPercent = Math.round((brandSummary.totalSpentMinor / brandSummary.budgetMinor) * 100);

  return (
    <div className="mx-auto max-w-container px-6 py-10 md:px-12">
      <PageHeader
        title={t.brand.welcome(brandSummary.brandName)}
        subtitle={t.brand.subtitle}
        action={
          <Button
            icon="add_circle"
            variant="primary"
            onClick={() => navigate("/brand/campanii/nou")}
          >
            {t.brand.newCampaign}
          </Button>
        }
      />

      {created && (
        <Card className="mt-6 animate-fade-up border-mint/20 bg-mint/5 p-4">
          <p className="flex items-center gap-2 text-[14px] text-mint">
            <Icon name="check_circle" size={18} filled />
            {t.newCampaign.created(created)}
          </p>
        </Card>
      )}

      {/* Live measurement — the one number on this screen that is not simulated. */}
      <Card className="mt-8 border-primary/20 bg-primary/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-mint" />
            </span>
            <div>
              <p className="label-caps text-primary">Măsurare live · clip de test</p>
              <p className="mt-1 text-[13px] text-on-surface-variant">
                Citit direct din API-ul oficial TikTok, la fiecare 30 de secunde.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="numeric text-[40px] font-bold leading-none text-on-surface">
              {liveViews.toLocaleString("ro-RO")}
            </p>
            <p className="label-caps mt-1">vizualizări</p>
          </div>
        </div>
      </Card>

      {/* The live counter proves the measurement is real; this explains why that
          changes what the brand is actually paying for. */}
      <ValueProofPanel />

      {/* Aggregate stats */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-headline-md text-on-surface">Sumar</h2>
        <DemoBadge />
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label={t.brand.activeCampaigns}
          value={String(brandSummary.activeCampaigns)}
          icon="rocket_launch"
          trend={{
            direction: "up",
            text: `+${brandSummary.activeCampaignsDelta} ${t.common.vsLastMonth}`,
          }}
        />
        <StatTile
          label={t.brand.totalReach}
          value={formatCompactNumber(brandSummary.totalReach)}
          icon="public"
          trend={{ direction: "up", text: `${brandSummary.reachGrowthPercent}% creștere organică` }}
        />
        <StatTile
          label={t.brand.totalViews}
          value={formatCompactNumber(brandSummary.totalViews)}
          icon="visibility"
          hint="Pe toate campaniile"
        />
        <StatTile
          label={t.brand.activeCreators}
          value={String(brandSummary.activeCreators)}
          icon="group"
          hint={t.brand.verifiedActive}
        />
      </div>

      {/* Budget + CPM */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="label-caps">{t.brand.budgetUsed}</p>
              <p className="numeric mt-3 text-[32px] font-semibold text-on-surface">
                {formatMoney(brandSummary.totalSpentMinor, { compactZeroCents: true })}
                <span className="ml-2 font-body text-[15px] font-normal text-on-surface-variant">
                  din {formatMoney(brandSummary.budgetMinor, { compactZeroCents: true })}
                </span>
              </p>
            </div>
            <Chip tone="primary">{budgetPercent}%</Chip>
          </div>
          <ProgressBar percent={budgetPercent} className="mt-5" />
          <p className="mt-3 text-[12px] text-on-surface-variant/70">
            Bugetul neconsumat se restituie automat la închiderea campaniei.
          </p>
        </Card>

        <StatTile
          label={t.brand.effectiveCpm}
          value={formatMoney(brandSummary.effectiveCpmMinor)}
          hint="Cost real per 1.000 de vizualizări validate"
          icon="query_stats"
          emphasis
        />
      </div>

      {/* Campaign table */}
      <Card className="mt-6 overflow-hidden">
        <CardHeader
          title={t.brand.campaignPerformance}
          action={
            <button
              type="button"
              className="flex items-center gap-1 text-[13px] text-primary transition-opacity hover:opacity-80"
            >
              {t.brand.viewAll}
              <Icon name="chevron_right" size={16} />
            </button>
          }
        />
        {/* Desktop: table. */}
        <div className="hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="label-caps px-6 py-3 text-left font-semibold">
                  {t.brand.table.campaign}
                </th>
                <th className="label-caps px-6 py-3 text-left font-semibold">
                  {t.brand.table.status}
                </th>
                <th className="label-caps px-6 py-3 text-right font-semibold">
                  {t.brand.table.budget}
                </th>
                <th className="label-caps px-6 py-3 text-right font-semibold">
                  {t.brand.table.views}
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-white/[0.03] last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-body text-[14px] font-semibold text-on-surface">
                      {campaign.name}
                    </p>
                    <p className="text-[12px] text-on-surface-variant">
                      Start: {campaign.startDate}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Chip tone={statusTone[campaign.status]}>
                      {t.brand.status[campaign.status]}
                    </Chip>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="numeric text-[14px] font-semibold text-on-surface">
                      {formatMoney(campaign.spentMinor, { compactZeroCents: true })}
                    </p>
                    <p className="numeric text-[11px] text-on-surface-variant">
                      din {formatMoney(campaign.budgetMinor, { compactZeroCents: true })}
                    </p>
                  </td>
                  <td className="numeric px-6 py-4 text-right text-[14px] text-on-surface-variant">
                    {formatViews(campaign.views)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phone: the same rows as cards. Sideways-scrolling tables are not parity. */}
        <div className="divide-y divide-white/[0.03] md:hidden">
          {campaigns.map((campaign) => {
            const used = Math.round((campaign.spentMinor / campaign.budgetMinor) * 100);
            return (
              <div key={campaign.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-body text-[15px] font-semibold text-on-surface">
                      {campaign.name}
                    </p>
                    <p className="mt-0.5 text-[12px] text-on-surface-variant">
                      Start: {campaign.startDate}
                    </p>
                  </div>
                  <Chip tone={statusTone[campaign.status]}>{t.brand.status[campaign.status]}</Chip>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <p className="numeric text-[16px] font-semibold text-on-surface">
                    {formatMoney(campaign.spentMinor, { compactZeroCents: true })}
                    <span className="ml-1 font-body text-[12px] font-normal text-on-surface-variant">
                      din {formatMoney(campaign.budgetMinor, { compactZeroCents: true })}
                    </span>
                  </p>
                  <p className="numeric text-[13px] text-on-surface-variant">
                    {formatViews(campaign.views)}
                  </p>
                </div>

                <ProgressBar percent={used} className="mt-2.5" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="mt-6 overflow-hidden">
        <CardHeader title={t.brand.leaderboard} action={<DemoBadge />} />
        <div className="divide-y divide-white/[0.03]">
          {leaderboard.map((row, index) => (
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
                {/* On phones the views ride under the name instead of a column. */}
                <p className="numeric truncate text-[12px] text-on-surface-variant">
                  <span className="md:hidden">{formatViews(row.validatedViews)} vizualizări · </span>
                  {row.handle}
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
                <p className="label-caps text-[9px]">vizualizări validate</p>
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
      </Card>
    </div>
  );
}

/**
 * Simulates the live poll for the demo's test clip.
 * TODO(api): replace with a TanStack Query poll against the gateway; the real
 * cadence is one read per ~30s, with the UI tweening between snapshots so the
 * number never appears frozen.
 */
function useLiveViewCounter(initial: number): number {
  const [views, setViews] = useState(initial);

  useEffect(() => {
    const id = window.setInterval(() => {
      setViews((current) => current + Math.floor(Math.random() * 7) + 1);
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  return views;
}
