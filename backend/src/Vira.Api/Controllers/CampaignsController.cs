using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vira.Abstractions.Constants;
using Vira.Abstractions.DTOs;
using Vira.Api.Auth;
using Vira.Application.Services;

namespace Vira.Api.Controllers;

[ApiController]
[Route("brand/campaigns")]
[Authorize(Policy = AuthConstants.BusinessPolicy)]
public class CampaignsController(ICampaignService campaigns) : ControllerBase
{
    /// <summary>Create a campaign for the signed-in business.</summary>
    [HttpPost]
    public async Task<ActionResult<CampaignDto>> Create([FromBody] CreateCampaignDto dto, CancellationToken ct)
    {
        if (User.GetBusinessId() is not Guid businessId)
            return Forbid();
        var created = await campaigns.CreateAsync(businessId, dto, ct);
        return CreatedAtAction(nameof(List), new { }, created);
    }

    /// <summary>List the signed-in business's campaigns (newest first).</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CampaignDto>>> List(CancellationToken ct)
    {
        if (User.GetBusinessId() is not Guid businessId)
            return Forbid();
        return Ok(await campaigns.ListAsync(businessId, ct));
    }
}
