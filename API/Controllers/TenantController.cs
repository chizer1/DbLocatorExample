using DbLocator;
using DbLocator.Domain;
using DbLocatorExample.Models.Tenant;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class TenantController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addTenant")]
    public async Task<int> AddTenant([FromBody] AddTenantRequest request)
    {
        return await dbLocator.AddTenant(
            request.TenantName,
            request.TenantCode,
            request.TenantStatus
        );
    }

    [HttpGet("getTenants")]
    public async Task<List<Tenant>> GetTenants()
    {
        return await dbLocator.GetTenants();
    }

    [HttpPut("updateTenant")]
    public async Task UpdateTenant([FromBody] UpdateTenantRequest request)
    {
        await dbLocator.UpdateTenant(
            request.TenantId,
            request.TenantName,
            request.TenantCode,
            request.TenantStatus
        );
    }

    [HttpDelete("deleteTenant")]
    public async Task DeleteTenant(int tenantId)
    {
        await dbLocator.DeleteTenant(tenantId);
    }
}
