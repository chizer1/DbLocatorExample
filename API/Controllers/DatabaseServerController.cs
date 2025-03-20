using DbLocator;
using DbLocator.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseServerController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addDatabaseServer")]
    public async Task<int> AddDatabaseServer(
        string databaseServerName,
        string databaseServerIpAddress,
        string databaseServerHostName,
        string databaseServerFullyQualifiedDomainName,
        bool isLinkedServer
    )
    {
        return await dbLocator.AddDatabaseServer(
            databaseServerName,
            databaseServerIpAddress,
            databaseServerHostName,
            databaseServerFullyQualifiedDomainName,
            isLinkedServer
        );
    }

    [HttpGet("getDatabaseServers")]
    public async Task<List<DatabaseServer>> GetDatabaseServers()
    {
        return await dbLocator.GetDatabaseServers();
    }

    [HttpPut("updateDatabaseServer")]
    public async Task UpdateDatabaseServer(
        int databaseServerId,
        string databaseServerName,
        string databaseServerIpAddress,
        string databaseServerHostName,
        string databaseServerFullyQualifiedDomainName
    )
    {
        await dbLocator.UpdateDatabaseServer(
            databaseServerId,
            databaseServerName,
            databaseServerIpAddress,
            databaseServerHostName,
            databaseServerFullyQualifiedDomainName
        );
    }

    [HttpDelete("deleteDatabaseServer")]
    public async Task DeleteDatabaseServer(int serverId)
    {
        await dbLocator.DeleteDatabaseServer(serverId);
    }
}
