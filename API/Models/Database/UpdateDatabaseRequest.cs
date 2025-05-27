using DbLocator.Domain;

namespace DbLocatorExample.Models.Database;

public class UpdateDatabaseRequest
{
    public int DatabaseId { get; set; }
    public required string DatabaseName { get; set; }
    public int DatabaseServerId { get; set; }
    public byte DatabaseTypeId { get; set; }
    public Status DatabaseStatus { get; set; }
}
