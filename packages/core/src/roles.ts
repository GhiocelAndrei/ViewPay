/**
 * Roles are shared; the *session store* is not.
 *
 * `apps/web` persists a role in localStorage to pick chrome; `apps/mobile` will
 * hold a creator session in SecureStore. Neither is a security boundary — the
 * .NET gateway owns the HttpOnly cookie and re-checks the role on every request.
 */
export type Role = "guest" | "creator" | "brand";

/** Web-only routing helper; the mobile app has a single role and no such branch. */
export function homeFor(role: Role): string {
  switch (role) {
    case "creator":
      return "/feed";
    case "brand":
      return "/brand";
    default:
      return "/";
  }
}
