namespace DbLocatorExample.Models;

public class AddDatabaseUser
{
    public required List<int> DatabaseIds { get; set; }
    public required string UserName { get; set; }
    public string? UserPassword { get; set; }
}
