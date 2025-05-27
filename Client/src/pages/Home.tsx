import { useEffect, useState } from "react";
import { Api, DatabaseRole, DatabaseType, Tenant } from "../api";
import { Button } from "react-bootstrap";

function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [databaseTypes, setDatabaseTypes] = useState<DatabaseType[]>([]);
  const [selectedDatabaseTypeId, setSelectedDatabaseTypeId] =
    useState<number>(0);

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<number>(0);

  const [databaseRoles] = useState<string[]>(Object.values(DatabaseRole).filter((value) => typeof value === "string") as string[])
  const [selectedDatabaseRoleIds, setSelectedDatabaseRoleIds] = useState<string[]>([]);
  const [sql, setSql] = useState<string>();

  const [isQuery, setIsQuery] = useState<boolean>(true);

  useEffect(() => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    api.databaseType.getDatabaseTypesList().then((response) => {
      setDatabaseTypes(response.data);
    });

    api.tenant.getTenantsList().then((response) => {
      setTenants(response.data);
    });
  }, []);

  function executeQueryOrCommand(
    tenantId: number,
    databaseTypeId: number,
    databaseRoles: DatabaseRole[],
    sql: string,
    isQuery: boolean
  ) {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

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
        if (response && response.data !== undefined) {
          setResults(response.data);
        } else {
          setResults([]);
        }
      })
      .catch((error) => {
        setResults([{ error: error.message }]);
      });
  }

  return (
    <>
      <div>
        <h1>Run SQL</h1>
        <p>
          After creating a corresponding tenant, database type, database server, database, database AND connection, 
          <br/>
          you can run SQL queries or commands against it. You can test create tables as a dbowner, or 
          run queries as a dbreader. Or you can do whatever else to your heart's content.
        </p>
        <div className="form-group">
          <label htmlFor="tenantSelect">Tenant</label>
          <select
            id="tenantSelect"
            className="form-control"
            onChange={(e) => {
              const tenantId = parseInt(e.target.value);
              setSelectedTenantId(tenantId);
            }}
          >
            <option value={0}>(none)</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group"></div>
        <label htmlFor="databaseTypeSelect">Database Type</label>
        <select
          id="databaseTypeSelect"
          className="form-control"
          onChange={(e) => {
            const databaseTypeId = parseInt(e.target.value);
            setSelectedDatabaseTypeId(databaseTypeId);
          }}
        >
          <option value={0}>(none)</option>
          {databaseTypes.map((databaseType) => (
            <option key={databaseType.id} value={databaseType.id}>
              {databaseType.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="databaseRoleSelect">Database Role</label>
        <select
          id="databaseRoleSelect"
          className="form-control"
          multiple
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
              option.value
            );
            setSelectedDatabaseRoleIds(selectedOptions);
          }}
        >
          {databaseRoles.map((databaseRole) => (
            <option key={databaseRole} value={databaseRole}>
              {databaseRole.toString()}
            </option>
          ))}
        </select>
        <label htmlFor="sqlInput">SQL</label>
        <textarea
          id="sqlInput"
          className="form-control"
          rows={3}
          onChange={(e) => {
            setSql(e.target.value);
          }}
        ></textarea>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isQueryCheck"
            checked={isQuery}
            onChange={(e) => {
              setIsQuery(e.target.checked);
            }}
          />
          <label className="form-check-label" htmlFor="isQueryCheck">
            Is Query
          </label>
        </div>
      </div>
      <br />
      <Button
        variant="primary"
        onClick={() => {
          executeQueryOrCommand(
            selectedTenantId,
            selectedDatabaseTypeId,
            selectedDatabaseRoleIds.map((role) => DatabaseRole[role as keyof typeof DatabaseRole]),
            sql || "",
            isQuery
          );
        }}
      >
        Run SQL
      </Button>

      <br />
      <div>{JSON.stringify(results)}</div>
    </>
  );
}

export default Home;
