using DbLocator;
using DbLocator.Domain;
using DbLocatorExample.Models.Database;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addDatabase")]
    public async Task<int> AddDatabase([FromBody] AddDatabaseRequest request)
    {
        return await dbLocator.CreateDatabase(
            request.DatabaseName,
            request.DatabaseServerId,
            request.DatabaseTypeId,
            request.DatabaseStatus
        );
    }

    [HttpGet("getDatabases")]
    public async Task<List<Database>> GetDatabases()
    {
        return await dbLocator.GetDatabases();
    }

    [HttpPut("updateDatabase")]
    public async Task UpdateDatabase([FromBody] UpdateDatabaseRequest request)
    {
        await dbLocator.UpdateDatabase(
            request.DatabaseId,
            request.DatabaseName,
            request.DatabaseServerId,
            request.DatabaseTypeId,
            false,
            request.DatabaseStatus,
            true
        );
    }

    [HttpDelete("deleteDatabase")]
    public async Task DeleteDatabase(int databaseId)
    {
        await dbLocator.DeleteDatabase(databaseId);
    }
}
