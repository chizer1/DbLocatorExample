import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Api, Connection, Database, Tenant } from "../api";
import { Trash } from "react-bootstrap-icons";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import { FaDatabase, FaLink, FaBuilding } from "react-icons/fa";
import { required } from "../utils/validation";
import { useForm } from "../components/forms/FormContext";

interface FormValues {
  databaseId: string;
  tenantId: string;
}

function Connections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [databases, setDatabases] = useState<Database[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    Promise.all([
      api.connection.getConnectionsList(),
      api.database.getDatabasesList(),
      api.tenant.getTenantsList(),
    ])
      .then(([connectionsResponse, databasesResponse, tenantsResponse]) => {
        setConnections(connectionsResponse.data);
        setDatabases(databasesResponse.data);
        setTenants(tenantsResponse.data);
      })
      .catch((error: Error) => {
        toast.error(error.message || "Failed to load data", {
          autoClose: false,
        });
      });
  }, []);

  function deleteConnection(id: number) {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    api.connection
      .deleteConnectionDelete({ connectionId: id })
      .then((response) => {
        if (response.status === 200) {
          const newConnections = connections.filter(
            (connection) => connection.id !== id,
          );
          setConnections(newConnections);
          toast.success("Connection deleted successfully!");
        }
      })
      .catch((error: unknown) => {
        const apiError = (error as { response?: { data: unknown } })?.response
          ?.data;
        const errorMessage =
          typeof apiError === "string"
            ? apiError
            : (apiError as { message?: string })?.message ||
              (error as Error).message ||
              "An unknown error occurred";
        toast.error(errorMessage, {
          autoClose: false,
        });
      });
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="display-4 mb-3">Connections</h1>
        <p className="lead text-muted">
          Manage tenant-to-database connections. SQL Runner uses these
          connections to map tenants to their respective databases, enabling
          multi-tenant isolation and access control. This mapping is crucial for
          maintaining data separation and security in a multi-tenant
          environment.
        </p>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="d-flex align-items-center gap-2"
        >
          <FaLink /> Add New Connection
        </Button>
        <AddConnectionModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          connections={connections}
          setConnections={setConnections}
          databases={databases}
          tenants={tenants}
        />
      </div>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <Table
            hover
            responsive
            className="mb-0"
            style={
              {
                "--bs-table-hover-bg": "rgba(0, 123, 255, 0.05)",
                "--bs-table-hover-color": "inherit",
              } as any
            }
          >
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3">Tenant</th>
                <th className="border-0 px-4 py-3">Database</th>
                <th className="border-0 px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((connection) => (
                <tr key={connection.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaBuilding className="text-primary" />
                      <span>{connection.tenant?.name || "Unknown Tenant"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaDatabase className="text-success" />
                      <span>
                        {connection.database?.name || "Unknown Database"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => deleteConnection(connection.id!)}
                      >
                        <Trash size={16} />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {connections.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-5 text-muted">
                    <div className="d-flex flex-column align-items-center gap-2">
                      <FaLink size={32} />
                      <p className="mb-0">No connections found</p>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowAddModal(true)}
                      >
                        Create your first connection
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

interface AddConnectionModalProps {
  show: boolean;
  handleClose: () => void;
  connections: Connection[];
  setConnections: (connections: Connection[]) => void;
  databases: Database[];
  tenants: Tenant[];
}

function AddConnectionModal({
  show,
  handleClose,
  connections,
  setConnections,
  databases,
  tenants,
}: AddConnectionModalProps) {
  const initialValues: FormValues = {
    databaseId: "",
    tenantId: "",
  };

  const handleSubmit = async (values: Record<string, any>) => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    try {
      const response = await api.connection.addConnectionCreate({
        databaseId: parseInt(values.databaseId),
        tenantId: parseInt(values.tenantId),
      });

      if (response.status === 200) {
        const newConnection: Connection = {
          id: response.data!,
          database: databases.find(
            (db) => db.id === parseInt(values.databaseId),
          )!,
          tenant: tenants.find((t) => t.id === parseInt(values.tenantId))!,
        };
        setConnections([...connections, newConnection]);
        handleClose();
        toast.success("Connection added successfully!");
      }
    } catch (error: unknown) {
      const apiError = (error as { response?: { data: unknown } })?.response
        ?.data;
      const errorMessage =
        typeof apiError === "string"
          ? apiError
          : (apiError as { message?: string })?.message ||
            (error as Error).message ||
            "An unknown error occurred";
      toast.error(errorMessage, {
        autoClose: false,
      });
    }
  };

  const databaseOptions = databases.map((db) => ({
    value: db.id!.toString(),
    label: db.name || "Unnamed Database",
  }));

  const tenantOptions = tenants.map((tenant) => ({
    value: tenant.id!.toString(),
    label: tenant.name || "Unnamed Tenant",
  }));

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Connection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          key={show ? "new" : "reset"}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Add Connection"
          loadingText="Adding Connection..."
          successMessage="Connection added successfully!"
        >
          <FormContent
            databaseOptions={databaseOptions}
            tenantOptions={tenantOptions}
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

interface FormContentProps {
  databaseOptions: { value: string; label: string }[];
  tenantOptions: { value: string; label: string }[];
}

function FormContent({ databaseOptions, tenantOptions }: FormContentProps) {
  const { resetForm } = useForm();

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <>
      <FormField
        name="tenantId"
        label="Tenant"
        type="select"
        required
        icon={<FaBuilding />}
        validate={required}
        helpText="Select a tenant for this connection"
        options={tenantOptions}
      />

      <FormField
        name="databaseId"
        label="Database"
        type="select"
        required
        icon={<FaDatabase />}
        validate={required}
        helpText="Select a database for this connection"
        options={databaseOptions}
      />
    </>
  );
}

export default Connections;
