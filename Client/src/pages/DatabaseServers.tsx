import Table from "react-bootstrap/Table";
import { Api, DatabaseServer } from "../api";
import { useState, useEffect } from "react";
import { Trash, GearFill } from "react-bootstrap-icons";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

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
      baseUrl: "http://localhost:5022",
    });

    api.getDatabaseServers.getDatabaseServersList().then((response) => {
      setDatabaseServers(response.data);
    });
  }, []);

  function deleteDatabaseServer(id: number) {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.deleteDatabaseServer
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
      <div>

        <h1>Database Servers</h1>
        <p>
          Database servers are the physical or virtual machines that host your
          databases. You can add, update, and delete database servers. 
          (This won't create a new database server, but will add it to the list of available servers in the application.)
        </p>
        <Button variant="primary" onClick={handleShowAddModal}>
          Add Database Server
        </Button>
        <AddDatabaseServerModal
          show={showAddModal}
          handleClose={handleCloseAddModal}
          databaseServers={databaseServers}
          setDataServers={setDatabaseServers}
        />
      </div>
      <Table striped border={1} hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>IP Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {databaseServers.map((databaseServer) => (
            <tr key={databaseServer.id}>
              <td>{databaseServer.name}</td>
              <td>{databaseServer.ipAddress}</td>
              <td>
                <Trash
                  size={30}
                  color="red"
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteDatabaseServer(databaseServer.id!)}
                />
                <GearFill
                  size={20}
                  color="gray"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShowUpdateModal(databaseServer)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedDatabaseServer && (
        <UpdateDatabaseServerModal
          show={showUpdateModal}
          handleClose={handleCloseUpdateModal}
          selectedDatabaseServer={selectedDatabaseServer!}
          databaseServers={databaseServers}
          setDataServers={setDatabaseServers}
        />
      )}
    </>
  );
}

function AddDatabaseServerModal({
  show,
  handleClose,
  databaseServers,
  setDataServers,
}: {
  show: boolean;
  handleClose: () => void;
  databaseServers: DatabaseServer[];
  setDataServers: (setDataServers: DatabaseServer[]) => void;
}) {
  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  function addDatabaseServer() {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.addDatabaseServer
      .addDatabaseServerCreate({
        databaseServerName: name,
        databaseServerIpAddress: ipAddress,
      })
      .then((response) => {
        if (response.status === 200) {
          const newDatabaseServer: DatabaseServer = {
            id: response.data,
            name,
            ipAddress,
          };
          setDataServers([...databaseServers, newDatabaseServer]);
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
      <Modal.Header>
        <Modal.Title>Add Database Server</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>IP Address</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setIpAddress(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={addDatabaseServer}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function UpdateDatabaseServerModal({
  show,
  handleClose,
  selectedDatabaseServer,
  databaseServers,
  setDataServers,
}: {
  show: boolean;
  handleClose: () => void;
  selectedDatabaseServer: DatabaseServer;
  databaseServers: DatabaseServer[];
  setDataServers: (databaseServers: DatabaseServer[]) => void;
}) {
  const [name, setName] = useState(selectedDatabaseServer.name);
  const [ipAddress, setIpAddress] = useState(selectedDatabaseServer.ipAddress);

  useEffect(() => {
    setName(selectedDatabaseServer.name);
    setIpAddress(selectedDatabaseServer.ipAddress);
  }, [selectedDatabaseServer]);

  function updateDatabaseServer() {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.updateDatabaseServer
      .updateDatabaseServerUpdate({
        databaseServerId: selectedDatabaseServer.id!,
        databaseServerName: name!,
        databaseServerIpAddress: ipAddress!,
      })
      .then((response) => {
        if (response.status === 200) {
          const newDatabaseServers = databaseServers.map((databaseServer) => {
            if (databaseServer.id === selectedDatabaseServer.id) {
              return {
                id: selectedDatabaseServer.id,
                name,
                ipAddress,
              };
            }
            return databaseServer;
          });
          setDataServers(newDatabaseServers);
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
      <Modal.Header>
        <Modal.Title>Update Database Server</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name!}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>IP Address</Form.Label>
            <Form.Control
              type="text"
              value={ipAddress!}
              onChange={(e) => setIpAddress(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={updateDatabaseServer}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DatabaseServers;
