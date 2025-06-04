namespace DbLocatorExample.Models;

public class AddDatabaseUser
{
    public required List<int> DatabaseIds { get; set; }
    public required string UserName { get; set; }
    public required string UserPassword { get; set; }
}
