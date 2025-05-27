using DbLocator.Domain;

namespace DbLocatorExample.Models;

public class SqlRequest
{
    public int TenantId { get; set; }
    public int DatabaseTypeId { get; set; }
    public required DatabaseRole[] DatabaseRoles { get; set; }
    public required string Sql { get; set; }
}
