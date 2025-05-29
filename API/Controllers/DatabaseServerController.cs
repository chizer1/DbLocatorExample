using DbLocator;
using DbLocator.Domain;
using DbLocatorExample.Models.DatabaseServer;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseServerController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addDatabaseServer")]
    public async Task<int> AddDatabaseServer([FromBody] AddDatabaseServerRequest request)
    {
        return await dbLocator.AddDatabaseServer(
            request.DatabaseServerName,
            request.IsLinkedServer,
            request.DatabaseServerIpAddress,
            request.DatabaseServerHostName,
            request.DatabaseServerFullyQualifiedDomainName
        );
    }

    [HttpGet("getDatabaseServers")]
    public async Task<List<DatabaseServer>> GetDatabaseServers()
    {
        return await dbLocator.GetDatabaseServers();
    }

    [HttpPut("updateDatabaseServer")]
    public async Task UpdateDatabaseServer([FromBody] UpdateDatabaseServerRequest request)
    {
        await dbLocator.UpdateDatabaseServer(
            request.DatabaseServerId,
            request.DatabaseServerName,
            request.DatabaseServerHostName,
            request.DatabaseServerIpAddress,
            request.DatabaseServerFullyQualifiedDomainName,
            false
        );
    }

    [HttpDelete("deleteDatabaseServer")]
    public async Task DeleteDatabaseServer(int serverId)
    {
        await dbLocator.DeleteDatabaseServer(serverId);
    }
}
