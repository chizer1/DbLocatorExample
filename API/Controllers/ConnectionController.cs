using DbLocator;
using DbLocator.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class ConnectionController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addConnection")]
    public async Task<int> AddConnection(int tenantId, int databaseId)
    {
        return await dbLocator.AddConnection(tenantId, databaseId);
    }

    [HttpGet("getConnections")]
    public async Task<List<Connection>> GetConnections()
    {
        return await dbLocator.GetConnections();
    }

    [HttpDelete("deleteConnection")]
    public async Task DeleteConnection(int connectionId)
    {
        await dbLocator.DeleteConnection(connectionId);
    }
}
