import {
  Text,
  View,
  Pressable,
  type PressableProps,
  type StyleProp,
  type TextStyle,
} from "react-native";
import type { ReactNode } from "react";
import { tokens } from "@vira/core";

/**
 * Shared primitives for the creator app.
 *
 * These mirror `apps/web/src/components/ui.tsx` in *behaviour*, not in code —
 * a component cannot serve DOM and React Native at once without becoming worse
 * at both. What the two apps genuinely share lives in `@vira/core`.
 */

const { colors } = tokens;

/* -------------------------------------------------------------------------- */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <View className={`rounded-lg border border-white/5 bg-surface-container-low ${className}`}>
      {children}
    </View>
  );
}

/** Uppercase micro-label. RN has no `text-transform` utility in NativeWind v4. */
export function LabelCaps({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <Text
      className={`text-[11px] font-semibold text-on-surface-variant ${className}`}
      style={{ letterSpacing: 0.9 }}
    >
      {children.toUpperCase()}
    </Text>
  );
}

/** Currency and view counts. Tabular figures keep columns from dancing. */
export function Numeric({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text className={className} style={[{ fontVariant: ["tabular-nums"] }, style]}>
      {children}
    </Text>
  );
}

type ChipTone = "neutral" | "primary" | "mint" | "amber";

const chipTone: Record<ChipTone, { bg: string; border: string; text: string }> = {
  neutral: { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.10)", text: colors["on-surface-variant"] },
  primary: { bg: "rgba(202,190,255,0.10)", border: "rgba(202,190,255,0.20)", text: colors.primary },
  mint: { bg: "rgba(124,255,178,0.10)", border: "rgba(124,255,178,0.20)", text: colors.mint },
  amber: { bg: "rgba(255,204,124,0.10)", border: "rgba(255,204,124,0.20)", text: colors.amber },
};

export function Chip({ tone = "neutral", children }: { tone?: ChipTone; children: string }) {
  const style = chipTone[tone];
  return (
    <View
      className="self-start rounded-full border px-3 py-1"
      style={{ backgroundColor: style.bg, borderColor: style.border }}
    >
      <Text className="text-[11px] font-semibold" style={{ color: style.text }}>
        {children}
      </Text>
    </View>
  );
}

export function Button({
  title,
  variant = "primary",
  className = "",
  ...rest
}: PressableProps & { title: string; variant?: "primary" | "subtle"; className?: string }) {
  const primary = variant === "primary";
  return (
    <Pressable
      className={`items-center justify-center rounded px-5 py-3 active:opacity-80 ${
        primary ? "bg-primary" : "border border-white/10 bg-white/5"
      } ${className}`}
      {...rest}
    >
      <Text
        className="text-[14px] font-bold"
        style={{ color: primary ? colors["on-primary"] : colors["on-surface"] }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <View className="h-full rounded-full bg-primary" style={{ width: `${clamped}%` }} />
    </View>
  );
}

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="mb-6">
      <Text className="text-[30px] font-bold leading-9 text-on-surface">{title}</Text>
      {subtitle ? (
        <Text className="mt-2 text-[15px] leading-6 text-on-surface-variant">{subtitle}</Text>
      ) : null}
    </View>
  );
}
