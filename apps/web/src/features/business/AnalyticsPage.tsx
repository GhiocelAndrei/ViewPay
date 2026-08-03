import { AreaChart, Card, CardHeader, Chip, DemoBadge, PageHeader, StatTile } from "../../components/ui";
import { useBrandCampaigns } from "../../lib/brandCampaigns";
import { t } from "@vira/core";
import { brandSummary } from "@vira/core";
import { formatCompactNumber, formatMoney, formatViews } from "@vira/core";

const statusTone = { active: "mint", draft: "neutral", closed: "primary" } as const;

/**
 * Brand analytics.
 *
 * Every money figure here — including each campaign's cost per 1.000 views —
 * arrives already computed rather than being divided out of a spend and a view
 * count in the browser (CLAUDE.md #4). The screen formats; it does not do
 * arithmetic on amounts.
 *
 * The measurement-coverage tile is the honest half of the story: it says how
 * many polls actually landed, because a gap in the series is a recorded fact and
 * not something to smooth over.
 */
export default function AnalyticsPage() {
  const campaigns = useBrandCampaigns((state) => state.rows);
  const measured = campaigns.filter((campaign) => campaign.views > 0);

  return (
    <div className="mx-auto max-w-container px-6 py-10 md:px-12">
      <PageHeader title={t.analytics.title} subtitle={t.analytics.subtitle} action={<DemoBadge />} />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label={t.brand.totalViews}
          value={formatCompactNumber(brandSummary.totalViews)}
          icon="visibility"
        />
        <StatTile
          label={t.brand.totalSpent}
          value={formatMoney(brandSummary.totalSpentMinor, { compactZeroCents: true })}
          icon="payments"
        />
        <StatTile
          label={t.brand.effectiveCpm}
          value={formatMoney(brandSummary.effectiveCpmMinor)}
          icon="query_stats"
          hint={t.analytics.table.cpm}
        />
        {/* Never compacted: "1,4 K din 1,4 K" would hide the seven failed reads
            this tile exists to disclose. Exact counts or it says nothing. */}
        <StatTile
          label={t.analytics.coverageTitle}
          value={t.analytics.coverageValue(
            brandSummary.measurementPollsSucceeded.toLocaleString("ro-RO"),
            brandSummary.measurementPollsExpected.toLocaleString("ro-RO"),
          )}
          icon="radar"
          hint={t.analytics.coverageHint}
        />
      </div>

      <Card className="mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[15px] font-semibold text-on-surface">
            {t.analytics.viewsOverTime}
          </h2>
          <Chip tone="mint">{formatViews(brandSummary.totalViews)}</Chip>
        </div>
        <AreaChart points={brandSummary.viewsTimeline} className="mt-6" />
      </Card>

      <Card className="mt-6 border-white/5 p-5">
        <p className="text-[12px] leading-5 text-on-surface-variant/70">
          {t.analytics.coverageNote}
        </p>
      </Card>

      <Card className="mt-6 overflow-hidden">
        <CardHeader title={t.analytics.cpmByCampaign} action={<DemoBadge />} />

        {/* Desktop: table. */}
        <div className="hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="label-caps px-6 py-3 text-left font-semibold">
                  {t.analytics.table.campaign}
                </th>
                <th className="label-caps px-6 py-3 text-right font-semibold">
                  {t.analytics.table.views}
                </th>
                <th className="label-caps px-6 py-3 text-right font-semibold">
                  {t.analytics.table.spent}
                </th>
                <th className="label-caps px-6 py-3 text-right font-semibold">
                  {t.analytics.table.cpm}
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
                    <Chip tone={statusTone[campaign.status]} className="mt-1.5">
                      {t.brand.status[campaign.status]}
                    </Chip>
                  </td>
                  <td className="numeric px-6 py-4 text-right text-[14px] text-on-surface-variant">
                    {campaign.views > 0 ? formatViews(campaign.views) : t.analytics.noCpm}
                  </td>
                  <td className="numeric px-6 py-4 text-right text-[14px] text-on-surface-variant">
                    {formatMoney(campaign.spentMinor, { compactZeroCents: true })}
                  </td>
                  <td className="numeric px-6 py-4 text-right text-[14px] font-semibold text-on-surface">
                    {campaign.views > 0
                      ? formatMoney(campaign.effectiveCpmMinor)
                      : t.analytics.noCpm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phone: the same rows as cards. */}
        <div className="divide-y divide-white/[0.03] md:hidden">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 truncate font-body text-[15px] font-semibold text-on-surface">
                  {campaign.name}
                </p>
                <Chip tone={statusTone[campaign.status]}>{t.brand.status[campaign.status]}</Chip>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <MobileCell
                  label={t.analytics.table.views}
                  value={campaign.views > 0 ? formatViews(campaign.views) : t.analytics.noCpm}
                />
                <MobileCell
                  label={t.analytics.table.spent}
                  value={formatMoney(campaign.spentMinor, { compactZeroCents: true })}
                />
                <MobileCell
                  label={t.analytics.table.cpm}
                  value={
                    campaign.views > 0 ? formatMoney(campaign.effectiveCpmMinor) : t.analytics.noCpm
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {measured.length < campaigns.length && (
          <p className="border-t border-white/5 px-6 py-3 text-[12px] text-on-surface-variant/70">
            {t.analytics.noCpmNote}
          </p>
        )}
      </Card>
    </div>
  );
}

function MobileCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-caps text-[9px]">{label}</p>
      <p className="numeric mt-1 text-[13px] font-semibold text-on-surface">{value}</p>
    </div>
  );
}
