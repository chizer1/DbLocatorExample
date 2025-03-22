import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Api, Database, DatabaseUser } from "../api";
import { Trash } from "react-bootstrap-icons";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function DatabaseUsers() {
  const [databaseUsers, setDatabaseUsers] = useState<DatabaseUser[]>([]);
  const [databases, setDatabases] = useState<Database[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const handleShowAddModal = () => setShowAddModal(true);

  useEffect(() => {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.databaseUser.getDatabaseUsersList().then((response) => {
      setDatabaseUsers(response.data);
    });

    api.database.getDatabasesList().then((response) => {
      setDatabases(response.data);
    });
  }, []);

  function deleteDatabaseUser(id: number) {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });
    api.databaseUser
      .deleteDatabaseUserDelete({ databaseUserId: id })
      .then((response) => {
        if (response.status === 200) {
          const newDatabaseUsers = databaseUsers.filter(
            (databaseUser) => databaseUser.id !== id
          );
          setDatabaseUsers(newDatabaseUsers);
        }
      })
      .catch((error) => {
        toast.error(error.toString());
      });
  }

  return (
    <>
      <div>
        <h1>Database Users</h1>
        <p>
          Datbase Users are the users that have access to a database.
        </p>
        <Button variant="primary" onClick={handleShowAddModal}>
          Add Database User
        </Button>
        <AddDatabaseUsersModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          databaseUsers={databaseUsers}
          databases={databases}
          setDatabaseUsers={setDatabaseUsers}
        />
      </div>
      <Table striped border={1} hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {databaseUsers.map((databaseUser) => (
            <tr key={databaseUser.id}>
              <td>{databaseUser.id}</td>
              <td>{databaseUser.name}</td>
              <td>
                <Trash
                  size={30}
                  color="red"
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteDatabaseUser(databaseUser.id!)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

function AddDatabaseUsersModal({
  show,
  handleClose,
  databaseUsers,
  databases,
  setDatabaseUsers,
}: {
  show: boolean;
  handleClose: () => void;
  databaseUsers: DatabaseUser[];
  databases: Database[];
  setDatabaseUsers: (databaseUsers: DatabaseUser[]) => void;
}) {
  const [databaseId, setDatabaseId] = useState<number>();
  const [userName, setUserName] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>();
  const [createUser, setCreateUser] = useState<boolean>(true);

  function addConnection() {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.databaseUser
      .addDatabaseUserCreate({
        databaseId: databaseId!,
        userName: userName,
        userPassword: userPassword,
        createUser: createUser,
      })
      .then((response) => {
        if (response.status === 200) {
          const newDatabaseUser: DatabaseUser = {
            id: response.data,
            name: userName,
          }

          setDatabaseUsers([...databaseUsers,newDatabaseUser]);

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
          <Form.Group controlId="userName">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter User Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="userPassword">
            <Form.Label>User Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter User Password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="createUser">
            <Form.Check
              type="checkbox"
              label="Create User"
              checked={createUser}
              onChange={(e) => setCreateUser(e.target.checked)}
            />
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

export default DatabaseUsers;
