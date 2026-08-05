using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vira.Abstractions.Constants;
using Vira.Abstractions.DTOs;
using Vira.Api.Auth;
using Vira.Application.Services;

namespace Vira.Api.Controllers;

[ApiController]
[Route("brand/profile")]
[Authorize(Policy = AuthConstants.BusinessPolicy)]
public class BusinessController(IBusinessService business) : ControllerBase
{
    /// <summary>Save the business onboarding questionnaire + company name.</summary>
    [HttpPut]
    public async Task<IActionResult> Save([FromBody] BusinessProfileDto dto, CancellationToken ct)
    {
        if (User.GetBusinessId() is not Guid businessId)
            return Forbid();
        await business.SaveProfileAsync(businessId, dto, ct);
        return NoContent();
    }

    /// <summary>The saved onboarding profile, or 404 if onboarding isn't done yet.</summary>
    [HttpGet]
    public async Task<ActionResult<BusinessProfileDto>> Get(CancellationToken ct)
    {
        if (User.GetBusinessId() is not Guid businessId)
            return Forbid();
        var profile = await business.GetProfileAsync(businessId, ct);
        return profile is null ? NotFound() : Ok(profile);
    }
}
