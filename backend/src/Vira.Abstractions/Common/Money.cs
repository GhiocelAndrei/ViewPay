namespace Vira.Abstractions.Common;

/// <summary>
/// Money as integer <b>bani</b> (1 RON = 100 bani). Never floating point (Bloc 1).
/// TODO: arithmetic + tranche split later.
/// </summary>
public readonly record struct Money(long Bani);
