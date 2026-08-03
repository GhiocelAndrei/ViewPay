import type { CSSProperties } from "react";
import { cn } from "../lib/cn";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  /** Optical size in px; also drives the rendered glyph size. */
  size?: number;
  /**
   * Escape hatch for colours that only exist at runtime — a campaign's accent
   * comes from data, so it cannot be a Tailwind class. Merged after the sizing
   * rules, which are not meant to be overridden.
   */
  style?: CSSProperties;
}

/** Material Symbols Outlined, loaded from the font link in index.html. */
export function Icon({ name, className, filled = false, size = 24, style }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined leading-none", className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}
