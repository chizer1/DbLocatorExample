using DbLocator;
using DbLocatorExample.Models.DatabaseUserRole;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseUserRoleController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addDatabaseUserRole")]
    public async Task AddDatabaseUserRole([FromBody] AddDatabaseUserRoleRequest request)
    {
        await dbLocator.CreateDatabaseUserRole(request.DatabaseUserId, request.DatabaseRoleId);
    }

    [HttpDelete("deleteDatabaseUserRole")]
    public async Task DeleteDatabaseUserRole([FromBody] DeleteDatabaseUserRoleRequest request)
    {
        await dbLocator.DeleteDatabaseUserRole(request.DatabaseUserId, request.DatabaseRoleId);
    }
}
