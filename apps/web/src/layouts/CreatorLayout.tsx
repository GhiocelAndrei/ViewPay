import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { cn } from "../lib/cn";
import { t } from "@vira/core";
import { formatMoney } from "@vira/core";
import { useSession } from "../lib/session";
import { currentCreator, earnings } from "@vira/core";

const navItems = [
  { to: "/feed", icon: "dynamic_feed", label: t.nav.feed },
  { to: "/campanii", icon: "campaign", label: t.nav.campaigns },
  { to: "/profil", icon: "account_circle", label: t.nav.profile },
  { to: "/castiguri", icon: "payments", label: t.nav.earnings },
  { to: "/asistent", icon: "smart_toy", label: t.nav.assistant },
];

const secondaryItems = [
  { icon: "settings", label: t.nav.settings },
  { icon: "help", label: t.nav.support },
];

function NavItem({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-4 border-l-4 px-8 py-3 transition-all",
          isActive
            ? "border-primary bg-primary/5 font-semibold text-primary"
            : "border-transparent text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
        )
      }
    >
      <Icon name={icon} size={22} />
      <span className="font-display text-[14px]">{label}</span>
    </NavLink>
  );
}

export function CreatorLayout() {
  const navigate = useNavigate();
  const signOut = useSession((state) => state.signOut);

  function leave() {
    signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-full bg-background">
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-full w-sidebar flex-col gap-4 py-8 md:flex",
          "border-r border-white/5 bg-surface-dim/80 backdrop-blur-xl",
        )}
      >
        {/* Identity lives here, not in the header — one place, no duplication. */}
        <div className="mb-6 px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5">
              <span className="font-display text-[16px] font-semibold text-on-surface">
                {currentCreator.displayName.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-[16px] font-bold tracking-tight text-on-surface">
                {currentCreator.displayName}
              </p>
              <p className="label-caps text-[10px]">{t.roles.creator}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Personal earnings card — the number that should always be one glance away. */}
        <div className="mx-6 mb-2 rounded-md border border-white/5 bg-surface-container-lowest/80 p-4">
          <p className="label-caps text-[10px]">{t.feed.yourEarnings}</p>
          <p className="numeric mt-1 text-[22px] font-semibold text-primary">
            {formatMoney(earnings.thisMonthMinor)}
          </p>
          <NavLink
            to="/campanii"
            className="mt-2 inline-flex items-center gap-1 text-[11px] text-on-surface-variant transition-colors hover:text-primary"
          >
            {t.feed.firstCampaignCta}
            <Icon name="arrow_forward" size={13} />
          </NavLink>
        </div>

        <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
          {secondaryItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex items-center gap-4 px-8 py-2.5 text-on-surface-variant transition-all hover:bg-white/5 hover:text-on-surface"
            >
              <Icon name={item.icon} size={20} />
              <span className="font-display text-[14px]">{item.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={leave}
            className="flex items-center gap-4 px-8 py-2.5 text-on-surface-variant transition-all hover:bg-white/5 hover:text-error"
          >
            <Icon name="logout" size={20} />
            <span className="font-display text-[14px]">{t.nav.logout}</span>
          </button>
        </div>
      </aside>

      <div className="md:ml-sidebar">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/5 bg-background/70 px-6 py-4 backdrop-blur-xl md:px-12">
          {/* Mobile only — on desktop the sidebar carries the identity. */}
          <div className="md:hidden">
            <Logo size={32} wordmarkClassName="text-[17px]" />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              aria-label={t.common.notifications}
              className="text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <Icon name="notifications" size={22} />
            </button>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
