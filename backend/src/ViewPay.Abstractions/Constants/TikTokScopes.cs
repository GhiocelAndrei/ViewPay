namespace ViewPay.Abstractions.Constants;

/// <summary>TikTok OAuth scopes we request (Display API). See D6.</summary>
public static class TikTokScopes
{
    public const string UserInfoBasic = "user.info.basic";
    public const string UserInfoProfile = "user.info.profile";
    public const string UserInfoStats = "user.info.stats";   // follower_count → campaign gate
    public const string VideoList = "video.list";
}
