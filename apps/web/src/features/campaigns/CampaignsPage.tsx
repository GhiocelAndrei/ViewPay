import { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button, Card, Chip, PageHeader } from "../../components/ui";
import { cn } from "../../lib/cn";
import { t } from "@vira/core";
import { formatMoney } from "@vira/core";
import { campaigns, currentCreator, type Campaign } from "@vira/core";

/**
 * Campaign marketplace. Match strength is *information*, never a gate — the only
 * hard gate is the follower threshold on product-placement campaigns, where the
 * creator has to buy the product themselves.
 */
export default function CampaignsPage() {
  return (
    <div className="mx-auto max-w-container px-6 py-10 md:px-12">
      <PageHeader title={t.campaigns.title} subtitle={t.campaigns.subtitle} />

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {[t.campaigns.filters.niche, t.campaigns.filters.payout, t.campaigns.filters.deadline].map(
          (label) => (
            <button
              key={label}
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded border border-white/5 bg-white/5",
                "px-3 py-2 font-body text-[13px] text-on-surface-variant transition-colors",
                "hover:border-white/15 hover:text-on-surface",
              )}
            >
              {label}
              <Icon name="expand_more" size={16} />
            </button>
          ),
        )}
        <span className="ml-auto text-[13px] text-on-surface-variant">
          {campaigns.length} campanii disponibile
        </span>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [reasonsOpen, setReasonsOpen] = useState(false);
  const locked = campaign.locked;

  return (
    <Card className={cn("flex flex-col p-6", locked && "opacity-70")}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md"
            style={{ backgroundColor: `${campaign.accent}1a`, border: `1px solid ${campaign.accent}33` }}
          >
            <span className="font-display text-[15px] font-bold" style={{ color: campaign.accent }}>
              {campaign.brandName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="label-caps text-[10px]">{campaign.brandName}</p>
            <h3 className="font-display text-[20px] font-semibold text-on-surface">
              {campaign.title}
            </h3>
          </div>
        </div>

        {locked ? (
          <Chip tone="neutral" icon="lock">
            Blocată
          </Chip>
        ) : (
          <Chip tone={campaign.match === "strong" ? "mint" : "creator"} icon="check_circle">
            {campaign.match === "strong" ? t.campaigns.strongMatch : t.campaigns.worthTrying}
          </Chip>
        )}
      </div>

      {/* Brief requirements as chips — structured, so they stay machine-checkable. */}
      <div className="mt-4 flex flex-wrap gap-2">
        {campaign.requirements.map((requirement) => (
          <span
            key={requirement}
            className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1 font-body text-[11px] text-on-surface-variant"
          >
            {requirement}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 rounded-md border border-white/5 bg-surface-container-lowest/60 p-4">
        <div>
          <p className="label-caps text-[10px]">{t.campaigns.payoutRate}</p>
          <p className="numeric mt-1 text-[18px] font-semibold text-creator">
            {formatMoney(campaign.ratePerMilleMinor)}
            <span className="ml-1 font-body text-[11px] font-normal text-on-surface-variant">
              / 1.000
            </span>
          </p>
        </div>
        <div>
          <p className="label-caps text-[10px]">{t.campaigns.estimatedEarnings}</p>
          <p className="numeric mt-1 text-[18px] font-semibold text-on-surface">
            {formatMoney(campaign.estimatedEarningsMinMinor, { compactZeroCents: true })} –{" "}
            {formatMoney(campaign.estimatedEarningsMaxMinor, { compactZeroCents: true })}
          </p>
        </div>
      </div>

      {locked ? (
        <div className="mt-5 rounded-md border border-amber/20 bg-amber/5 p-4">
          <p className="flex items-center gap-2 font-body text-[13px] font-semibold text-amber">
            <Icon name="lock" size={16} />
            {t.campaigns.lockedFollowers(
              campaign.accessRule.minFollowerThreshold.toLocaleString("ro-RO"),
            )}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-on-surface-variant">
            {t.campaigns.productPlacementNote}
          </p>
          <p className="mt-2 text-[11px] text-on-surface-variant/60">
            Ai {currentCreator.followerCount.toLocaleString("ro-RO")} urmăritori.
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setReasonsOpen((open) => !open)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="label-caps text-[10px]">{t.campaigns.whyItMatches}</span>
            <Icon
              name="keyboard_arrow_down"
              size={18}
              className={cn(
                "text-on-surface-variant transition-transform",
                reasonsOpen && "rotate-180",
              )}
            />
          </button>
          {reasonsOpen && (
            <ul className="mt-3 flex animate-fade-up flex-col gap-2">
              {campaign.matchReasons.map((reason) => (
                <li
                  key={reason.text}
                  className="flex items-start gap-2 text-[13px] text-on-surface-variant"
                >
                  <Icon name="check_circle" size={16} className="mt-0.5 shrink-0 text-mint" />
                  {reason.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/5 pt-5">
        <div className="flex gap-8">
          <div>
            <p className="label-caps text-[10px]">{t.campaigns.deadline}</p>
            <p className="mt-1 font-body text-[13px] text-on-surface">{campaign.deadline}</p>
          </div>
          <div>
            <p className="label-caps text-[10px]">{t.campaigns.availability}</p>
            <p className="numeric mt-1 text-[13px] text-on-surface">{campaign.slotsLeft}</p>
          </div>
        </div>
        <Button variant={locked ? "subtle" : "creator"} disabled={locked}>
          {t.campaigns.apply}
        </Button>
      </div>
    </Card>
  );
}
