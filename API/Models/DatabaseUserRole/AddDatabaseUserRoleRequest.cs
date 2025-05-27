using DbLocator.Domain;

namespace DbLocatorExample.Models.DatabaseUserRole;

public class AddDatabaseUserRoleRequest
{
    public int DatabaseUserId { get; set; }
    public DatabaseRole DatabaseRoleId { get; set; }
}
