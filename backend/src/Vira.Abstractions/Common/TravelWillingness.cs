namespace Vira.Abstractions.Common;

/// <summary>
/// How far a creator will travel for a location-based campaign. Checked against a campaign's
/// location scope during matching — no geo-coordinates needed, just the creator's county
/// (<see cref="Models.Creators.Creator.County"/>) versus the campaign's.
/// </summary>
public enum TravelWillingness
{
    /// <summary>Won't travel — only campaigns that need no on-location shoot, or ones in their own county.</summary>
    None,

    /// <summary>Will travel within their own county.</summary>
    SameCounty,

    /// <summary>Will travel anywhere in the country.</summary>
    Nationwide,

    /// <summary>Will travel abroad for a campaign.</summary>
    OutOfCountry
}
