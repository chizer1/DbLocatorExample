using DbLocator;
using DbLocator.Domain;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class DatabaseTypeController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addDatabaseType")]
    public async Task<int> AddDatabaseType(string name)
    {
        return await dbLocator.AddDatabaseType(name);
    }

    [HttpGet("getDatabaseTypes")]
    public async Task<List<DatabaseType>> GetDatabaseTypes()
    {
        return await dbLocator.GetDatabaseTypes();
    }

    [HttpPut("updateDatabaseType")]
    public async Task UpdateDatabaseType(byte databaseTypeId, string name)
    {
        await dbLocator.UpdateDatabaseType(databaseTypeId, name);
    }

    [HttpDelete("deleteDatabaseType")]
    public async Task DeleteDatabaseType(byte databaseTypeId)
    {
        await dbLocator.DeleteDatabaseType(databaseTypeId);
    }
}
