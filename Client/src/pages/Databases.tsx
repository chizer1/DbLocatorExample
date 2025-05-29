import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Api, Database, DatabaseType, DatabaseServer, Status } from "../api";
import { Trash, Pencil } from "react-bootstrap-icons";
import { Button, Modal, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import { FaDatabase, FaServer, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import { composeValidators, required, minLength } from "../utils/validation";

function Databases() {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [databaseTypes, setDatabaseTypes] = useState<DatabaseType[]>([]);
  const [databaseServers, setDatabaseServers] = useState<DatabaseServer[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    Promise.all([
      api.database.getDatabasesList(),
      api.databaseType.getDatabaseTypesList(),
      api.databaseServer.getDatabaseServersList()
    ]).then(([databasesResponse, typesResponse, serversResponse]) => {
      setDatabases(databasesResponse.data);
      setDatabaseTypes(typesResponse.data);
      setDatabaseServers(serversResponse.data);
    });
  }, []);

  function deleteDatabase(id: number) {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    api.database
      .deleteDatabaseDelete({ databaseId: id })
      .then((response) => {
        if (response.status === 200) {
          const newDatabases = databases.filter(
            (database) => database.id !== id
          );
          setDatabases(newDatabases);
        }
      })
      .catch((error) => {
        toast.error(error.toString(), {
          autoClose: false,
        });
      });
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="display-4 mb-3">Databases</h1>
        <p className="lead text-muted">
          Manage your databases. Add new databases or modify existing ones.
        </p>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          className="d-flex align-items-center gap-2"
        >
          <FaPlus /> Add New Database
        </Button>
        <AddDatabaseModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          databases={databases}
          setDatabases={setDatabases}
          databaseTypes={databaseTypes}
          databaseServers={databaseServers}
        />
      </div>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <Table 
            hover 
            responsive 
            className="mb-0"
            style={{
              '--bs-table-hover-bg': 'rgba(0, 123, 255, 0.05)',
              '--bs-table-hover-color': 'inherit',
            } as any}
          >
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3">Name</th>
                <th className="border-0 px-4 py-3">Type</th>
                <th className="border-0 px-4 py-3">Server</th>
                <th className="border-0 px-4 py-3">Status</th>
                <th className="border-0 px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {databases.map((database) => (
                <tr key={database.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaDatabase className="text-primary" />
                      <span>{database.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaDatabase className="text-info" />
                      <span>{database.type?.name || 'Not specified'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaServer className="text-success" />
                      <span>{database.server?.name || 'Not specified'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge bg={database.status === 1 ? "success" : "warning"} className="px-3 py-2">
                      {database.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => {
                          setSelectedDatabase(database);
                          setShowUpdateModal(true);
                        }}
                      >
                        <Pencil size={16} />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => deleteDatabase(database.id!)}
                      >
                        <Trash size={16} />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {databases.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <div className="d-flex flex-column align-items-center gap-2">
                      <FaDatabase size={32} />
                      <p className="mb-0">No databases found</p>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setShowAddModal(true)}
                      >
                        Create your first database
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <UpdateDatabaseModal
        show={showUpdateModal}
        handleClose={() => {
          setShowUpdateModal(false);
          setSelectedDatabase(null);
        }}
        database={selectedDatabase}
        databases={databases}
        setDatabases={setDatabases}
        databaseTypes={databaseTypes}
        databaseServers={databaseServers}
      />
    </>
  );
}

function AddDatabaseModal({
  show,
  handleClose,
  databases,
  setDatabases,
  databaseTypes,
  databaseServers,
}: {
  show: boolean;
  handleClose: () => void;
  databases: Database[];
  setDatabases: (databases: Database[]) => void;
  databaseTypes: DatabaseType[];
  databaseServers: DatabaseServer[];
}) {
  const initialValues = {
    name: "",
    typeId: "",
    serverId: "",
    status: "1", // Default to active
  };

  const handleSubmit = async (values: any) => {
    if (!values.name || !values.typeId) {
      toast.error("Please fill in all required fields");
      return;
    }

    // If there's only one server, use its ID regardless of the form value
    const serverId = databaseServers.length === 1 
      ? databaseServers[0].id 
      : parseInt(values.serverId);

    if (!serverId) {
      toast.error("Please select a database server");
      return;
    }

    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    try {
      const response = await api.database.addDatabaseCreate({
        databaseName: values.name.trim(),
        databaseTypeId: parseInt(values.typeId),
        databaseServerId: serverId,
        databaseStatus: parseInt(values.status),
      });

      if (response.status === 200) {
        const newDatabase: Database = {
          id: response.data!,
          name: values.name.trim(),
          type: databaseTypes.find(t => t.id === parseInt(values.typeId))!,
          server: databaseServers.find(s => s.id === serverId)!,
          status: parseInt(values.status)
        };
        setDatabases([...databases, newDatabase]);
        handleClose();
        toast.success("Database added successfully!");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage, {
        autoClose: false,
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Database</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          key={show ? 'new' : 'reset'}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Add Database"
          loadingText="Adding Database..."
          successMessage="Database added successfully!"
        >
          <FormField
            name="name"
            label="Database Name"
            required
            icon={<FaDatabase />}
            validate={composeValidators(required, minLength(2))}
            helpText="Enter a unique name for the database"
          />

          <FormField
            name="typeId"
            label="Database Type"
            type="select"
            required
            icon={<FaDatabase />}
            validate={required}
            helpText="Select the type of database"
            options={databaseTypes.map(type => ({
              value: type.id?.toString() || '',
              label: type.name || ''
            }))}
          />

          <FormField
            name="serverId"
            label="Database Server"
            type="select"
            required={databaseServers.length > 1}
            icon={<FaServer />}
            validate={databaseServers.length > 1 ? required : undefined}
            helpText={databaseServers.length === 1 ? "Only one server available" : "Select the server for this database"}
            options={databaseServers.map(server => ({
              value: server.id?.toString() || '',
              label: server.name || ''
            }))}
          />

          <FormField
            name="status"
            label="Status"
            type="select"
            required
            icon={<FaCheck />}
            validate={required}
            helpText="Select the status of the database"
            options={[
              { value: "1", label: "Active" },
              { value: "2", label: "Inactive" }
            ]}
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function UpdateDatabaseModal({
  show,
  handleClose,
  database,
  databases,
  setDatabases,
  databaseTypes,
  databaseServers,
}: {
  show: boolean;
  handleClose: () => void;
  database: Database | null;
  databases: Database[];
  setDatabases: (databases: Database[]) => void;
  databaseTypes: DatabaseType[];
  databaseServers: DatabaseServer[];
}) {
  if (!database) return null;

  const initialValues = {
    name: database.name || "",
    typeId: database.type?.id?.toString() || "",
    serverId: database.server?.id?.toString() || "",
    status: database.status?.toString() || "1",
  };

  const handleSubmit = async (values: any) => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    try {
      const response = await api.database.updateDatabaseUpdate({
        databaseId: database.id!,
        databaseName: values.name,
        databaseTypeId: parseInt(values.typeId),
        databaseServerId: parseInt(values.serverId),
        databaseStatus: parseInt(values.status),
      });

      if (response.status === 200) {
        const updatedDatabase: Database = {
          id: database.id,
          name: values.name,
          type: databaseTypes.find(t => t.id === parseInt(values.typeId))!,
          server: databaseServers.find(s => s.id === parseInt(values.serverId))!,
          status: parseInt(values.status),
        };

        const newDatabases = databases.map((d) =>
          d.id === updatedDatabase.id ? updatedDatabase : d
        );

        setDatabases(newDatabases);
        handleClose();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage, {
        autoClose: false,
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Database</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Update Database"
          loadingText="Updating Database..."
          successMessage="Database updated successfully!"
        >
          <FormField
            name="name"
            label="Database Name"
            required
            icon={<FaDatabase />}
            validate={composeValidators(required, minLength(2))}
            helpText="Enter a unique name for the database"
          />

          <FormField
            name="typeId"
            label="Database Type"
            type="select"
            required
            icon={<FaDatabase />}
            validate={required}
            helpText="Select the type of database"
            options={databaseTypes.map(type => ({
              value: type.id?.toString() || '',
              label: type.name || ''
            }))}
          />

          <FormField
            name="serverId"
            label="Database Server"
            type="select"
            required
            icon={<FaServer />}
            validate={required}
            helpText="Select the server for this database"
            options={databaseServers.map(server => ({
              value: server.id?.toString() || '',
              label: server.name || ''
            }))}
          />

          <FormField
            name="status"
            label="Status"
            type="select"
            required
            icon={<FaCheck />}
            validate={required}
            helpText="Select the status of the database"
            options={[
              { value: "1", label: "Active" },
              { value: "2", label: "Inactive" }
            ]}
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Databases;
