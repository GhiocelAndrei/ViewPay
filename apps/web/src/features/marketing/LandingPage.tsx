import { Link } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { Logo, LogoMark } from "../../components/Logo";
import { cn } from "../../lib/cn";
import { t, tokens } from "@vira/core";
import { formatMoney } from "@vira/core";
import { feedCampaigns } from "@vira/core";

/**
 * Public landing page — the only screen a guest sees.
 *
 * No sidebar, no app chrome: this is marketing, and the app shell only appears
 * once a role exists. Both audiences are addressed here because the marketplace
 * has two sides, but the primary call to action is the creator one — creators
 * are the scarce side at launch.
 */
export default function LandingPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <Hero />
      <ProofStrip />
      <ForWho />
      <OpenCampaigns />
      <HowItWorks />
      <ForBrands />
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-container items-center gap-6 px-6 py-4 md:px-12">
        <Link to="/">
          <Logo size={38} />
        </Link>

        <nav className="ml-auto flex items-center gap-2">
          <Link
            to="/intra"
            className="hidden rounded px-3 py-2 font-body text-[13px] text-on-surface-variant transition-colors hover:text-on-surface sm:block"
          >
            {t.landing.navBrand}
          </Link>
          <Link
            to="/intra"
            className={cn(
              "rounded bg-primary px-4 py-2 font-body text-[13px] font-bold text-on-primary",
              "shadow-primary-glow transition-transform hover:bg-primary/90 active:scale-[0.98]",
            )}
          >
            {t.landing.signIn}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 top-[-18rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle,#cabeff,transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-container px-6 pb-20 pt-24 text-center md:px-12">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-body text-[12px] text-on-surface-variant">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          {t.landing.heroBadge}
        </span>

        <h1 className="mx-auto mt-8 max-w-4xl font-display text-[44px] font-bold leading-[1.08] tracking-tight text-on-surface md:text-[64px] md:leading-[1.05]">
          {t.landing.heroTitle}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-body-lg text-on-surface-variant">
          {t.landing.heroSubtitle}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/intra"
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded px-6 py-3.5 sm:w-auto",
              "bg-primary font-body text-[15px] font-bold text-on-primary",
              "shadow-primary-glow transition-transform hover:bg-primary/90 active:scale-[0.98]",
            )}
          >
            <Icon name="music_note" size={20} />
            {t.landing.heroCtaCreator}
          </Link>
          <Link
            to="/intra"
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded border border-white/10 px-6 py-3.5 sm:w-auto",
              "font-body text-[15px] text-on-surface transition-colors hover:border-white/25",
            )}
          >
            <Icon name="storefront" size={20} />
            {t.landing.heroCtaBrand}
          </Link>
        </div>

        <p className="mt-5 text-[13px] text-on-surface-variant/60">{t.landing.heroNote}</p>
      </div>
    </section>
  );
}

/**
 * The strip carries the barriers we removed, not vanity metrics. Anyone reading
 * it should be able to tell within a second whether they are allowed in — that
 * is the question both a corner shop and a 2k-follower creator arrive with.
 */
