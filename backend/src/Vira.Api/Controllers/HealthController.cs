using Microsoft.AspNetCore.Mvc;

namespace Vira.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok", service = "vira-backend" });
}
