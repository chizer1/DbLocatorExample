using Dapper;
using DbLocator;
using DbLocatorExample.Models;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class SqlController(Locator dbLocator) : ControllerBase
{
    [HttpPost("query")]
    public async Task<List<dynamic>> Query([FromBody] SqlRequest request)
    {
        var db = await dbLocator.GetConnection(
            request.TenantId,
            request.DatabaseTypeId,
            request.DatabaseRoles
        );

        return (List<dynamic>)await db.QueryAsync<dynamic>(request.Sql);
    }

    [HttpPost("command")]
    public async Task Command([FromBody] SqlRequest request)
    {
        var db = await dbLocator.GetConnection(
            request.TenantId,
            request.DatabaseTypeId,
            request.DatabaseRoles
        );

        await db.ExecuteAsync(request.Sql);
    }
}
