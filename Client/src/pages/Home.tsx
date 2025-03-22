import { useEffect, useState } from "react";
import { Api, DatabaseType, Tenant } from "../api";
import { Button, Table } from "react-bootstrap";

type Account = {
  AccountId: number;
  AccountName: string;
  AccountBalance: number;

}

function Home() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [databaseTypes, setDatabaseTypes] = useState<DatabaseType[]>([]);
  const [selectedDatabaseTypeId, setSelectedDatabaseTypeId] =
    useState<number>(0);

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<number>(0);

  useEffect(() => {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.databaseType.getDatabaseTypesList().then((response) => {
      setDatabaseTypes(response.data);
    });

    api.tenant.getTenantsList().then((response) => {
      setTenants(response.data);
    });
  }, []);

  function getAccounts(tenantId: number, databaseTypeId: number) {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.accounts
      .getAccountsList({
        tenantId: tenantId,
        databaseTypeId: databaseTypeId,
      })
      .then((response) => {
        setAccounts(response.data);
      });
  }

  return (
    <>
      <div>
        <h1>Accounts</h1>
        <p>
          After creating a tenant, database type, database server, 
          database then creating a connection, you can get accounts between different tenants and database types.
          This will return a list of accounts that are associated with the selected tenant and database type.
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
      <br />
      <Button
        variant="primary"
        onClick={() => {
          getAccounts(selectedTenantId, selectedDatabaseTypeId);
        }}
      >
        Get Accounts
      </Button>

      <br />
      <Table striped border={1} hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.AccountId}>
              <td>{account.AccountId}</td>
              <td>{account.AccountName}</td>
              <td>{account.AccountBalance}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Home;
