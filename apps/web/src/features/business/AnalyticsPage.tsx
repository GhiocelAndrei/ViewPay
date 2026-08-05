import { Card, CardHeader, Chip, PageHeader, StatTile } from "../../components/ui";
import { Icon } from "../../components/Icon";
import { useCampaigns } from "../../lib/queries";
import { t } from "@vira/core";
import { formatMoney, formatViews } from "@vira/core";

const statusTone = { active: "mint", draft: "neutral", closed: "primary" } as const;

/**
 * Brand analytics.
 *
 * The campaign list is real (from /brand/campaigns), but views, spend and CPM
 * depend on the measurement + payout pipelines, which don't exist yet — so they
 * read "—" and the page says why, rather than showing invented numbers.
 */
export default function AnalyticsPage() {
  const { data } = useCampaigns();
  const campaigns = (data ?? []).map((c) => ({
    id: c.id,
    name: c.title,
    status: c.status.toLowerCase() as "active" | "draft" | "closed",
    views: c.views,
    spentMinor: c.spentMinor,
  }));

  const totalViews = campaigns.reduce((sum, c) => sum + c.views, 0);
  const totalSpentMinor = campaigns.reduce((sum, c) => sum + c.spentMinor, 0);

  return (
    <div className="mx-auto max-w-container px-6 py-10 md:px-12">
      <PageHeader title={t.analytics.title} subtitle={t.analytics.subtitle} />

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <StatTile label={t.brand.totalViews} value={formatViews(totalViews)} icon="visibility" hint={t.brand.metricPending} />
        <StatTile
          label={t.brand.totalSpent}
          value={formatMoney(totalSpentMinor, { compactZeroCents: true })}
          icon="payments"
          hint={t.brand.metricPending}
        />
        <StatTile label={t.brand.effectiveCpm} value={t.analytics.noCpm} icon="query_stats" hint={t.brand.metricPending} />
      </div>

      {/* Why the numbers are pending — honest about the missing pipeline. */}
      <Card className="mt-6 flex items-start gap-3 border-primary/15 p-5">
        <Icon name="radar" size={20} className="mt-0.5 shrink-0 text-primary" />
        <div>
          <p className="font-display text-[15px] font-semibold text-on-surface">{t.analytics.pendingTitle}</p>
          <p className="mt-1 text-[13px] leading-5 text-on-surface-variant">{t.analytics.pendingText}</p>
        </div>
      </Card>

      <Card className="mt-6 overflow-hidden">
        <CardHeader title={t.analytics.cpmByCampaign} />
        {campaigns.length === 0 ? (
          <p className="px-6 py-10 text-center text-[13px] text-on-surface-variant">{t.brand.noCampaignsText}</p>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between gap-3 px-6 py-4">
                <div className="min-w-0">
                  <p className="truncate font-body text-[14px] font-semibold text-on-surface">{campaign.name}</p>
                  <Chip tone={statusTone[campaign.status]} className="mt-1.5">
                    {t.brand.status[campaign.status]}
                  </Chip>
                </div>
                <div className="flex shrink-0 items-center gap-6 text-right">
                  <Metric label={t.analytics.table.views} value={campaign.views > 0 ? formatViews(campaign.views) : t.analytics.noCpm} />
                  <Metric label={t.analytics.table.cpm} value={t.analytics.noCpm} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="numeric text-[14px] font-semibold text-on-surface">{value}</p>
      <p className="label-caps text-[9px]">{label}</p>
    </div>
  );
}
