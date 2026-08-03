import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { cn } from "../../lib/cn";
import { t } from "@vira/core";
import { formatMoney, tokens } from "@vira/core";
import { feedCampaigns, type FeedCampaign } from "@vira/core";

/**
 * Creator home — a TikTok-style vertical feed of *campaigns*, one per screen.
 *
 * There is no video and no like/share/comment rail: the creator is browsing
 * briefs, not watching content, so each card leads with the offer — what the
 * brand wants said, what it pays, and what is left to take.
 */
export default function FeedPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveIndex(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { root: container, threshold: 0.6 },
    );

    container.querySelectorAll("[data-index]").forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* Feed tabs, TikTok-style. "Pentru tine" is ranked by match. */}
      <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-6">
          <button
            type="button"
            className="font-display text-[15px] font-medium text-on-surface-variant/60 transition-colors hover:text-on-surface"
          >
            Toate
          </button>
          <button
            type="button"
            className="relative font-display text-[15px] font-semibold text-on-surface"
          >
            Pentru tine
            <span className="absolute -bottom-2 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="h-[calc(100dvh-70px)] snap-y snap-mandatory overflow-y-auto scroll-smooth"
      >
        {feedCampaigns.map((campaign, index) => (
          <CampaignSlide
            key={campaign.id}
            campaign={campaign}
            index={index}
            isLast={index === feedCampaigns.length - 1}
            isActive={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
}

function CampaignSlide({
  campaign,
  index,
  isActive,
  isLast,
}: {
  campaign: FeedCampaign;
  index: number;
  isActive: boolean;
  isLast: boolean;
}) {
  const [saved, setSaved] = useState(false);

  return (
    <section
      data-index={index}
      className="flex h-full snap-start snap-always items-center justify-center px-4 py-6"
    >
      <div className="flex h-full max-h-[calc(100dvh-130px)] items-center gap-4">
        {/* Card */}
        <div
          className={cn(
            "relative flex aspect-[9/16] h-full min-h-0 flex-col overflow-hidden rounded-xl",
            "border border-white/10 shadow-video-glow",
          )}
          style={{ background: tokens.gradientCss(campaign.gradientStops) }}
        >
          {/* Ambient accent glow behind the brand mark */}
          <div
            className="pointer-events-none absolute left-1/2 top-[18%] h-56 w-56 -translate-x-1/2 rounded-full opacity-25 blur-3xl"
            style={{ background: campaign.accent }}
          />

          {/* Brand mark + hook */}
          <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div
              className="grid h-24 w-24 place-items-center rounded-full border backdrop-blur-sm"
              style={{
                backgroundColor: `${campaign.accent}22`,
                borderColor: `${campaign.accent}55`,
              }}
            >
              <span
                className="font-display text-[28px] font-bold tracking-tight"
                style={{ color: campaign.accent }}
              >
                {campaign.brandInitials}
              </span>
            </div>

            <h2 className="mt-7 font-display text-[30px] font-bold leading-tight text-white">
              „{campaign.hook}”
            </h2>
            <p className="mt-2 max-w-[22ch] text-body-md text-white/60">
              {campaign.hookSubtitle}
            </p>
          </div>

          {/* Offer block */}
          <div className="relative px-6 pb-6">
            <div className="mb-4">
              <p className="font-display text-[17px] font-bold text-white">
                {campaign.brandName}
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-white/55">
                {campaign.description}
              </p>
            </div>

            {/* The rate — the number the creator is actually shopping on. */}
            <div
              className="flex items-baseline gap-2 rounded-md border px-4 py-3"
              style={{
                backgroundColor: `${campaign.accent}14`,
                borderColor: `${campaign.accent}33`,
              }}
            >
              <span
                className="numeric text-[24px] font-bold leading-none"
                style={{ color: campaign.accent }}
              >
                {formatMoney(campaign.ratePerMilleMinor)}
              </span>
              <span className="text-[12px] text-white/55">
                la 1.000 de vizualizări validate
              </span>
            </div>

            <div className="mt-3 space-y-1 text-[12.5px] text-white/55">
              <p>
                Câștig estimat la audiența ta:{" "}
                <span className="numeric font-semibold text-white/85">
                  {formatMoney(campaign.estimatedMinMinor, { compactZeroCents: true })}–
                  {formatMoney(campaign.estimatedMaxMinor, { compactZeroCents: true })}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span>
                  Buget rămas:{" "}
                  <span className="numeric text-white/85">
                    {formatMoney(campaign.budgetRemainingMinor, { compactZeroCents: true })}
                  </span>
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="numeric text-white/85">
                  {campaign.slotsLeft} {t.campaigns.availability.toLowerCase()}
                </span>
              </p>
            </div>

            <Link
              to="/campanii"
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded py-3",
                "font-body text-[14px] font-bold text-background transition-transform",
                "active:scale-[0.98]",
              )}
              style={{ backgroundColor: campaign.accent }}
            >
              Vezi campania
              <Icon name="arrow_forward" size={18} />
            </Link>
          </div>
        </div>

        {/* Right rail — match score and the two actions that matter. */}
        <div className="flex w-16 shrink-0 flex-col items-center gap-6 self-end pb-10">
          <div className="flex flex-col items-center gap-1">
            <div
              className="grid h-14 w-14 place-items-center rounded-full border"
              style={{
                backgroundColor: `${campaign.accent}1a`,
                borderColor: `${campaign.accent}44`,
              }}
            >
              <span
                className="numeric text-[15px] font-bold"
                style={{ color: campaign.accent }}
              >
                {campaign.matchPercent}%
              </span>
            </div>
            <span className="label-caps text-[9px]">potrivire</span>
          </div>

          <button
            type="button"
            onClick={() => setSaved((value) => !value)}
            className="flex flex-col items-center gap-1 text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <Icon name="bookmark" size={26} filled={saved} className={cn(saved && "text-primary")} />
            <span className="label-caps text-[9px]">Salvează</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center gap-1 text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <Icon name="send" size={26} />
            <span className="label-caps text-[9px]">Trimite</span>
          </button>

          {!isLast && (
            <div
              className={cn(
                "mt-2 flex flex-col items-center transition-opacity",
                isActive ? "animate-float opacity-30" : "opacity-0",
              )}
            >
              <Icon name="expand_more" size={22} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
