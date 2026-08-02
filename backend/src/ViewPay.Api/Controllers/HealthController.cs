using Microsoft.AspNetCore.Mvc;

namespace ViewPay.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok", service = "viewpay-backend" });
}
