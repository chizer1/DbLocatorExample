import Table from "react-bootstrap/Table";
import { Api, DatabaseServer } from "../api";
import { useState, useEffect } from "react";
import { Trash, Pencil } from "react-bootstrap-icons";
import { Button, Modal, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import CheckboxField from "../components/forms/CheckboxField";
import { FaServer, FaNetworkWired, FaGlobe, FaLink, FaPlus, FaCheck, FaTimes, FaHashtag } from "react-icons/fa";
import { composeValidators, required, minLength } from "../utils/validation";

function DatabaseServers() {
  const [databaseServers, setDatabaseServers] = useState<DatabaseServer[]>([]);
  const [selectedDatabaseServer, setSelectedDatabaseServer] =
    useState<DatabaseServer | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = (databaseServer: DatabaseServer) => {
    setSelectedDatabaseServer(databaseServer);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    api.databaseServer.getDatabaseServersList().then((response) => {
      setDatabaseServers(response.data);
    });
  }, []);

  function deleteDatabaseServer(id: number) {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    api.databaseServer
      .deleteDatabaseServerDelete({ serverId: id })
      .then((response) => {
        if (response.status === 200) {
          const newDatabaseServers = databaseServers.filter(
            (databaseServer) => databaseServer.id !== id
          );
          setDatabaseServers(newDatabaseServers);
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
        <h1 className="display-4 mb-3">Database Servers</h1>
        <p className="lead text-muted">
          Manage your database server instances. Add new servers or modify existing ones.
        </p>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          className="d-flex align-items-center gap-2"
        >
          <FaPlus /> Add New Server
        </Button>
        <AddDatabaseServerModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          databaseServers={databaseServers}
          setDatabaseServers={setDatabaseServers}
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
                <th className="border-0 px-4 py-3">Host</th>
                <th className="border-0 px-4 py-3">IP Address</th>
                <th className="border-0 px-4 py-3">FQDN</th>
                <th className="border-0 px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {databaseServers.map((server) => (
                <tr key={server.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaServer className="text-primary" />
                      <span>{server.name || 'Not specified'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaNetworkWired className="text-info" />
                      <span>{server.hostName || 'Not specified'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaNetworkWired className="text-info" />
                      <span>{server.ipAddress || 'Not specified'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaGlobe className="text-success" />
                      <span>{server.fullyQualifiedDomainName || 'Not specified'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => {
                          setSelectedDatabaseServer(server);
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
                        onClick={() => deleteDatabaseServer(server.id!)}
                      >
                        <Trash size={16} />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {databaseServers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
                    <div className="d-flex flex-column align-items-center gap-2">
                      <FaServer size={32} />
                      <p className="mb-0">No database servers found</p>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setShowAddModal(true)}
                      >
                        Create your first database server
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      {selectedDatabaseServer && (
        <UpdateDatabaseServerModal
          show={showUpdateModal}
          handleClose={handleCloseUpdateModal}
          server={selectedDatabaseServer}
          databaseServers={databaseServers}
          setDatabaseServers={setDatabaseServers}
        />
      )}
    </>
  );
}

function AddDatabaseServerModal({
  show,
  handleClose,
  databaseServers,
  setDatabaseServers,
}: {
  show: boolean;
  handleClose: () => void;
  databaseServers: DatabaseServer[];
  setDatabaseServers: (servers: DatabaseServer[]) => void;
}) {
  const initialValues = {
    serverName: "",
    databaseServerHostName: "",
    serverIpAddress: "",
    serverFullyQualifiedDomainName: "",
  };

  const handleSubmit = async (values: any) => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    try {
      const response = await api.databaseServer.addDatabaseServerCreate({
        databaseServerName: values.serverName,
        databaseServerHostName: values.databaseServerHostName,
        databaseServerIpAddress: values.serverIpAddress,
        databaseServerFullyQualifiedDomainName: values.serverFullyQualifiedDomainName,
      });

      if (response.status === 200) {
        const newServer: DatabaseServer = {
          id: response.data!,
          name: values.serverName,
          hostName: values.databaseServerHostName,
          ipAddress: values.serverIpAddress,
          fullyQualifiedDomainName: values.serverFullyQualifiedDomainName,
        };
        setDatabaseServers([...databaseServers, newServer]);
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
        <Modal.Title>Add Database Server</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Add Database Server"
          loadingText="Adding Database Server..."
          successMessage="Database server added successfully!"
        >
          <FormField
            name="serverName"
            label="Server Name"
            required
            icon={<FaServer />}
            validate={required}
            helpText="Enter a name for the database server"
          />

          <FormField
            name="databaseServerHostName"
            label="Host"
            required
            icon={<FaNetworkWired />}
            validate={required}
            helpText="Enter the host address (e.g., localhost, 127.0.0.1)"
          />

          <FormField
            name="serverIpAddress"
            label="IP Address"
            icon={<FaNetworkWired />}
            helpText="Enter the IP address of the server"
          />

          <FormField
            name="serverFullyQualifiedDomainName"
            label="FQDN"
            icon={<FaGlobe />}
            helpText="Enter the fully qualified domain name"
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function UpdateDatabaseServerModal({
  show,
  handleClose,
  server,
  databaseServers,
  setDatabaseServers,
}: {
  show: boolean;
  handleClose: () => void;
  server: DatabaseServer | null;
  databaseServers: DatabaseServer[];
  setDatabaseServers: (servers: DatabaseServer[]) => void;
}) {
  if (!server) return null;

  const initialValues = {
    serverName: server.name || "",
    databaseServerHostName: server.hostName || "",
    serverIpAddress: server.ipAddress || "",
    serverFullyQualifiedDomainName: server.fullyQualifiedDomainName || "",
  };

  const handleSubmit = async (values: any) => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    try {
      const response = await api.databaseServer.updateDatabaseServerUpdate({
        serverId: server.id!,
        databaseServerName: values.serverName,
        databaseServerHostName: values.databaseServerHostName,
        databaseServerIpAddress: values.serverIpAddress,
        databaseServerFullyQualifiedDomainName: values.serverFullyQualifiedDomainName,
      });

      if (response.status === 200) {
        const updatedServer: DatabaseServer = {
          id: server.id,
          name: values.serverName,
          hostName: values.databaseServerHostName,
          ipAddress: values.serverIpAddress,
          fullyQualifiedDomainName: values.serverFullyQualifiedDomainName,
        };

        const newServers = databaseServers.map((s) =>
          s.id === updatedServer.id ? updatedServer : s
        );

        setDatabaseServers(newServers);
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
        <Modal.Title>Update Database Server</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Update Database Server"
          loadingText="Updating Database Server..."
          successMessage="Database server updated successfully!"
        >
          <FormField
            name="serverName"
            label="Server Name"
            required
            icon={<FaServer />}
            validate={required}
            helpText="Enter a name for the database server"
          />

          <FormField
            name="databaseServerHostName"
            label="Host"
            required
            icon={<FaNetworkWired />}
            validate={required}
            helpText="Enter the host address (e.g., localhost, 127.0.0.1)"
          />

          <FormField
            name="serverIpAddress"
            label="IP Address"
            icon={<FaNetworkWired />}
            helpText="Enter the IP address of the server"
          />

          <FormField
            name="serverFullyQualifiedDomainName"
            label="FQDN"
            icon={<FaGlobe />}
            helpText="Enter the fully qualified domain name"
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DatabaseServers;
