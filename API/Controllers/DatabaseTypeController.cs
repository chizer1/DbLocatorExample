using DbLocator;
using DbLocator.Domain;
using DbLocatorExample.Models.DatabaseType;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseTypeController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addDatabaseType")]
    public async Task<int> AddDatabaseType([FromBody] AddDatabaseTypeRequest request)
    {
        return await dbLocator.CreateDatabaseType(request.DatabaseTypeName);
    }

    [HttpGet("getDatabaseTypes")]
    public async Task<List<DatabaseType>> GetDatabaseTypes()
    {
        return await dbLocator.GetDatabaseTypes();
    }

    [HttpPut("updateDatabaseType")]
    public async Task UpdateDatabaseType([FromBody] UpdateDatabaseTypeRequest request)
    {
        await dbLocator.UpdateDatabaseType(request.DatabaseTypeId, request.DatabaseTypeName);
    }

    [HttpDelete("deleteDatabaseType")]
    public async Task DeleteDatabaseType(byte databaseTypeId)
    {
        await dbLocator.DeleteDatabaseType(databaseTypeId);
    }
}
