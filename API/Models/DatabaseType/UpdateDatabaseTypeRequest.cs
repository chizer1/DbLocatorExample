namespace DbLocatorExample.Models.DatabaseType;

public class UpdateDatabaseTypeRequest
{
    public byte DatabaseTypeId { get; set; }
    public required string DatabaseTypeName { get; set; }
}
