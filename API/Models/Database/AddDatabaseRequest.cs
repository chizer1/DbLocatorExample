using DbLocator.Domain;

namespace DbLocatorExample.Models.Database;

public class AddDatabaseRequest
{
    public required string DatabaseName { get; set; }
    public int DatabaseServerId { get; set; }
    public byte DatabaseTypeId { get; set; }
    public Status DatabaseStatus { get; set; }
}