function ProofStrip() {
  const items = [
    { value: "300 €", label: t.landing.proof.minBudget },
    { value: "1.000", label: t.landing.proof.minFollowers },
    { value: "0 €", label: t.landing.proof.creatorFee },
  ];

  return (
    <section className="border-y border-white/5 bg-surface-container-lowest/50">
      <div className="mx-auto grid max-w-container gap-8 px-6 py-10 sm:grid-cols-3 md:px-12">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="numeric text-[32px] font-bold leading-none text-primary">{item.value}</p>
            <p className="label-caps mt-2">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** The two audiences, side by side and named plainly. */
function ForWho() {
  return (
    <section className="mx-auto max-w-container px-6 py-section md:px-12">
      <div className="max-w-2xl">
        <h2 className="font-display text-headline-lg text-on-surface">{t.landing.forWhoTitle}</h2>
        <p className="mt-3 text-body-md text-on-surface-variant">{t.landing.forWhoSubtitle}</p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {t.landing.audiences.map((audience) => (
          <div
            key={audience.eyebrow}
            className="flex flex-col rounded-lg border border-white/5 bg-surface-container-low p-7 transition-colors hover:border-white/[0.12]"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-md border border-primary/20 bg-primary/10">
                <Icon name={audience.icon} size={22} className="text-primary" />
              </div>
              <p className="label-caps text-primary">{audience.eyebrow}</p>
            </div>

            <h3 className="mt-6 font-display text-[24px] font-semibold leading-snug text-on-surface">
              {audience.title}
            </h3>

            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {audience.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[14px] leading-relaxed text-on-surface-variant">
                  <Icon name="check_circle" size={17} className="mt-0.5 shrink-0 text-mint" />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              to="/intra"
              className={cn(
                "mt-7 inline-flex items-center gap-2 self-start rounded border border-primary/50 px-4 py-2.5",
                "font-body text-[13px] font-semibold text-primary transition-colors hover:bg-primary/10",
              )}
            >
              Începe aici
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="mx-auto max-w-container px-6 py-section md:px-12">
      <div className="max-w-2xl">
        <h2 className="font-display text-headline-lg text-on-surface">{t.landing.howTitle}</h2>
        <p className="mt-3 text-body-md text-on-surface-variant">{t.landing.howSubtitle}</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {t.landing.steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-lg border border-white/5 bg-surface-container-low p-6 transition-colors hover:border-white/[0.12]"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md border border-primary/20 bg-primary/10">
                <Icon name={step.icon} size={20} className="text-primary" />
              </div>
              <span className="numeric text-[13px] text-on-surface-variant/50">
                0{index + 1}
              </span>
            </div>
            <h3 className="mt-5 font-display text-[19px] font-semibold text-on-surface">
              {step.title}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-on-surface-variant">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OpenCampaigns() {
  return (
    <section className="border-t border-white/5 bg-surface-container-lowest/40">
      <div className="mx-auto max-w-container px-6 py-section md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-headline-lg text-on-surface">
              {t.landing.campaignsTitle}
            </h2>
            <p className="mt-3 text-body-md text-on-surface-variant">
              {t.landing.campaignsSubtitle}
            </p>
          </div>
          <Link
            to="/intra"
            className="inline-flex items-center gap-1 text-[14px] text-primary transition-opacity hover:opacity-80"
          >
            {t.landing.seeAll}
            <Icon name="arrow_forward" size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {feedCampaigns.slice(0, 4).map((campaign) => (
            <Link
              key={campaign.id}
              to="/intra"
              className={cn(
                "group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-lg",
                "border border-white/10 p-5 transition-transform hover:-translate-y-1",
              )}
              style={{ background: tokens.gradientCss(campaign.gradientStops) }}
            >
              <div
                className="grid h-11 w-11 place-items-center rounded-full border"
                style={{
                  backgroundColor: `${campaign.accent}22`,
                  borderColor: `${campaign.accent}55`,
                }}
              >
                <span
                  className="font-display text-[15px] font-bold"
                  style={{ color: campaign.accent }}
                >
                  {campaign.brandInitials}
                </span>
              </div>

              <div>
                <p className="font-display text-[16px] font-bold leading-snug text-white">
                  „{campaign.hook}”
                </p>
                <p className="mt-1 text-[12px] text-white/55">{campaign.brandName}</p>
                <p
                  className="numeric mt-3 text-[18px] font-bold"
                  style={{ color: campaign.accent }}
                >
                  {formatMoney(campaign.ratePerMilleMinor)}
                  <span className="ml-1 font-body text-[11px] font-normal text-white/50">
                    / 1.000
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForBrands() {
  return (
    <section className="mx-auto max-w-container px-6 py-section md:px-12">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-headline-lg leading-tight text-on-surface">
            {t.landing.brandsTitle}
          </h2>
          <p className="mt-4 max-w-xl text-body-md text-on-surface-variant">
            {t.landing.brandsText}
          </p>

          <ul className="mt-7 flex flex-col gap-3">
            {t.landing.brandsPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[14px] text-on-surface">
                <Icon name="check_circle" size={18} className="mt-0.5 shrink-0 text-mint" />
                {point}
              </li>
            ))}
          </ul>

          <Link
            to="/intra"
            className={cn(
              "mt-8 inline-flex items-center gap-2 rounded border border-primary/50 px-5 py-3",
              "font-body text-[14px] font-semibold text-primary transition-colors hover:bg-primary/10",
            )}
          >
            {t.landing.heroCtaBrand}
            <Icon name="arrow_forward" size={18} />
          </Link>
        </div>

        {/* A real campaign at neighbourhood scale — the numbers a corner shop
            would actually see, not a national brand's. */}
        <div className="rounded-lg border border-white/5 bg-surface-container-low p-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <p className="label-caps">{t.landing.brandsCardLabel}</p>
            <span className="rounded-full border border-mint/20 bg-mint/10 px-2.5 py-1 font-body text-[11px] font-semibold text-mint">
              Activă
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-amber/40 bg-amber/15">
              <span className="font-display text-[14px] font-bold text-amber">SV</span>
            </div>
            <div>
              <p className="font-display text-[15px] font-bold text-on-surface">Shaorma la Vlad</p>
              <p className="text-[12px] text-on-surface-variant">Prima campanie, 9 creatori</p>
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="numeric text-[32px] font-bold leading-none text-on-surface">€180</p>
              <p className="label-caps mt-2">din €300 consumat</p>
            </div>
            <p className="numeric text-[15px] text-on-surface-variant">72.000 vizualizări</p>
          </div>

          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[60%] rounded-full bg-primary" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
            <div>
              <p className="label-caps text-[10px]">Cost la 1.000 de vizualizări</p>
              <p className="numeric mt-1 text-[18px] font-semibold text-primary">€2,50</p>
            </div>
            <div>
              <p className="label-caps text-[10px]">Se restituie</p>
              <p className="numeric mt-1 text-[18px] font-semibold text-on-surface">€120</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-between gap-4 px-6 py-8 md:px-12">
        <div className="flex items-center gap-3">
          <LogoMark size={32} />
          <span className="text-[13px] text-on-surface-variant">{t.landing.footerNote}</span>
        </div>
        <div className="flex gap-6 text-[13px] text-on-surface-variant/70">
          <a href="#" className="transition-colors hover:text-on-surface">
            Termeni
          </a>
          <a href="#" className="transition-colors hover:text-on-surface">
            Confidențialitate
          </a>
          <a href="#" className="transition-colors hover:text-on-surface">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
