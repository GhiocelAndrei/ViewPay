import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SurfaceBackdrop } from "../components/SurfaceBackdrop";
import { cn } from "../lib/cn";
import { t } from "@vira/core";
import { useSession } from "../lib/session";
import { brandSummary } from "@vira/core";

const navItems = [
  { to: "/brand", icon: "campaign", label: t.nav.campaigns, end: true },
  { to: "/brand/aprobari", icon: "fact_check", label: t.approvals.navLabel, end: false },
  { to: "/brand/analize", icon: "insights", label: t.nav.analytics, end: false },
  { to: "/brand/creatori", icon: "group", label: t.nav.creators, end: false },
];

/**
 * Brands work on desktop with a top nav — deliberately different chrome from the
 * creator app so the two sides never feel like the same screen with a swapped menu.
 */
export function BrandLayout() {
  const navigate = useNavigate();
  const signOut = useSession((state) => state.signOut);

  function leave() {
    signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="relative min-h-full">
      <SurfaceBackdrop />

      <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-container items-center gap-8 px-6 py-4 md:px-12">
          {/* Identity on the left, mirroring the creator app. */}
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5">
              <span className="font-display text-[14px] font-semibold text-on-surface">
                {brandSummary.managerName.charAt(0)}
              </span>
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate font-display text-[15px] font-bold leading-tight text-on-surface">
                {brandSummary.managerName}
              </p>
              <p className="label-caps text-[9px] leading-tight">{t.roles.brandManager}</p>
            </div>
          </div>

          {/* Desktop nav. On phones this is replaced by the bottom tab bar —
              a shrunken desktop nav is not the same thing as mobile parity. */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded px-3 py-2 font-display text-[13px] transition-colors",
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
                  )
                }
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              aria-label={t.common.search}
              className="text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <Icon name="search" size={20} />
            </button>
            <button
              type="button"
              aria-label={t.common.notifications}
              className="text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <Icon name="notifications" size={20} />
            </button>
            <button
              type="button"
              onClick={leave}
              aria-label={t.nav.logout}
              className="border-l border-white/5 pl-4 text-on-surface-variant transition-colors hover:text-error"
            >
              <Icon name="logout" size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* pb clears the fixed tab bar on phones. */}
      <div className="relative z-10 pb-24 md:pb-0">
        <Outlet />
      </div>

      {/* Mobile navigation. Brands get the same reach as on desktop. */}
      <nav
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 md:hidden",
          "border-t border-white/5 bg-background/90 backdrop-blur-xl",
          "pb-[env(safe-area-inset-bottom)]",
        )}
      >
        <div className="flex items-stretch">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center gap-1 py-3 transition-colors",
                  isActive ? "text-primary" : "text-on-surface-variant",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon name={item.icon} size={22} filled={isActive} />
                  <span className="font-body text-[10px] font-semibold">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
