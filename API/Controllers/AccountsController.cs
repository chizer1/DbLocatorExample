using Dapper;
using DbLocator;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class AccountsController(Locator dbLocator) : ControllerBase
{
    [HttpGet("getAccounts")]
    public async Task<List<dynamic>> GetAccounts(int tenantId, int databaseTypeId)
    {
        var db = await dbLocator.GetConnection(tenantId, databaseTypeId);
        var accounts = await db.QueryAsync<dynamic>("SELECT * FROM dbo.Account");

        return [.. accounts];
    }
}
