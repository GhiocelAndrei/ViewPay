import { Icon } from "../../components/Icon";
import { AreaChart, Button, Card, CardHeader, Chip, PageHeader } from "../../components/ui";
import { t } from "@vira/core";
import { formatMoney, formatViews } from "@vira/core";
import { earnings, type PayoutStatus } from "@vira/core";

const statusTone: Record<PayoutStatus, "mint" | "primary" | "neutral" | "amber"> = {
  paid: "mint",
  scheduledDay7: "primary",
  scheduledDay14: "primary",
  reserved: "neutral",
  underReview: "amber",
};

/**
 * Earnings. The hero number is the month's total; everything else exists to
 * explain why the payable figure differs from it — the 72h settling window and
 * the 20% reserve are stated on screen rather than discovered in a dispute.
 */
export default function EarningsPage() {
  return (
    <div className="mx-auto max-w-container px-6 py-10 md:px-12">
      <PageHeader
        title={t.earnings.title}
        action={
          <Button icon="account_balance" variant="primary">
            {t.earnings.withdraw}
          </Button>
        }
      />

      {/* Hero */}
      <Card className="mt-8 p-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-caps">{t.earnings.thisMonth}</p>
            <p className="numeric mt-2 text-[56px] font-bold leading-none text-primary">
              {formatMoney(earnings.thisMonthMinor)}
            </p>
          </div>
          <Chip tone="mint" icon="trending_up">
            +{earnings.trendPercent.toLocaleString("ro-RO")}% {t.common.vsLastMonth}
          </Chip>
        </div>
      </Card>

      {/* The three numbers that explain the hero */}
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="label-caps">{t.earnings.pendingValidation}</p>
            <Icon name="hourglass_top" size={18} className="text-amber/70" />
          </div>
          <p className="numeric mt-3 text-[28px] font-semibold text-on-surface">
            {formatMoney(earnings.pendingValidationMinor)}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-on-surface-variant/70">
            {t.earnings.pendingNote}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="label-caps">{t.earnings.reserve}</p>
            <Icon name="lock_clock" size={18} className="text-on-surface-variant/60" />
          </div>
          <p className="numeric mt-3 text-[28px] font-semibold text-on-surface">
            {formatMoney(earnings.reserveMinor)}
          </p>
          <p className="mt-2 text-[12px] text-on-surface-variant/70">
            {t.earnings.reserveNote(earnings.reserveReleaseDate)}
          </p>
        </Card>

        <Card className="border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center justify-between">
            <p className="label-caps text-primary">{t.earnings.available}</p>
            <Icon name="payments" size={18} className="text-primary/70" />
          </div>
          <p className="numeric mt-3 text-[28px] font-semibold text-primary">
            {formatMoney(earnings.availableMinor)}
          </p>
          <p className="mt-2 text-[12px] text-on-surface-variant/70">
            Se virează în contul tău în 1–2 zile lucrătoare.
          </p>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="mt-6">
        <CardHeader title={t.earnings.timeline} />
        <div className="px-6 pb-6 pt-4">
          <AreaChart points={earnings.timeline} />
        </div>
      </Card>

      {/* Payout rows */}
      <Card className="mt-6 overflow-hidden">
        <CardHeader title={t.earnings.recentCampaigns} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="label-caps px-6 py-3 text-left font-semibold">
                  {t.earnings.table.campaign}
                </th>
                <th className="label-caps px-6 py-3 text-right font-semibold">
                  {t.earnings.table.views}
                </th>
                <th className="label-caps px-6 py-3 text-right font-semibold">
                  {t.earnings.table.amount}
                </th>
                <th className="label-caps px-6 py-3 text-right font-semibold">
                  {t.earnings.table.status}
                </th>
              </tr>
            </thead>
            <tbody>
              {earnings.rows.map((row) => (
                <tr key={row.id} className="border-b border-white/[0.03] last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-body text-[14px] font-semibold text-on-surface">
                      {row.campaignName}
                    </p>
                    <p className="text-[12px] text-on-surface-variant">{row.brandName}</p>
                  </td>
                  <td className="numeric px-6 py-4 text-right text-[14px] text-on-surface-variant">
                    {formatViews(row.validatedViews)}
                  </td>
                  <td className="numeric px-6 py-4 text-right text-[15px] font-semibold text-on-surface">
                    {formatMoney(row.amountMinor)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Chip tone={statusTone[row.status]}>{t.earnings.status[row.status]}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
