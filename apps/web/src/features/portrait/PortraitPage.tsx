import { Icon } from "../../components/Icon";
import { Button, Card, Chip, ProgressBar } from "../../components/ui";
import { cn } from "../../lib/cn";
import { t } from "@vira/core";
import { formatCompactNumber } from "@vira/core";
import { currentCreator, portrait } from "@vira/core";

/**
 * The AI Creator Portrait — the demo's "wow" screen.
 *
 * Two rules from CLAUDE.md are visible in the markup: every claim renders its
 * proving clip (no evidence, no render), and the confidence tier is always on
 * screen so an early portrait never reads as settled fact. No letter grades:
 * a score without a receipt is exactly what this product refuses to ship.
 */
export default function PortraitPage() {
  return (
    <div className="mx-auto max-w-container px-6 py-10 md:px-12">
      {/* Identity */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="grid h-24 w-24 place-items-center rounded-full border border-primary/20 bg-primary/10">
          <span className="font-display text-[32px] font-bold text-primary">
            {currentCreator.displayName.charAt(0)}
          </span>
        </div>
        <div>
          <h1 className="font-display text-headline-lg text-on-surface">
            {currentCreator.displayName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-on-surface-variant">{currentCreator.handle}</span>
            <Chip tone="primary" icon={currentCreator.verified ? "verified" : undefined}>
              <span className="numeric">{formatCompactNumber(currentCreator.followerCount)}</span>
              <span className="ml-1 font-normal">{t.portrait.followers}</span>
            </Chip>
          </div>
        </div>

        <div className="ml-auto flex gap-2">
          <Button variant="primary" icon="face" size="sm">
            {t.portrait.tabPortrait}
          </Button>
          <Button variant="subtle" icon="movie" size="sm">
            {t.portrait.tabVideos}
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Archetype */}
        <Card className="relative overflow-hidden p-8">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle,#cabeff,transparent 70%)" }}
          />
          <div className="relative">
            <div className="flex items-center gap-3">
              <p className="label-caps">{t.portrait.archetype}</p>
              <Chip tone="amber">{t.portrait.preliminary}</Chip>
            </div>
            <h2 className="mt-3 font-display text-[40px] font-semibold leading-tight text-on-surface">
              {portrait.archetype}
            </h2>
            <p className="mt-4 max-w-xl text-body-lg italic text-on-surface-variant">
              „{portrait.tagline}”
            </p>
            <p className="mt-6 max-w-xl text-[12px] leading-relaxed text-on-surface-variant/70">
              {t.portrait.preliminaryNote}
            </p>
          </div>
        </Card>

        {/* Style dimensions */}
        <Card className="p-6">
          <p className="label-caps">{t.portrait.styleDimensions}</p>
          <div className="mt-5 flex flex-col gap-4">
            {portrait.dimensions.map((dimension) => (
              <div key={dimension.key}>
                <div className="flex items-baseline justify-between">
                  <span className="font-body text-[13px] text-on-surface">{dimension.label}</span>
                  <span className="numeric text-[13px] text-on-surface-variant">
                    {dimension.value}
                  </span>
                </div>
                <ProgressBar percent={dimension.value} className="mt-1.5" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Evidence — the part that makes the portrait credible. */}
      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-headline-md text-on-surface">{t.portrait.evidence}</h2>
          <p className="text-[13px] text-on-surface-variant">{t.portrait.evidenceNote}</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {portrait.claims.map((claim) => (
            <Card key={claim.id} className="flex flex-col p-5">
              <p className="flex-1 font-body text-[15px] leading-relaxed text-on-surface">
                {claim.statement}
              </p>

              {/* Receipt. Required by the type — a claim cannot exist without it. */}
              <div className="mt-5 flex items-center gap-3 rounded-md border border-white/5 bg-surface-container-lowest/60 p-3">
                <div
                  className={cn(
                    "grid h-12 w-9 shrink-0 place-items-center rounded border border-white/10",
                    "bg-gradient-to-b from-primary/20 to-transparent",
                  )}
                >
                  <Icon name="play_arrow" size={16} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-body text-[12px] font-semibold text-on-surface">
                    {claim.evidence.clipTitle}
                  </p>
                  <p className="numeric text-[11px] text-on-surface-variant">
                    {claim.evidence.clipDate} · {claim.evidence.timestamp}
                  </p>
                </div>
                <button
                  type="button"
                  className="ml-auto shrink-0 text-on-surface-variant transition-colors hover:text-primary"
                  aria-label={t.portrait.seeClip}
                >
                  <Icon name="arrow_outward" size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Growth tip */}
      <Card className="mt-6 flex items-start gap-4 border-primary/20 bg-primary/5 p-6">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15">
          <Icon name="lightbulb" size={20} className="text-primary" />
        </div>
        <div>
          <p className="label-caps text-primary">{t.portrait.growthTip}</p>
          <p className="mt-2 max-w-2xl text-body-md text-on-surface">{portrait.growthTip}</p>
        </div>
      </Card>
    </div>
  );
}
