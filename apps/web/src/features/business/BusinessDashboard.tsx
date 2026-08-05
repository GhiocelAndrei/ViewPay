import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import {
  Button,
  Card,
  CardHeader,
  Chip,
  PageHeader,
  ProgressBar,
  StatTile,
} from "../../components/ui";
import { useCampaigns, useMe } from "../../lib/queries";
import { t } from "@vira/core";
import { formatMoney, formatViews } from "@vira/core";

const statusTone = { active: "mint", draft: "neutral", closed: "primary" } as const;

/**
 * Brand dashboard.
 *
 * Everything here is the brand's own data from the gateway: identity from
 * /auth/me, campaigns from /brand/campaigns. Measurement-derived numbers
 * (views, spend, CPM) are honestly 0 / "pending" until the measurement and
 * payout slices land — we show that state rather than a fabricated figure.
 */
export default function BusinessDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: me } = useMe();
  const { data: campaignData } = useCampaigns();

  const campaigns = (campaignData ?? []).map((c) => ({
    id: c.id,
    name: c.title,
    startDate: new Intl.DateTimeFormat("ro-RO", { day: "2-digit", month: "short", year: "numeric" }).format(
      new Date(c.createdAt),
    ),
    status: c.status.toLowerCase() as "active" | "draft" | "closed",
    budgetMinor: c.budgetMinor,
    spentMinor: c.spentMinor,
    views: c.views,
  }));

  // Real aggregates. Spend/views are 0 until measurement+payouts exist — integer sums, no float.
  const totalBudgetMinor = campaigns.reduce((sum, c) => sum + c.budgetMinor, 0);
  const totalSpentMinor = campaigns.reduce((sum, c) => sum + c.spentMinor, 0);
  const totalViews = campaigns.reduce((sum, c) => sum + c.views, 0);
  const budgetPercent = totalBudgetMinor > 0 ? Math.round((totalSpentMinor / totalBudgetMinor) * 100) : 0;

  /** Set by the creation flow on its way back here. */
  const created = (location.state as { created?: string } | null)?.created;

  return (
    <div className="mx-auto max-w-container px-6 py-10 md:px-12">
      <PageHeader
        title={t.brand.welcome(me?.companyName ?? me?.email ?? "")}
        subtitle={t.brand.subtitle}
        action={
          <Button icon="add_circle" variant="primary" onClick={() => navigate("/brand/campanii/nou")}>
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

      {/* Real aggregates. Measurement-derived tiles are marked pending, not faked. */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label={t.brand.activeCampaigns} value={String(campaigns.length)} icon="rocket_launch" />
        <StatTile
          label={t.brand.totalBudget}
          value={formatMoney(totalBudgetMinor, { compactZeroCents: true })}
          icon="account_balance_wallet"
        />
        <StatTile
          label={t.brand.totalViews}
          value={formatViews(totalViews)}
          icon="visibility"
          hint={t.brand.metricPending}
        />
        <StatTile
          label={t.brand.totalSpent}
          value={formatMoney(totalSpentMinor, { compactZeroCents: true })}
          icon="payments"
          hint={t.brand.metricPending}
        />
      </div>

      {/* Budget: total committed is real; spent is 0 until payouts exist. */}
      <Card className="mt-6 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="label-caps">{t.brand.budgetUsed}</p>
            <p className="numeric mt-3 text-[32px] font-semibold text-on-surface">
              {formatMoney(totalSpentMinor, { compactZeroCents: true })}
              <span className="ml-2 font-body text-[15px] font-normal text-on-surface-variant">
                din {formatMoney(totalBudgetMinor, { compactZeroCents: true })}
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

      {/* Campaign table (real, scoped to this business). */}
      <Card className="mt-6 overflow-hidden">
        <CardHeader title={t.brand.campaignPerformance} />

        {campaigns.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-display text-[16px] font-semibold text-on-surface">
              {t.brand.noCampaignsTitle}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-[13px] text-on-surface-variant">
              {t.brand.noCampaignsText}
            </p>
            <Button
              className="mt-5"
              icon="add_circle"
              variant="primary"
              onClick={() => navigate("/brand/campanii/nou")}
            >
              {t.brand.newCampaign}
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop: table. */}
            <div className="hidden md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="label-caps px-6 py-3 text-left font-semibold">{t.brand.table.campaign}</th>
                    <th className="label-caps px-6 py-3 text-left font-semibold">{t.brand.table.status}</th>
                    <th className="label-caps px-6 py-3 text-right font-semibold">{t.brand.table.budget}</th>
                    <th className="label-caps px-6 py-3 text-right font-semibold">{t.brand.table.views}</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-white/[0.03] last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-body text-[14px] font-semibold text-on-surface">{campaign.name}</p>
                        <p className="text-[12px] text-on-surface-variant">Start: {campaign.startDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Chip tone={statusTone[campaign.status]}>{t.brand.status[campaign.status]}</Chip>
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

            {/* Phone: the same rows as cards. */}
            <div className="divide-y divide-white/[0.03] md:hidden">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-body text-[15px] font-semibold text-on-surface">
                        {campaign.name}
                      </p>
                      <p className="mt-0.5 text-[12px] text-on-surface-variant">Start: {campaign.startDate}</p>
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
                    <p className="numeric text-[13px] text-on-surface-variant">{formatViews(campaign.views)}</p>
                  </div>
                  <ProgressBar
                    percent={campaign.budgetMinor > 0 ? Math.round((campaign.spentMinor / campaign.budgetMinor) * 100) : 0}
                    className="mt-2.5"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
