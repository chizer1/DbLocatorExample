import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Api, Database, DatabaseServer, DatabaseType } from "../api";
import { Trash, GearFill } from "react-bootstrap-icons";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function Databases() {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [databaseTypes, setDatabaseTypes] = useState<DatabaseType[]>([]);
  const [databaseServers, setDatabaseServers] = useState<DatabaseServer[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = (database: Database) => {
    setSelectedDatabase(database);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.database.getDatabasesList().then((response) => {
      setDatabases(response.data);
    });

    api.databaseType.getDatabaseTypesList().then((response) => {
      setDatabaseTypes(response.data);
    });

    api.databaseServer.getDatabaseServersList().then((response) => {
      setDatabaseServers(response.data);
    });
  }, []);

  function deleteDatabase(id: number) {
    const api = new Api({
      baseUrl: "http://localhost:5022",
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
      <div>
        <h1>Databases</h1>
        <p>
          Databases are used to store tenant data. On database creation, this example site implements custom logic 
          outside of the library to grant the SQL user SELECT permissions and creates an Account table and fills it with sample data. 
          <br /><br />
          Trusted Connection is available in the DbLocator library but not used in this example site. You also have the option if you
          want to physically create the database or just want to map to an existing database.
          <br /><br />
          You can add, update, and delete databases.
        </p>
        <Button variant="primary" onClick={handleShowAddModal}>
          Add Database
        </Button>
        <AddDatabaseModal
          show={showAddModal}
          handleClose={handleCloseAddModal}
          databases={databases}
          databaseTypes={databaseTypes}
          databaseServers={databaseServers}
          setDatabases={setDatabases}
        />
      </div>
      <Table striped border={1} hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Server</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {databases.map((database) => (
            <tr key={database.id}>
              <td>{database.name}</td>
              <td>{database.type?.name}</td>
              <td>{database.server?.name}</td>
              <td>
                <Trash
                  size={30}
                  color="red"
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteDatabase(database.id!)}
                />
                <GearFill
                  size={20}
                  color="gray"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShowUpdateModal(database)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedDatabase && (
        <UpdateDatabaseModal
          show={showUpdateModal}
          handleClose={handleCloseUpdateModal}
          selectedDatabase={selectedDatabase}
          databases={databases}
          setDatabases={setDatabases}
          databaseTypes={databaseTypes}
          databaseServers={databaseServers}
        />
      )}
    </>
  );
}

function AddDatabaseModal({
  show,
  handleClose,
  databases,
  databaseTypes,
  databaseServers,
  setDatabases,
}: {
  show: boolean;
  handleClose: () => void;
  databases: Database[];
  databaseTypes: DatabaseType[];
  databaseServers: DatabaseServer[];
  setDatabases: (databases: Database[]) => void;
}) {
  const [databaseName, setDatabaseName] = useState("");
  const [databaseTypeId, setDatabaseTypeId] = useState<number | null>(null);
  const [databaseServerId, setDatabaseServerId] = useState<number | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<number | null>(null);
  const [useTrustedConnection] = useState(false);
  const [createDatabase, setCreateDatabase] = useState(false);

  function addDatabase() {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.database
      .addDatabaseCreate({
        databaseName: databaseName,
        databaseServerId: databaseServerId!,
        databaseTypeId: databaseTypeId!,
        databaseStatus: databaseStatus!,
        createDatabase: createDatabase,
      })
      .then((response) => {
        if (response.status === 200) {
          const newDatabase: Database = {
            id: response.data!,
            name: databaseName,
            server: databaseServers.find((s) => s.id === databaseServerId)!,
            type: databaseTypes.find((t) => t.id === databaseTypeId)!,
            status: databaseStatus!,
            useTrustedConnection: useTrustedConnection,
          };
          setDatabases([...databases, newDatabase]);

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
        <Modal.Title>Add Database</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter database name"
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setDatabaseTypeId(parseInt(e.target.value))}
            >
              <option>Select database type</option>
              {databaseTypes.map((databaseType) => (
                <option key={databaseType.id} value={databaseType.id}>
                  {databaseType.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Server</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setDatabaseServerId(parseInt(e.target.value))}
            >
              <option>Select database server</option>
              {databaseServers.map((databaseServer) => (
                <option key={databaseServer.id} value={databaseServer.id}>
                  {databaseServer.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setDatabaseStatus(parseInt(e.target.value))}
            >
              <option>Select database status</option>
              <option value={1}>Active</option>
              <option value={2}>Inactive</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Create database"
              checked={createDatabase}
              onChange={(e) => setCreateDatabase(e.target.checked)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={addDatabase}>
          Add Database
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function UpdateDatabaseModal({
  show,
  handleClose,
  selectedDatabase,
  databases,
  setDatabases,
  databaseTypes,
  databaseServers,
}: {
  show: boolean;
  handleClose: () => void;
  selectedDatabase: Database;
  databases: Database[];
  setDatabases: (databases: Database[]) => void;
  databaseTypes: DatabaseType[];
  databaseServers: DatabaseServer[];
}) {
  const [databaseName, setDatabaseName] = useState(selectedDatabase.name);
  const [databaseTypeId, setDatabaseTypeId] = useState(
    selectedDatabase.type?.id
  );
  const [databaseServerId, setDatabaseServerId] = useState(
    selectedDatabase.server?.id
  );
  const [databaseStatus, setDatabaseStatus] = useState(selectedDatabase.status);
  const [useTrustedConnection, setUseTrustedConnection] = useState(
    selectedDatabase.useTrustedConnection!
  );

  useEffect(() => {
    setDatabaseName(selectedDatabase.name);
    setDatabaseTypeId(selectedDatabase.type?.id);
    setDatabaseServerId(selectedDatabase.server?.id);
    setDatabaseStatus(selectedDatabase.status);
    setUseTrustedConnection(selectedDatabase.useTrustedConnection!);
  }, [selectedDatabase]);

  function updateDatabase() {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.database
      .updateDatabaseUpdate({
        databaseId: selectedDatabase.id!,
        databaseName: databaseName!,
        databaseServerId: databaseServerId!,
        databaseTypeId: databaseTypeId!,
        databaseStatus: databaseStatus!,
      })
      .then((response) => {
        if (response.status === 200) {
          const updatedDatabase = {
            ...selectedDatabase,
            name: databaseName,
            serverId: databaseServerId!,
            typeId: databaseTypeId!,
            status: databaseStatus!,
            useTrustedConnection: useTrustedConnection,
          };
          setDatabases(
            databases.map((database) =>
              database.id === selectedDatabase.id ? updatedDatabase : database
            )
          );
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
        <Modal.Title>Update Database</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Update database name"
              value={databaseName!}
              onChange={(e) => setDatabaseName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              value={databaseTypeId}
              onChange={(e) => setDatabaseTypeId(parseInt(e.target.value))}
            >
              <option>Select database type</option>
              {databaseTypes.map((databaseType) => (
                <option key={databaseType.id} value={databaseType.id}>
                  {databaseType.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Server</Form.Label>
            <Form.Control
              as="select"
              value={databaseServerId}
              onChange={(e) => setDatabaseServerId(parseInt(e.target.value))}
            >
              <option>Select database server</option>
              {databaseServers.map((databaseServer) => (
                <option key={databaseServer.id} value={databaseServer.id}>
                  {databaseServer.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={databaseStatus}
              onChange={(e) => setDatabaseStatus(parseInt(e.target.value))}
            >
              <option>Select database status</option>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={updateDatabase}>
          Update Database
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Databases;
