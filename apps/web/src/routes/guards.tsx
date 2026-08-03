import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { homeFor, useSession, type Role } from "../lib/session";

/**
 * Route guards.
 *
 * These shape navigation, they do not enforce access — the gateway does that on
 * every request. Treat a guard slipping as a UX bug, never as a breach.
 */

export function RequireRole({
  role,
  children,
}: {
  role: Exclude<Role, "guest">;
  children: ReactNode;
}) {
  const current = useSession((state) => state.role);
  const location = useLocation();

  if (current === "guest") {
    // Remember where they were headed so sign-in can return them there.
    return <Navigate to="/intra" state={{ from: location.pathname }} replace />;
  }
  if (current !== role) {
    return <Navigate to={homeFor(current)} replace />;
  }
  return <>{children}</>;
}

/** Keeps signed-in users out of the landing and sign-in screens. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const current = useSession((state) => state.role);
  if (current !== "guest") {
    return <Navigate to={homeFor(current)} replace />;
  }
  return <>{children}</>;
}
