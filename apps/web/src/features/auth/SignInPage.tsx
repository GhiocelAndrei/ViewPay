import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon";
import { cn } from "../../lib/cn";
import { t } from "@vira/core";
import { AuthShell } from "./AuthShell";

/**
 * Which side are you on.
 *
 * This screen no longer signs anyone in — it routes. The two doors lead to
 * genuinely different flows: a creator authenticates with TikTok and never
 * creates an account here, a business fills in a registration form. Collapsing
 * that into one button would have to lie about one of them.
 *
 * Anything the guards were trying to reach is forwarded along, so a creator
 * bounced off `/castiguri` still lands there after TikTok returns.
 */
export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const intended = (location.state as { from?: string } | null)?.from;

  function go(path: string, mode?: "login" | "register") {
    navigate(path, { state: { from: intended, mode } });
  }

  const doors = [
    {
      path: "/intra/creator",
      icon: "music_note",
      title: t.signIn.creatorTitle,
      text: t.signIn.creatorText,
      primary: true,
      // No mode: a creator has nothing to register. TikTok is the account.
      mode: undefined,
    },
    {
      path: "/intra/afacere",
      icon: "business_center",
      title: t.signIn.brandTitle,
      text: t.signIn.brandText,
      primary: false,
      // This screen is reached from "Loghează-te", so a business arriving here
      // already has an account. The landing page's own call to action is what
      // opens the registration form instead.
      mode: "login" as const,
    },
  ];

  return (
    <AuthShell title={t.signIn.title} subtitle={t.signIn.subtitle}>
      <div className="flex flex-col gap-3">
        {doors.map((door) => (
          <button
            key={door.path}
            type="button"
            onClick={() => go(door.path, door.mode)}
            className={cn(
              "group flex items-start gap-4 rounded-lg border p-5 text-left transition-colors",
              door.primary
                ? "border-creator/30 bg-creator/5 hover:border-creator/60 hover:bg-creator/10"
                : "border-business/30 bg-business/5 hover:border-business/60 hover:bg-business/10",
            )}
          >
            <span
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-full",
                door.primary
                  ? "bg-creator-container text-on-creator"
                  : "bg-business-container text-on-business",
              )}
            >
              <Icon name={door.icon} size={22} />
            </span>
            <span className="flex-1">
              <span className="block font-display text-[16px] font-bold text-on-surface">
                {door.title}
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-on-surface-variant">
                {door.text}
              </span>
            </span>
            <Icon
              name="arrow_forward"
              size={20}
              className={cn(
                "mt-1 transition-transform group-hover:translate-x-1",
                door.primary ? "text-creator" : "text-business",
              )}
            />
          </button>
        ))}
      </div>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-1.5 text-[13px] text-on-surface-variant transition-colors hover:text-on-surface"
      >
        <Icon name="arrow_back" size={16} />
        {t.signIn.backToSite}
      </Link>
    </AuthShell>
  );
}
