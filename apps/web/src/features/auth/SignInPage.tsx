import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { Logo } from "../../components/Logo";
import { cn } from "../../lib/cn";
import { t, tokens, feedCampaigns } from "@vira/core";
import { homeFor, useSession } from "../../lib/session";

/**
 * Sign-in. Two doors, one screen.
 *
 * TODO(auth): "Continue with TikTok" must redirect to the gateway's OAuth start
 * route, and the brand door to the Firebase flow. Both end with the backend
 * issuing an HttpOnly session cookie — the SPA never holds a token
 * (BUILD_PLAN D5). The local role store only renders chrome.
 */
export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signInAsCreator = useSession((state) => state.signInAsCreator);
  const signInAsBrand = useSession((state) => state.signInAsBrand);

  // Where the guard sent us from, if anywhere.
  const intended = (location.state as { from?: string } | null)?.from;

  function enter(role: "creator" | "brand") {
    if (role === "creator") signInAsCreator();
    else signInAsBrand();
    navigate(intended ?? homeFor(role), { replace: true });
  }

  return (
    <div className="grid min-h-full lg:grid-cols-2">
      {/* Left: proof wall */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 grid grid-cols-3 gap-3 p-6 opacity-40 blur-[2px]">
          {[...feedCampaigns, ...feedCampaigns].slice(0, 9).map((campaign, index) => (
            <div
              key={`${campaign.id}-${index}`}
              className="rounded-lg border border-white/5"
              style={{ background: tokens.gradientCss(campaign.gradientStops) }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/85 to-background/40" />

        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="numeric text-[56px] font-bold leading-none text-primary">€134.000</p>
          <p className="label-caps mt-2">{t.signIn.paidOut}</p>
        </div>
      </div>

      {/* Right: the two doors */}
      <div className="flex items-center justify-center px-6 py-16 md:px-12">
        <div className="w-full max-w-md">
          <Link to="/">
            <Logo size={44} wordmarkClassName="text-[22px]" />
          </Link>

          <h1 className="mt-12 font-display text-headline-lg leading-tight text-on-surface">
            {t.signIn.title}
          </h1>
          <p className="mt-3 text-body-md text-on-surface-variant">{t.signIn.subtitle}</p>

          <div className="mt-10 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => enter("creator")}
              className={cn(
                "group flex items-start gap-4 rounded-lg border border-primary/30 bg-primary/5 p-5 text-left",
                "transition-colors hover:border-primary/60 hover:bg-primary/10",
              )}
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
                <Icon name="music_note" size={22} />
              </div>
              <div className="flex-1">
                <p className="font-display text-[16px] font-bold text-on-surface">
                  {t.signIn.creatorTitle}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-on-surface-variant">
                  {t.signIn.creatorText}
                </p>
              </div>
              <Icon
                name="arrow_forward"
                size={20}
                className="mt-1 text-primary transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              onClick={() => enter("brand")}
              className={cn(
                "group flex items-start gap-4 rounded-lg border border-white/10 p-5 text-left",
                "transition-colors hover:border-white/25 hover:bg-white/[0.03]",
              )}
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5">
                <Icon name="business_center" size={22} className="text-on-surface-variant" />
              </div>
              <div className="flex-1">
                <p className="font-display text-[16px] font-bold text-on-surface">
                  {t.signIn.brandTitle}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-on-surface-variant">
                  {t.signIn.brandText}
                </p>
              </div>
              <Icon
                name="arrow_forward"
                size={20}
                className="mt-1 text-on-surface-variant transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>

          <p className="mt-8 text-[12px] leading-relaxed text-on-surface-variant/60">
            {t.signIn.legal}
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <Icon name="arrow_back" size={16} />
            {t.signIn.backToSite}
          </Link>
        </div>
      </div>
    </div>
  );
}
