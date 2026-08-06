using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Vira.Abstractions.Common;
using Vira.Abstractions.DTOs;
using Vira.Application.Interfaces;
using Vira.Application.Seed;

namespace Vira.Api.Controllers;

[ApiController]
[Route("creators")]
public class CreatorsController(IMockCreatorSeed seed, IAiModelClient ai) : ControllerBase
{
    /// <summary>List creators, optionally filtered by category.</summary>
    [HttpGet]
    public ActionResult<IEnumerable<CreatorSummaryDto>> List([FromQuery] CreatorCategory? category)
    {
        var records = category is null ? seed.All : seed.ByCategory(category.Value);
        return Ok(records.Select(r => new CreatorSummaryDto
        {
            Id = r.Creator.Id,
            DisplayName = r.Creator.DisplayName,
            Category = r.Category,
            FollowerCount = r.Creator.FollowerCount,
            City = r.Creator.City,
            ClipCount = r.Clips.Count
        }));
    }

    /// <summary>The full assembled view of one creator (profile + clips + aggregates + questionnaire).</summary>
    [HttpGet("{id:guid}")]
    public ActionResult<PortraitRequestDto> Get(Guid id)
    {
        var record = seed.ById(id);
        return record is null ? NotFound() : Ok(PortraitRequestAssembler.From(record));
    }

    /// <summary>Assemble the portrait payload and POST it to the ai-service.</summary>
    [HttpPost("{id:guid}/portrait")]
    public async Task<ActionResult<JsonElement>> GeneratePortrait(Guid id, CancellationToken ct)
    {
        var record = seed.ById(id);
        if (record is null)
            return NotFound();

        var request = PortraitRequestAssembler.From(record);
        return Ok(await ai.GeneratePortraitAsync(request, ct));
    }
}
