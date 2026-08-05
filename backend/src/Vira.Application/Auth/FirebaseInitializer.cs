using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Vira.Abstractions.Settings;

namespace Vira.Application.Auth;

/// <summary>
/// Creates the default <see cref="FirebaseApp"/> once at startup. Safe to call when Firebase is
/// unconfigured (placeholder env): it no-ops, and the auth endpoints simply fail until real
/// credentials are supplied.
/// </summary>
public static class FirebaseInitializer
{
    public static void Initialize(FirebaseSettings settings)
    {
        if (FirebaseApp.DefaultInstance is not null) return;   // already created
        if (!settings.IsConfigured) return;                    // no credentials yet — skip

        // FromJson/FromFile are the documented FirebaseAdmin bootstrap path; the deprecation warning
        // targets broader credential-factory guidance that doesn't apply to a static service account.
#pragma warning disable CS0618
        var credential = !string.IsNullOrWhiteSpace(settings.CredentialsJson)
            ? GoogleCredential.FromJson(settings.CredentialsJson)
            : GoogleCredential.FromFile(settings.CredentialsPath);
#pragma warning restore CS0618

        FirebaseApp.Create(new AppOptions
        {
            Credential = credential,
            ProjectId = string.IsNullOrWhiteSpace(settings.ProjectId) ? null : settings.ProjectId
        });
    }
}
