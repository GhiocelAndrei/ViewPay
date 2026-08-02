using ViewPay.Abstractions.Common;

namespace ViewPay.Abstractions.Models.Campaigns;

public class Business : Entity
{
    public Guid AccountId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
}

public enum CampaignStatus { Draft, Active, Closed }

public class Campaign : Entity
{
    public Guid BusinessId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Brief { get; set; } = string.Empty;   // structured brief (JSONB)
    public Money Budget { get; set; }                    // integer bani
    public CampaignStatus Status { get; set; } = CampaignStatus.Draft;

    public StyleVector TargetStyleVector { get; set; } = new();
    public CampaignAccessRule AccessRule { get; set; } = new();
}

/// <summary>Hard floor. The follower threshold gates product-placement campaigns (demo.docx).</summary>
public class CampaignAccessRule
{
    public long MinFollowerThreshold { get; set; }
    public bool ProductPlacement { get; set; }
}
