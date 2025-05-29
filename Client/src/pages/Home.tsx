import { useEffect, useState } from "react";
import { Api, DatabaseRole, DatabaseType, Tenant } from "../api";
import { Button, Card, Form } from "react-bootstrap";
import {
  FaDatabase,
  FaUser,
  FaCode,
  FaPlay,
  FaShieldAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

// Map of role numbers to their display names
const DATABASE_ROLES: Record<DatabaseRole, string> = {
  [DatabaseRole.Value1]: "Owner",
  [DatabaseRole.Value2]: "SecurityAdmin",
  [DatabaseRole.Value3]: "AccessAdmin",
  [DatabaseRole.Value4]: "BackupOperator",
  [DatabaseRole.Value5]: "DataReader",
  [DatabaseRole.Value6]: "DataWriter",
  [DatabaseRole.Value7]: "DDLAdmin",
  [DatabaseRole.Value8]: "DenyDataReader",
  [DatabaseRole.Value9]: "DenyDataWriter",
};

function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [databaseTypes, setDatabaseTypes] = useState<DatabaseType[]>([]);
  const [selectedDatabaseTypeId, setSelectedDatabaseTypeId] =
    useState<number>(0);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<number>(0);
  const [databaseRoles] = useState<DatabaseRole[]>(
    Object.values(DatabaseRole).filter(
      (value) => typeof value === "number",
    ) as DatabaseRole[],
  );
  const [selectedDatabaseRoleIds, setSelectedDatabaseRoleIds] = useState<
    DatabaseRole[]
  >([]);
  const [sql, setSql] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    Promise.all([
      api.databaseType.getDatabaseTypesList(),
      api.tenant.getTenantsList(),
    ])
      .then(([databaseTypesResponse, tenantsResponse]) => {
        setDatabaseTypes(databaseTypesResponse.data);
        setTenants(tenantsResponse.data);
      })
      .catch((error) => {
        toast.error("Failed to load initial data: " + error.message);
      });
  }, []);

  function isQueryStatement(sql: string): boolean {
    const trimmedSql = sql.trim().toLowerCase();
    return (
      trimmedSql.startsWith("select") ||
      trimmedSql.startsWith("with") ||
      trimmedSql.startsWith("show") ||
      trimmedSql.startsWith("describe") ||
      trimmedSql.startsWith("explain")
    );
  }

  function executeQueryOrCommand(
    tenantId: number,
    databaseTypeId: number,
    databaseRoles: DatabaseRole[],
    sql: string,
  ) {
    if (!sql.trim()) {
      setResults([{ error: "Please enter SQL query or command" }]);
      return;
    }

    if (!tenantId) {
      setResults([{ error: "Please select a tenant" }]);
      return;
    }

    if (!databaseTypeId) {
      setResults([{ error: "Please select a database type" }]);
      return;
    }

    if (!databaseRoles || databaseRoles.length === 0) {
      setResults([{ error: "Please select at least one database role" }]);
      return;
    }

    setIsLoading(true);
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    const isQuery = isQueryStatement(sql);
    const request = isQuery
      ? api.sql.queryCreate({
          tenantId: tenantId,
          databaseTypeId: databaseTypeId,
          databaseRoles: databaseRoles,
          sql: sql,
        })
      : api.sql.commandCreate({
          tenantId: tenantId,
          databaseTypeId: databaseTypeId,
          databaseRoles: databaseRoles,
          sql: sql,
        });

    request
      .then((response) => {
        if (!isQuery) {
          setResults([{ message: "Command successful!" }]);
        } else if (response && response.data !== undefined) {
          setResults(response.data);
        } else {
          setResults([{ message: "Query executed with no results" }]);
        }
      })
      .catch((error) => {
        const apiError = error.response?.data;
        const errorMessage =
          typeof apiError === "string"
            ? apiError
            : apiError?.message || error.message || "An unknown error occurred";
        setResults([{ error: errorMessage }]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="display-4 mb-3">SQL Runner</h1>
        <p className="lead text-muted">
          Simplifies multi-tenant database access by automatically handling
          connection management and role-based permissions. This page
          demonstrates how you can execute SQL statements with different roles
          across various tenants and database types, all without managing
          complex connection strings or security configurations.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5 className="card-title mb-4">Query Configuration</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center gap-2">
                    <FaUser className="text-primary" /> Tenant
                  </Form.Label>
                  <Form.Select
                    value={selectedTenantId}
                    onChange={(e) =>
                      setSelectedTenantId(parseInt(e.target.value))
                    }
                  >
                    <option value={0}>Select a tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center gap-2">
                    <FaDatabase className="text-primary" /> Database Type
                  </Form.Label>
                  <Form.Select
                    value={selectedDatabaseTypeId}
                    onChange={(e) =>
                      setSelectedDatabaseTypeId(parseInt(e.target.value))
                    }
                  >
                    <option value={0}>Select a database type</option>
                    {databaseTypes.map((databaseType) => (
                      <option key={databaseType.id} value={databaseType.id}>
                        {databaseType.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center gap-2">
                    <FaShieldAlt className="text-primary" /> Database Roles
                  </Form.Label>
                  <Form.Select
                    multiple
                    value={selectedDatabaseRoleIds.map((role) =>
                      role.toString(),
                    )}
                    onChange={(e) => {
                      const selectedOptions = Array.from(
                        e.target.selectedOptions,
                        (option) => parseInt(option.value) as DatabaseRole,
                      );
                      setSelectedDatabaseRoleIds(selectedOptions);
                    }}
                  >
                    {databaseRoles.map((role) => (
                      <option key={role} value={role}>
                        {DATABASE_ROLES[role]}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Hold Ctrl/Cmd to select multiple roles
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center gap-2">
                    <FaCode className="text-primary" /> SQL Query
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={sql}
                    onChange={(e) => setSql(e.target.value)}
                    placeholder="Enter your SQL query or command here..."
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => {
                    executeQueryOrCommand(
                      selectedTenantId,
                      selectedDatabaseTypeId,
                      selectedDatabaseRoleIds,
                      sql,
                    );
                  }}
                  disabled={isLoading}
                >
                  <FaPlay /> {isLoading ? "Running..." : "Run SQL"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5 className="card-title mb-4">Results</h5>
              {results.length > 0 ? (
                <div className="bg-light p-3 rounded">
                  <pre
                    className="mb-0"
                    style={{ maxHeight: "500px", overflow: "auto" }}
                  >
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <FaDatabase size={32} className="mb-3 text-primary" />
                  <p className="mb-0">No results to display</p>
                  <small>Run a query to see results here</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Home;
