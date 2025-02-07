using System.Data.SqlClient;
using Dapper;
using DbLocator;
using DbLocator.Domain;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(origin => true);
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
var configBuilder = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();
configBuilder.Build();

var app = builder.Build();

app.UseCors();
app.UseHttpsRedirection();
app.UseSwagger();
app.UseSwaggerUI();

Locator dbLocator = new(builder.Configuration["DbLocator:ConnectionString"]);

#region Tenant Endpoints

app.MapPost(
        "/addTenant",
        async (string tenantName, string tenantCode, Status tenantStatus) =>
            await dbLocator.AddTenant(tenantName, tenantCode, tenantStatus)
    )
    .WithTags("Tenant");

app.MapGet("/getTenants", async () => await dbLocator.GetTenants()).WithTags("Tenant");

app.MapPut(
        "/updateTenant",
        async (int tenantId, string tenantName, string tenantCode, Status tenantStatus) =>
            await dbLocator.UpdateTenant(tenantId, tenantName, tenantCode, tenantStatus)
    )
    .WithTags("Tenant");

app.MapDelete("/deleteTenant", async (int tenantId) => await dbLocator.DeleteTenant(tenantId))
    .WithTags("Tenant");

#endregion

#region Database Server Endpoints

app.MapPost(
        "/addDatabaseServer",
        async (string databaseServerName, string databaseServerIpAddress) =>
            await dbLocator.AddDatabaseServer(databaseServerName, databaseServerIpAddress)
    )
    .WithTags("DatabaseServer");

app.MapGet("/getDatabaseServers", async () => await dbLocator.GetDatabaseServers())
    .WithTags("DatabaseServer");

app.MapPut(
        "/updateDatabaseServer",
        async (int databaseServerId, string databaseServerName, string databaseServerIpAddress) =>
            await dbLocator.UpdateDatabaseServer(
                databaseServerId,
                databaseServerName,
                databaseServerIpAddress
            )
    )
    .WithTags("DatabaseServer");

app.MapDelete(
        "/deleteDatabaseServer",
        async (int serverId) => await dbLocator.DeleteDatabaseServer(serverId)
    )
    .WithTags("DatabaseServer");

#endregion

#region Database Endpoints

app.MapPost(
        "/addDatabase",
        async (
            string databaseName,
            string databaseUser,
            int databaseServerId,
            byte databaseTypeId,
            Status databaseStatus
        ) =>
        {
            await dbLocator.AddDatabase(
                databaseName,
                databaseUser,
                databaseServerId,
                databaseTypeId,
                databaseStatus
            );

            // custom stuff not part of the library, that you can implement!
            using SqlConnection sqlConnection =
                new(builder.Configuration["DbLocator:ConnectionString"]);
            await sqlConnection.OpenAsync();

            await sqlConnection.QueryAsync("use " + databaseName);

            // grant select permission to the user on this database, connection string user should have db_owner role
            await sqlConnection.QueryAsync("GRANT SELECT ON SCHEMA::dbo TO " + databaseUser);

            // create basic account table
            await sqlConnection.QueryAsync(
                "CREATE TABLE dbo.Account (AccountId INT PRIMARY KEY, AccountName NVARCHAR(50), AccountBalance DECIMAL(18, 2))"
            );

            // insert some random data into the account table (generated on the fly every time)
            var randomAccountId = new Random().Next(1, 10000);
            var randomAccountName = Guid.NewGuid().ToString()[..8];
            var randomAccountBalance = new Random().Next(100, 1000);

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
    )
    .WithTags("Database");

app.MapGet("/getDatabases", async () => await dbLocator.GetDatabases()).WithTags("Database");

app.MapPut(
        "/updateDatabase",
        async (
            int databaseId,
            string databaseName,
            string databaseUser,
            int databaseServerId,
            byte databaseTypeId,
            Status databaseStatus
        ) =>
            await dbLocator.UpdateDatabase(
                databaseId,
                databaseName,
                databaseUser,
                databaseServerId,
                databaseTypeId,
                databaseStatus
            )
    )
    .WithTags("Database");

app.MapDelete(
        "/deleteDatabase",
        async (int databaseId) => await dbLocator.DeleteDatabase(databaseId)
    )
    .WithTags("Database");

#endregion

#region Database Type Endpoints

app.MapPost("/addDatabaseType", async (string name) => await dbLocator.AddDatabaseType(name))
    .WithTags("DatabaseType");

app.MapGet("/getDatabaseTypes", async () => await dbLocator.GetDatabaseTypes())
    .WithTags("DatabaseType");

app.MapPut(
        "/updateDatabaseType",
        async (byte databaseTypeId, string name) =>
            await dbLocator.UpdateDatabaseType(databaseTypeId, name)
    )
    .WithTags("DatabaseType");

app.MapDelete(
        "/deleteDatabaseType",
        async (byte databaseTypeId) => await dbLocator.DeleteDatabaseType(databaseTypeId)
    )
    .WithTags("DatabaseType");

#endregion

#region Connection Endpoints

app.MapPost(
        "/addConnection",
        async (int tenantId, int databaseId) => await dbLocator.AddConnection(tenantId, databaseId)
    )
    .WithTags("Connection");

app.MapGet("/getConnections", async () => await dbLocator.GetConnections()).WithTags("Connection");

app.MapDelete(
        "/deleteConnection",
        async (int connectionId) => await dbLocator.DeleteConnection(connectionId)
    )
    .WithTags("Connection");

#endregion

app.MapGet(
        "/getAccounts",
        async (int tenantId, int databaseTypeId) =>
        {
            var db = await dbLocator.GetConnection(tenantId, databaseTypeId);

            return await db.QueryAsync<dynamic>("SELECT * FROM dbo.Account");
        }
    )
    .WithTags("Accounts");

app.Run();
