import { create } from "zustand";
import { persist } from "zustand/middleware";
import { homeFor, type Role } from "@vira/core";

/**
 * Client-side view of who is signed in.
 *
 * Presentation state only: it decides which chrome and which routes to render.
 * It is NOT the security boundary. The real session is an HttpOnly cookie issued
 * by the .NET gateway (BUILD_PLAN D5), which the SPA cannot read, and every
 * protected endpoint re-checks the role server-side. Anything a user could get
 * by editing localStorage must still be refused by the API.
 *
 * TODO(auth): replace `signInAs*` with the real flows — creator via TikTok
 * OAuth, brand via Firebase — and hydrate `role` from `GET /auth/me` on boot.
 */
interface SessionState {
  role: Role;
  signInAsCreator: () => void;
  signInAsBrand: () => void;
  signOut: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      role: "guest",
      signInAsCreator: () => set({ role: "creator" }),
      signInAsBrand: () => set({ role: "brand" }),
      signOut: () => set({ role: "guest" }),
    }),
    { name: "vira.session" },
  ),
);

export { homeFor };
export type { Role };
