using DbLocator;
using DbLocator.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseUserController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addDatabaseUser")]
    public async Task<int> AddDatabaseUser(
        int databaseId,
        string userName,
        string? userPassword,
        bool createUser
    )
    {
        int databaseUserId;

        // Custom password generation logic
        if (userPassword == null)
        {
            databaseUserId = await dbLocator.AddDatabaseUser(databaseId, userName, createUser);
        }
        else
        {
            databaseUserId = await dbLocator.AddDatabaseUser(
                databaseId,
                userName,
                userPassword,
                createUser
            );
        }

        return databaseUserId;
    }

    [HttpPut("updateDatabaseUser")]
    public async Task<int> UpdateDatabaseUser(
        int databaseUserId,
        string userName,
        string userPassword,
        bool updateUser
    )
    {
        await dbLocator.UpdateDatabaseUser(databaseUserId, userName, userPassword, updateUser);

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
