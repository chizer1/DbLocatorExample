namespace DbLocatorExample.Models.DatabaseServer;

public class UpdateDatabaseServerRequest
{
    public int DatabaseServerId { get; set; }
    public required string DatabaseServerName { get; set; }
    public required string DatabaseServerIpAddress { get; set; }
    public required string DatabaseServerHostName { get; set; }
    public required string DatabaseServerFullyQualifiedDomainName { get; set; }
    public bool IsLinkedServer { get; set; }
}
