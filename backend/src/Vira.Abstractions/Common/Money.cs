namespace Vira.Abstractions.Common;

/// <summary>
/// Money as integer <b>EUR cents</b> (1 EUR = 100 cents). Storage currency is EUR (decision recorded
/// in BUILD_PLAN.md). Never floating point (CLAUDE.md rule 1). TODO: arithmetic + tranche split later.
/// </summary>
public readonly record struct Money(long Cents);
