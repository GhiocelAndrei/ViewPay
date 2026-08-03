/**
 * Money handling — CLAUDE.md non-negotiable #1.
 *
 * Amounts are ALWAYS integer minor units (cents/bani). Never convert to a
 * fractional `number` for arithmetic, never store a formatted string and parse
 * it back. Formatting happens at the very edge of the UI and nowhere else.
 *
 * The split below is exact for every safe integer: `% 100` is an integer
 * operation, and `(value - remainder) / 100` divides a known multiple of 100,
 * so the quotient is representable without rounding. Writing `value / 100`
 * directly would introduce float error — that is the bug this module prevents.
 */

/** Branded type so a raw `number` cannot be passed where minor units are expected. */
export type MinorUnits = number & { readonly __brand: "MinorUnits" };

export const minor = (value: number): MinorUnits => {
  if (!Number.isInteger(value)) {
    throw new Error(`Money must be an integer in minor units, received ${value}`);
  }
  return value as MinorUnits;
};

// TODO(currency): BUILD_PLAN "Open decisions" #1 — EUR in product docs vs RON
// bani in Money.cs. Resolve before payout code; this constant is the single
// place the UI needs to change.
export const CURRENCY_SYMBOL = "€";

/** Integer-safe split into whole units and remainder. */
function split(value: number): { negative: boolean; units: number; cents: number } {
  const negative = value < 0;
  const absolute = Math.abs(value);
  const cents = absolute % 100;
  const units = (absolute - cents) / 100;
  return { negative, units, cents };
}

export interface FormatMoneyOptions {
  /** Drop the decimal part when it is zero (e.g. "€800" instead of "€800,00"). */
  compactZeroCents?: boolean;
  /** Render without the currency symbol. */
  omitSymbol?: boolean;
}

/** Format minor units for display. Romanian convention: "." thousands, "," decimals. */
export function formatMoney(value: MinorUnits | number, options: FormatMoneyOptions = {}): string {
  const { negative, units, cents } = split(value);
  const groupedUnits = units.toLocaleString("ro-RO");
  const body =
    options.compactZeroCents && cents === 0
      ? groupedUnits
      : `${groupedUnits},${String(cents).padStart(2, "0")}`;
  const symbol = options.omitSymbol ? "" : CURRENCY_SYMBOL;
  return `${negative ? "-" : ""}${symbol}${body}`;
}

/** Payout rate is quoted per 1,000 views — also stored as minor units. */
export function formatRatePerMille(value: MinorUnits | number): string {
  return `${formatMoney(value)} / 1.000 vizualizări`;
}

/** View counts: "173.400", "1,2 mil." — display only, never used for maths. */
export function formatViews(views: number): string {
  if (views >= 1_000_000) {
    const millions = views / 1_000_000;
    return `${millions.toLocaleString("ro-RO", { maximumFractionDigits: 1 })} mil.`;
  }
  return views.toLocaleString("ro-RO");
}

export function formatCompactNumber(value: number): string {
  return value.toLocaleString("ro-RO", { notation: "compact", maximumFractionDigits: 1 });
}
