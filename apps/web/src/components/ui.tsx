import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import { Icon } from "./Icon";

/* -------------------------------------------------------------------------- */
/* Button                                                                      */
/* -------------------------------------------------------------------------- */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * `primary` is the shared violet — use it only where both audiences are in
   * the room (payout, AI, statistics). One-sided screens take `business` or
   * `creator`, coloured by whose action the button performs.
   */
  variant?: "primary" | "business" | "creator" | "ghost" | "subtle";
  size?: "sm" | "md";
  icon?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded font-body font-semibold",
        "transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2.5 text-sm",
        variant === "primary" &&
          "bg-primary text-on-primary shadow-primary-glow hover:bg-primary/90",
        variant === "business" &&
          "bg-business-container text-on-business shadow-business-glow hover:bg-business",
        variant === "creator" &&
          "bg-creator-container text-on-creator shadow-creator-glow hover:bg-creator",
        variant === "ghost" &&
          "border border-primary/60 text-primary hover:bg-primary/10",
        variant === "subtle" &&
          "border border-white/5 bg-white/5 text-on-surface hover:border-white/15 hover:bg-white/10",
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Card                                                                        */
/* -------------------------------------------------------------------------- */

export function Card({
  className,
  children,
  glass = false,
}: {
  className?: string;
  children: ReactNode;
  glass?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg transition-colors",
        glass ? "glass" : "border border-white/5 bg-surface-container-low",
        "hover:border-white/[0.12]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-white/5 px-6 py-4",
        className,
      )}
    >
      <h2 className="font-display text-[15px] font-semibold text-on-surface">{title}</h2>
      {action}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Chip                                                                        */
/* -------------------------------------------------------------------------- */

type ChipTone = "neutral" | "primary" | "business" | "creator" | "mint" | "amber" | "error";

const chipTones: Record<ChipTone, string> = {
  neutral: "bg-white/5 text-on-surface-variant border-white/10",
  primary: "bg-primary/10 text-primary border-primary/20",
  business: "bg-business/10 text-business border-business/20",
  creator: "bg-creator/10 text-creator border-creator/20",
  mint: "bg-mint/10 text-mint border-mint/20",
  amber: "bg-amber/10 text-amber border-amber/20",
  error: "bg-error/10 text-error border-error/20",
};

export function Chip({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: ChipTone;
  icon?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1",
        "font-body text-[11px] font-semibold",
        chipTones[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat tile                                                                   */
/* -------------------------------------------------------------------------- */

export function StatTile({
  label,
  value,
  hint,
  icon,
  trend,
  emphasis = false,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: string;
  trend?: { direction: "up" | "down"; text: string };
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <p className="label-caps">{label}</p>
        {icon && <Icon name={icon} size={18} className="text-on-surface-variant/60" />}
      </div>
      <p
        className={cn(
          "numeric mt-3 font-semibold text-on-surface",
          emphasis ? "text-[40px] leading-[48px] text-primary" : "text-[28px] leading-9",
        )}
      >
        {value}
      </p>
      {trend && (
        <p
          className={cn(
            "mt-2 flex items-center gap-1 text-[12px]",
            trend.direction === "up" ? "text-mint" : "text-error",
          )}
        >
          <Icon name={trend.direction === "up" ? "trending_up" : "trending_down"} size={16} />
          {trend.text}
        </p>
      )}
      {hint && !trend && <p className="mt-2 text-[12px] text-on-surface-variant/70">{hint}</p>}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Sparkline / area chart                                                      */
/* -------------------------------------------------------------------------- */

export function AreaChart({
  points,
  className,
  height = 180,
}: {
  points: number[];
  className?: string;
  height?: number;
}) {
  if (points.length < 2) return null;

  const width = 600;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const coords = points.map((value, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 16) - 8;
    return { x, y };
  });

  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      style={{ height }}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#cabeff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#cabeff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#area-fill)" />
      <path
        d={line}
        fill="none"
        stroke="#cabeff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={coords[coords.length - 1].x}
        cy={coords[coords.length - 1].y}
        r="4"
        fill="#cabeff"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Progress                                                                    */
/* -------------------------------------------------------------------------- */

export function ProgressBar({
  /** 0–100. */
  percent,
  tone = "primary",
  className,
}: {
  percent: number;
  tone?: "primary" | "mint" | "amber";
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const fill = tone === "mint" ? "bg-mint" : tone === "amber" ? "bg-amber" : "bg-primary";
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/5", className)}>
      <div className={cn("h-full rounded-full transition-all", fill)} style={{ width: `${clamped}%` }} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Demo-data badge — every simulated figure is labelled (demo spec).           */
/* -------------------------------------------------------------------------- */

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5",
        "px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.08em]",
        "text-on-surface-variant/70",
        className,
      )}
    >
      <Icon name="science" size={12} />
      date demo
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Page shell                                                                  */
/* -------------------------------------------------------------------------- */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">{title}</h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
