/**
 * Derived figures shown while a brand sizes a campaign.
 *
 * Deliberately separate from `money.ts`: nothing here produces a monetary
 * amount. These are projections rendered next to an input so the brand can see
 * what a budget buys before committing it. No payout, ledger line or budget
 * drawdown is ever derived from them (CLAUDE.md #4) — the real numbers come
 * from measured snapshots, and a campaign that under-delivers simply returns
 * the unspent budget.
 *
 * Inputs stay integer minor units; outputs are counts, so every division is
 * floored to an integer rather than left fractional. Rounding down is the safe
 * direction: promising a view the budget cannot pay for is the wrong error.
 */

/** How many views a budget buys at a given per-mille rate. */
export function estimateViewsForBudget(budgetMinor: number, ratePerMilleMinor: number): number {
  if (ratePerMilleMinor <= 0 || budgetMinor <= 0) return 0;
  return Math.floor((budgetMinor * 1000) / ratePerMilleMinor);
}

/**
 * Roughly how many creators it takes to deliver that many views.
 *
 * `averageViewsPerCreator` is a platform average, not a promise — the brand
 * sees it as "estimat" and the campaign fills with whoever applies.
 */
export function estimateCreatorCount(views: number, averageViewsPerCreator: number): number {
  if (averageViewsPerCreator <= 0 || views <= 0) return 0;
  return Math.max(1, Math.floor(views / averageViewsPerCreator));
}
