import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Api, Connection, Database, Tenant } from "../api";
import { Trash } from "react-bootstrap-icons";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function Connections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [databases, setDatabases] = useState<Database[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const handleShowAddModal = () => setShowAddModal(true);

  useEffect(() => {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.connection.getConnectionsList().then((response) => {
      setConnections(response.data);
    });

    api.database.getDatabasesList().then((response) => {
      setDatabases(response.data);
    });

    api.tenant.getTenantsList().then((response) => {
      setTenants(response.data);
    });
  }, []);

  function deleteConnection(id: number) {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.connection
      .deleteConnectionDelete({ connectionId: id })
      .then((response) => {
        if (response.status === 200) {
          const newConnections = connections.filter(
            (connection) => connection.id !== id
          );
          setConnections(newConnections);
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
      <div>
        <h1>Connections</h1>
        <p>
          Connections are the relationships between tenants and databases. They allow
          tenants to access particular databases.
          You can add and delete connections.
        </p>
        <Button variant="primary" onClick={handleShowAddModal}>
          Add Connection
        </Button>
        <AddConnectionModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          connections={connections}
          databases={databases}
          tenants={tenants}
          setConnections={setConnections}
        />
      </div>
      <Table striped border={1} hover>
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Database</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {connections.map((connection) => (
            <tr key={connection.id}>
              <td>{connection.tenant?.name}</td>
              <td>{connection.database?.name}</td>
              <td>
                <Trash
                  size={30}
                  color="red"
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteConnection(connection.id!)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

function AddConnectionModal({
  show,
  handleClose,
  connections,
  databases,
  tenants,
  setConnections,
}: {
  show: boolean;
  handleClose: () => void;
  connections: Connection[];
  databases: Database[];
  tenants: Tenant[];
  setConnections: (connections: Connection[]) => void;
}) {
  const [tenantId, setTenantId] = useState<number>();
  const [databaseId, setDatabaseId] = useState<number>();

  function addConnection() {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.connection
      .addConnectionCreate({
        tenantId: tenantId!,
        databaseId: databaseId!,
      })
      .then((response) => {
        if (response.status === 200) {
          const newConnection: Connection = {
            id: response.data,
            tenant: tenants.find((t) => t.id === tenantId)!,
            database: databases.find((d) => d.id === databaseId)!,
          };

          setConnections([...connections, newConnection]);

          handleClose();
        }
      })
      .catch((error) => {
        toast.error(error.toString(), {
          autoClose: false,
        });
      });
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Connection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="tenantId">
            <Form.Label>Tenant</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setTenantId(parseInt(e.target.value))}
            >
              <option>Select Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="databaseId">
            <Form.Label>Database</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setDatabaseId(parseInt(e.target.value))}
            >
              <option>Select Database</option>
              {databases.map((database) => (
                <option key={database.id} value={database.id}>
                  {database.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={addConnection}>
          Add Connection
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Connections;
