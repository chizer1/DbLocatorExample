using DbLocator;
using DbLocator.Domain;
using DbLocatorExample.Models;
using DbLocatorExample.Models.DatabaseUser;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseUserController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addDatabaseUser")]
    public async Task<int> AddDatabaseUser([FromBody] AddDatabaseUser addDatabaseUser)
    {
        return await dbLocator.CreateDatabaseUser(
            [.. addDatabaseUser.DatabaseIds],
            addDatabaseUser.UserName,
            addDatabaseUser.UserPassword,
            true
        );
    }

    [HttpPut("updateDatabaseUser")]
    public async Task UpdateDatabaseUser([FromBody] UpdateDatabaseUserRequest request)
    {
        await dbLocator.UpdateDatabaseUser(
            request.DatabaseUserId,
            request.UserName,
            request.UserPassword,
            [.. request.DatabaseIds],
            true
        );
    }

    [HttpGet("getDatabaseUsers")]
    public async Task<List<DatabaseUser>> GetDatabaseUsers()
    {
        return await dbLocator.GetDatabaseUsers();
    }

    [HttpDelete("deleteDatabaseUser")]
    public async Task DeleteDatabaseUser(int databaseUserId)
    {
        await dbLocator.DeleteDatabaseUser(databaseUserId, true);
    }
}
