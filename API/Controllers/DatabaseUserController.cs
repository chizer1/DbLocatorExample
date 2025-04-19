using DbLocator;
using DbLocator.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseUserController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addDatabaseUser")]
    public async Task<int> AddDatabaseUser([FromBody] AddDatabaseUser addDatabaseUser)
    {
        int databaseUserId;

        // Custom password generation logic
        if (addDatabaseUser.UserPassword == null)
        {
            databaseUserId = await dbLocator.AddDatabaseUser(
                addDatabaseUser.DatabaseIds,
                addDatabaseUser.UserName,
                addDatabaseUser.CreateUser
            );
        }
        else
        {
            databaseUserId = await dbLocator.AddDatabaseUser(
                addDatabaseUser.DatabaseIds,
                addDatabaseUser.UserName,
                addDatabaseUser.UserPassword,
                addDatabaseUser.CreateUser
            );
        }

        return databaseUserId;
    }

    [HttpPut("updateDatabaseUser")]
    public async Task<int> UpdateDatabaseUser(
        int databaseUserId,
        List<int> databaseIds,
        string userName,
        string userPassword,
        bool updateUser
    )
    {
        await dbLocator.UpdateDatabaseUser(
            databaseUserId,
            databaseIds,
            userName,
            userPassword,
            updateUser
        );

        return databaseUserId;
    }

    [HttpGet("getDatabaseUsers")]
    public async Task<List<DatabaseUser>> GetDatabaseUsers()
    {
        return await dbLocator.GetDatabaseUsers();
    }

    [HttpDelete("deleteDatabaseUser")]
    public async Task DeleteDatabaseUser(int databaseUserId, bool deleteUser)
    {
        await dbLocator.DeleteDatabaseUser(databaseUserId, deleteUser);
    }
}

public class AddDatabaseUser
{
    public required List<int> DatabaseIds { get; set; }
    public required string UserName { get; set; }
    public string? UserPassword { get; set; }
    public bool CreateUser { get; set; }
}
