using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vira.Abstractions.Constants;
using Vira.Abstractions.DTOs;
using Vira.Api.Auth;
using Vira.Application.Interfaces;

namespace Vira.Api.Controllers;

public record FirebaseLoginRequest(string IdToken);

[ApiController]
[Route("auth")]
public class AuthController(IAuthService auth, IWebHostEnvironment env) : ControllerBase
{
    /// <summary>Exchange a Firebase ID token for a session cookie (register or login).</summary>
    [HttpPost("firebase")]
    [AllowAnonymous]
    public async Task<ActionResult<MeDto>> Firebase([FromBody] FirebaseLoginRequest body, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(body.IdToken))
            return BadRequest("idToken is required.");

        AuthResultDto result;
        try
        {
            result = await auth.AuthenticateWithFirebaseAsync(body.IdToken, ct);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            return Unauthorized("Firebase token verification failed.");
        }

        Response.Cookies.Append(AuthConstants.SessionCookieName, result.SessionId.ToString(), CookieOptions(result.ExpiresAt));
        return Ok(result.Me);
    }

    /// <summary>The current account, resolved from the session cookie.</summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<MeDto>> Me(CancellationToken ct)
    {
        var me = await auth.GetMeAsync(User.GetAccountId(), ct);
        return me is null ? Unauthorized() : Ok(me);
    }

    /// <summary>Clear the session (server-side + cookie).</summary>
    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        if (Request.Cookies.TryGetValue(AuthConstants.SessionCookieName, out var raw) && Guid.TryParse(raw, out var sid))
            await auth.LogoutAsync(sid, ct);

        Response.Cookies.Delete(AuthConstants.SessionCookieName, CookieOptions(DateTimeOffset.UnixEpoch));
        return NoContent();
    }

    // Cross-site (Vercel ↔ Azure) needs SameSite=None + Secure. Local http dev is same-site across
    // localhost ports, so Lax + non-secure lets the cookie set over plain http.
    private CookieOptions CookieOptions(DateTimeOffset expires) => new()
    {
        HttpOnly = true,
        IsEssential = true,
        Path = "/",
        Expires = expires,
        Secure = !env.IsDevelopment(),
        SameSite = env.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None
    };
}
