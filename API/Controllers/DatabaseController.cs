using System.Data.SqlClient;
using Dapper;
using DbLocator;
using DbLocator.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DbLocatorExample.Controllers;

[ApiController]
[Route("[controller]")]
public class DatabaseController(Locator dbLocator) : ControllerBase
{
    [HttpPost("addDatabase")]
    public async Task<int> AddDatabase(
        string databaseName,
        int databaseServerId,
        byte databaseTypeId,
        Status databaseStatus,
        bool createDatabase
    )
    {
        var databaseId = await dbLocator.AddDatabase(
            databaseName,
            databaseServerId,
            databaseTypeId,
            databaseStatus,
            createDatabase
        );

        // if (createDatabase)
        // {
        //     var databaseServers = await dbLocator.GetDatabaseServers();
        //     var databaseServer = databaseServers.Find(x => x.Id == databaseServerId);

        //     using SqlConnection sqlConnection = new(locatorConnectionString);
        //     await sqlConnection.OpenAsync();

        //     if (databaseServer != null && databaseServer.IsLinkedServer)
        //     {
        //         await ExecuteDatabaseCommands(
        //             sqlConnection,
        //             databaseServer.HostName,
        //             databaseName,
        //             databaseUser
        //         );
        //     }
        //     else
        //     {
        //         await ExecuteDatabaseCommands(sqlConnection, null, databaseName, databaseUser);
        //     }
        // }

        return databaseId;
    }

    [HttpGet("getDatabases")]
    public async Task<List<Database>> GetDatabases()
    {
        return await dbLocator.GetDatabases();
    }

    [HttpPut("updateDatabase")]
    public async Task UpdateDatabase(
        int databaseId,
        string databaseName,
        int databaseServerId,
        byte databaseTypeId,
        Status databaseStatus
    )
    {
        await dbLocator.UpdateDatabase(
            databaseId,
            databaseName,
            databaseServerId,
            databaseTypeId,
            databaseStatus
        );
    }

    [HttpDelete("deleteDatabase")]
    public async Task DeleteDatabase(int databaseId)
    {
        await dbLocator.DeleteDatabase(databaseId);
    }

    private static async Task ExecuteDatabaseCommands(
        SqlConnection sqlConnection,
        string? hostName,
        string databaseName,
        string databaseUser
    )
    {
        if (!string.IsNullOrEmpty(hostName))
        {
            // **commenting out for now, having issue with linked server stuff on granting permissions for user**

            // await sqlConnection.QueryAsync("EXEC ('USE " + databaseName + "') AT [" + hostName + "]");
            // await sqlConnection.QueryAsync(
            //     "EXEC ('GRANT SELECT ON SCHEMA::dbo TO " + databaseUser + "') AT [" + hostName + "]"
            // );
            // await sqlConnection.QueryAsync(
            //     "EXEC ('CREATE TABLE dbo.Account (AccountId INT PRIMARY KEY, AccountName NVARCHAR(50), AccountBalance DECIMAL(18, 2))') AT ["
            //         + hostName
            //         + "]"
            // );
            // await InsertRandomAccountData(sqlConnection, hostName);
        }
        else
        {
            await sqlConnection.QueryAsync("use " + databaseName);
            await sqlConnection.QueryAsync("GRANT SELECT ON SCHEMA::dbo TO " + databaseUser);
            await sqlConnection.QueryAsync(
                "CREATE TABLE dbo.Account (AccountId INT PRIMARY KEY, AccountName NVARCHAR(50), AccountBalance DECIMAL(18, 2))"
            );
            await InsertRandomAccountData(sqlConnection, null);
        }
    }

    private static async Task InsertRandomAccountData(SqlConnection sqlConnection, string? hostName)
    {
        var randomAccountId = new Random().Next(1, 10000);
        var randomAccountName = Guid.NewGuid().ToString()[..8];
        var randomAccountBalance = new Random().Next(100, 1000);

        if (!string.IsNullOrEmpty(hostName))
        {
            await sqlConnection.QueryAsync(
                $"EXEC ('INSERT INTO dbo.Account (AccountId, AccountName, AccountBalance) VALUES (''{randomAccountId}'', ''{randomAccountName}'', ''{randomAccountBalance}'')') AT [{hostName}]"
            );
        }
        else
        {
            await sqlConnection.QueryAsync(
                "INSERT INTO dbo.Account (AccountId, AccountName, AccountBalance) VALUES (@AccountId, @AccountName, @AccountBalance)",
                new
                {
                    AccountId = randomAccountId,
                    AccountName = randomAccountName,
                    AccountBalance = randomAccountBalance
                }
            );
        }
    }
}
