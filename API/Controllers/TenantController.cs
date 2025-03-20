using DbLocator;
using DbLocator.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class TenantController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addTenant")]
    public async Task<int> AddTenant(string tenantName, string tenantCode, Status tenantStatus)
    {
        return await dbLocator.AddTenant(tenantName, tenantCode, tenantStatus);
    }

    [HttpGet("getTenants")]
    public async Task<List<Tenant>> GetTenants()
    {
        return await dbLocator.GetTenants();
    }

    [HttpPut("updateTenant")]
    public async Task UpdateTenant(
        int tenantId,
        string tenantName,
        string tenantCode,
        Status tenantStatus
    )
    {
        await dbLocator.UpdateTenant(tenantId, tenantName, tenantCode, tenantStatus);
    }

    [HttpDelete("deleteTenant")]
    public async Task DeleteTenant(int tenantId)
    {
        await dbLocator.DeleteTenant(tenantId);
    }
}
