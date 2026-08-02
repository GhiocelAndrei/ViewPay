using ViewPay.Abstractions.Common;

namespace ViewPay.Abstractions.Models.Identity;

public enum AccountType { Creator, Business }

/// <summary>
/// Unified account for both personas. Creators authenticate via TikTok OAuth; businesses via
/// Firebase Auth. Both converge on one backend HttpOnly session (D5).
/// </summary>
public class Account : Entity
{
    public string Email { get; set; } = string.Empty;
    public AccountType Type { get; set; }
    public string? FirebaseUid { get; set; }   // set for Business accounts
}

/// <summary>Server-side session record; the HttpOnly cookie carries this id.</summary>
public class Session : Entity
{
    public Guid AccountId { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
}
