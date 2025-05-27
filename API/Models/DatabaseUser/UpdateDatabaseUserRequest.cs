namespace DbLocatorExample.Models.DatabaseUser;

public class UpdateDatabaseUserRequest
{
    public int DatabaseUserId { get; set; }
    public required List<int> DatabaseIds { get; set; }
    public required string UserName { get; set; }
    public required string UserPassword { get; set; }
}
