import { cn } from "../lib/cn";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  /** Optical size in px; also drives the rendered glyph size. */
  size?: number;
}

/** Material Symbols Outlined, loaded from the font link in index.html. */
export function Icon({ name, className, filled = false, size = 24 }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined leading-none", className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  );
}
