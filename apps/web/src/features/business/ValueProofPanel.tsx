import { Icon } from "../../components/Icon";
import { Card } from "../../components/ui";
import { cn } from "../../lib/cn";
import { t } from "@vira/core";
import { SMALL_CREATOR_FOLLOWER_CEILING, brandSummary, leaderboard } from "@vira/core";
import { formatMoney, formatViews } from "@vira/core";

/**
 * Why paying here is different — argued with the brand's own numbers.
 *
 * The positioning is deliberately *demonstrated* rather than asserted. Anyone can
 * put "no middleman" on a dashboard; the three figures below are the same data
 * the rest of the screen renders, read for what it proves:
 *
 *   - budget not yet consumed  → you are not paying ahead of results
 *   - views from small creators → results do not track follower counts
 *   - successful API reads      → the numbers are measured, not estimated
 *
 * No commission rate appears here. Vira's own take is not documented anywhere in
 * the repo, and a percentage invented for a demo is a percentage the client will
 * quote back. The contrast is structural and every line of it is defensible.
 *
 * View shares are counts, never money: the only monetary figure is the unspent
 * budget, which is an exact integer subtraction of two amounts that already
 * exist — nothing is divided, apportioned or recomputed (CLAUDE.md #1, #4).
 */
export default function ValueProofPanel() {
  const unspentMinor = brandSummary.budgetMinor - brandSummary.totalSpentMinor;

  const smallCreatorViews = leaderboard
    .filter((row) => row.followerCount < SMALL_CREATOR_FOLLOWER_CEILING)
    .reduce((sum, row) => sum + row.validatedViews, 0);
  const allCreatorViews = leaderboard.reduce((sum, row) => sum + row.validatedViews, 0);
  const smallCreatorPercent =
    allCreatorViews > 0 ? Math.round((smallCreatorViews / allCreatorViews) * 100) : 0;

  return (
    <Card className="mt-6 overflow-hidden border-primary/15">
      <div className="border-b border-white/5 px-6 py-5">
        <h2 className="font-display text-headline-md text-on-surface">{t.valueProof.title}</h2>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-6 text-on-surface-variant">
          {t.valueProof.subtitle}
        </p>
      </div>

      {/* The contrast. Two columns on desktop, stacked on a phone — the old model
          reads muted, the current one reads in the accent. */}
      <div className="grid gap-px bg-white/5 md:grid-cols-2">
        <div className="bg-surface-container-low p-6">
          <p className="label-caps flex items-center gap-2 text-on-surface-variant/60">
            <Icon name="history" size={16} />
            {t.valueProof.beforeTitle}
          </p>
          <ul className="mt-4 grid gap-3">
            {t.valueProof.before.map((line) => (
              <li key={line} className="flex gap-2.5">
                <Icon name="close" size={16} className="mt-0.5 shrink-0 text-on-surface-variant/40" />
                <span className="text-[13px] leading-5 text-on-surface-variant/70">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-primary/[0.06] p-6">
          <p className="label-caps flex items-center gap-2 text-primary">
            <Icon name="bolt" size={16} filled />
            {t.valueProof.afterTitle}
          </p>
          <ul className="mt-4 grid gap-3">
            {t.valueProof.after.map((line) => (
              <li key={line} className="flex gap-2.5">
                <Icon name="check" size={16} className="mt-0.5 shrink-0 text-mint" />
                <span className="text-[13px] leading-5 text-on-surface">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Three proofs, each pulled from data already on this screen. */}
      <div className="grid gap-px border-t border-white/5 bg-white/5 sm:grid-cols-3">
        <Proof
          value={formatMoney(unspentMinor, { compactZeroCents: true })}
          label={t.valueProof.unspentLabel}
          note={t.valueProof.unspentNote}
          tone="mint"
        />
        {/* The ceiling is spelled out, not compacted: the landing page promises
            "1.000 de urmăritori", and a "10 K" beside it reads like a different
            product. */}
        <Proof
          value={`${smallCreatorPercent}%`}
          label={t.valueProof.smallCreatorsLabel(
            SMALL_CREATOR_FOLLOWER_CEILING.toLocaleString("ro-RO"),
          )}
          note={t.valueProof.smallCreatorsNote}
          tone="primary"
          detail={formatViews(smallCreatorViews)}
        />
        <Proof
          value={brandSummary.measurementPollsSucceeded.toLocaleString("ro-RO")}
          label={t.valueProof.measuredLabel}
          note={t.valueProof.measuredNote}
          tone="neutral"
          detail={`din ${brandSummary.measurementPollsExpected.toLocaleString("ro-RO")}`}
        />
      </div>

      <p className="bg-surface-container-low px-6 py-5 text-[13px] leading-6 text-on-surface-variant">
        {t.valueProof.closing}
      </p>
    </Card>
  );
}

function Proof({
  value,
  label,
  note,
  detail,
  tone,
}: {
  value: string;
  label: string;
  note: string;
  detail?: string;
  tone: "mint" | "primary" | "neutral";
}) {
  return (
    <div className="bg-surface-container-low p-6">
      <p
        className={cn(
          "numeric text-[32px] font-semibold leading-none",
          tone === "mint" && "text-mint",
          tone === "primary" && "text-primary",
          tone === "neutral" && "text-on-surface",
        )}
      >
        {value}
        {detail && (
          <span className="ml-2 font-body text-[13px] font-normal text-on-surface-variant/60">
            {detail}
          </span>
        )}
      </p>
      <p className="mt-2.5 text-[13px] font-semibold text-on-surface">{label}</p>
      <p className="mt-1 text-[12px] leading-5 text-on-surface-variant/70">{note}</p>
    </div>
  );
}
