using DbLocator.Domain;

namespace DbLocatorExample.Models.Tenant;

public class UpdateTenantRequest
{
    public int TenantId { get; set; }
    public required string TenantName { get; set; }
    public required string TenantCode { get; set; }
    public Status TenantStatus { get; set; }
}
