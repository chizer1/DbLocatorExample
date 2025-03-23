using DbLocator;
using DbLocator.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseUserRoleController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addDatabaseUserRole")]
    public async Task AddDatabaseUserRole(
        int databaseUserId,
        DatabaseRole databaseRoleId,
        bool addRole
    )
    {
        await dbLocator.AddDatabaseUserRole(databaseUserId, databaseRoleId, addRole);
    }

    [HttpDelete("deleteDatabaseUserRole")]
    public async Task DeleteDatabaseUserRole(
        int databaseUserId,
        DatabaseRole databaseRoleId,
        bool removeRole
    )
    {
        await dbLocator.DeleteDatabaseUserRole(databaseUserId, databaseRoleId, removeRole);
    }
}
