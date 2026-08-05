import { Card, PageHeader, StatTile } from "../../components/ui";
import { Icon } from "../../components/Icon";
import { t } from "@vira/core";
import { formatMoney } from "@vira/core";

/**
 * Creators working on this brand's campaigns.
 *
 * Empty until a campaign-participation model exists (which creators joined, their
 * validated views and earnings). We show zeros + an empty state rather than the
 * global seed roster, which are not *this brand's* creators.
 */
export default function CreatorsPage() {
  return (
    <div className="mx-auto max-w-container px-6 py-10 md:px-12">
      <PageHeader title={t.creators.title} subtitle={t.creators.subtitle} />

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <StatTile label={t.creators.totalCreators} value="0" icon="group" />
        <StatTile label={t.creators.totalValidatedViews} value="0" icon="visibility" />
        <StatTile label={t.creators.totalPaid} value={formatMoney(0, { compactZeroCents: true })} icon="payments" />
      </div>

      <Card className="mt-6 px-6 py-12 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5">
          <Icon name="group" size={24} className="text-on-surface-variant" />
        </div>
        <p className="mt-4 font-display text-[16px] font-semibold text-on-surface">{t.creators.emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-5 text-on-surface-variant">
          {t.creators.emptyText}
        </p>
      </Card>
    </div>
  );
}
