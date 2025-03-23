using Dapper;
using DbLocator;
using DbLocator.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

public class QueryRequest
{
    public int TenantId { get; set; }
    public int DatabaseTypeId { get; set; }
    public required DatabaseRole[] DatabaseRoles { get; set; }
    public required string Sql { get; set; }
}

[ApiController]
[Route("[controller]")]
public class CustomController(Locator dbLocator) : ControllerBase
{
    [HttpPost("query")]
    public async Task<List<dynamic>> Query([FromBody] QueryRequest request)
    {
        var db = await dbLocator.GetConnection(
            request.TenantId,
            request.DatabaseTypeId,
            request.DatabaseRoles
        );
        return (List<dynamic>)await db.QueryAsync<dynamic>(request.Sql);
    }

    [HttpPost("command")]
    public async Task Command([FromBody] QueryRequest request)
    {
        var db = await dbLocator.GetConnection(
            request.TenantId,
            request.DatabaseTypeId,
            request.DatabaseRoles
        );
        await db.ExecuteAsync(request.Sql);
    }
}
