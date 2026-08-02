using ViewPay.Abstractions.Common;

namespace ViewPay.Abstractions.Models.Billing;

public enum PayoutStage { Pending, PartialReleased, FullyReleased }

/// <summary>Simulated payout — always <c>IsDemo</c> in the demo (D11). TODO: tranche/reserve logic later.</summary>
public class SimulatedPayout : Entity
{
    public Guid CreatorId { get; set; }
    public Guid CampaignId { get; set; }
    public long Views { get; set; }
    public Money CostPerView { get; set; }
    public Money GrossAmount { get; set; }
    public PayoutStage Stage { get; set; }
    public bool IsDemo { get; set; } = true;
}

/// <summary>Append-only audit ledger, independent of TikTok. TODO: logic later.</summary>
public class AuditLedgerEntry : Entity
{
    public Guid PayoutId { get; set; }
    public string Event { get; set; } = string.Empty;
    public bool IsDemo { get; set; } = true;
}
