import { cn } from "../lib/cn";

/**
 * Vira mark.
 *
 * The two strokes read as a V, but the right arm overshoots and ends in a data
 * point — so the same shape is also a rising measurement line. That is the
 * product in one glyph: views go up, money follows.
 */
export function LogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        style={{ width: size * 0.62, height: size * 0.62 }}
        role="presentation"
      >
        <defs>
          <linearGradient id="vira-mark" x1="4" y1="26" x2="27" y2="5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#947dff" />
            <stop offset="1" stopColor="#cabeff" />
          </linearGradient>
        </defs>
        <path
          d="M6 9.5 L14.5 24.5 L25.5 6"
          stroke="url(#vira-mark)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="25.5" cy="6" r="3.2" fill="#cabeff" />
      </svg>
    </span>
  );
}

/** Mark plus wordmark. Used on public surfaces only — inside the app the
 *  top-left slot belongs to the signed-in user. */
export function Logo({
  size = 36,
  className,
  wordmarkClassName,
}: {
  size?: number;
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark size={size} />
      <span
        className={cn(
          "font-display font-bold tracking-tight text-on-surface",
          wordmarkClassName ?? "text-[19px]",
        )}
      >
        Vira
      </span>
    </span>
  );
}
