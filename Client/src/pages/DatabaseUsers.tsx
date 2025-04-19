import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Api, Database, DatabaseRole, DatabaseUser, HttpResponse } from "../api";
import { Pencil, Trash } from "react-bootstrap-icons";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function DatabaseUsers() {
  const [databaseUsers, setDatabaseUsers] = useState<DatabaseUser[]>([]);
  const [databases, setDatabases] = useState<Database[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const [editUser, setEditUser] = useState<DatabaseUser | null>(null);

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
          Datbase Users are the users that have access to a database. Note: This is unnecessary if the database is using Trusted Authentication.
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
        <EditDatabaseUsersModal
          handleClose={() => setEditUser(null)}
          setDatabaseUsers={setDatabaseUsers}
          databaseUsers={databaseUsers}
          editUser={editUser}
        />
      </div>
      <Table striped border={1} hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>Databases</th>
            <th>User Roles</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {databaseUsers.map((databaseUser) => (
            <tr key={databaseUser.id}>
              <td>{databaseUser.id}</td>
              <td>{databaseUser.name}</td>
              
              <td>
                {databaseUser.databases?.map((database : Database) => (
                  <div key={database.id}>{database.name}</div>
                ))}
              </td>
              <td>
                <Trash
                  size={30}
                  color="red"
                  title="Delete User"
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteDatabaseUser(databaseUser.id!)}
                />
              </td>
              <td>
                <Pencil
                  size={30}
                  color="blue"
                  title="Edit User Roles"
                  style={{ cursor: "pointer" }}
                  onClick={() => setEditUser(databaseUser)} 
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
  const [databaseIds, setDatabaseIds] = useState<number[]>();
  const [userName, setUserName] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>();
  const [createUser, setCreateUser] = useState<boolean>(true);

  const handleDatabaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (option) => (option as HTMLOptionElement).value);
    setDatabaseIds(options.map(Number));
  };

  function addDatabaseUser() {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.databaseUser
      .addDatabaseUserCreate({
        databaseIds: databaseIds,
        
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
        <Modal.Title>Add Database User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="databaseId">
            <Form.Label>Databases</Form.Label>
            <Form.Select multiple onChange={handleDatabaseChange}>
              {databases.map((database) => (
              <option key={database.id} value={database.id}>
                {database.name}
              </option>
              ))}
            </Form.Select>
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
        <Button variant="primary" onClick={addDatabaseUser}>
          Add Database User
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function EditDatabaseUsersModal({
  handleClose,
  editUser,
  databaseUsers,
  setDatabaseUsers,
}: {
  handleClose: () => void;
  editUser: DatabaseUser | null;
  databaseUsers: DatabaseUser[];
  setDatabaseUsers: (databaseUsers: DatabaseUser[]) => void;
}) {

  const [userRoles, setUserRoles] = useState<DatabaseRole[]>([]);
  useEffect(() => {
    if (editUser !== null) {
      setUserRoles(editUser.roles as DatabaseRole[]);
    }
  }, [editUser]);
  const roles = Object.keys(DatabaseRole).filter((role) => !isNaN(Number(role))).map((role) => parseInt(role) as DatabaseRole);
  return (
    <Modal show={editUser !== null} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User Roles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* // create checkbox group */}
          <Form.Group controlId="userRoles">
            <Form.Label>User Roles</Form.Label>
            
            {editUser !== null && roles.map((role) => (
              <Form.Check
                key={role}
                type="checkbox"
                label={DatabaseRole[role]}
                id={role.toLocaleString()}
                checked={userRoles.includes(role)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setUserRoles([...userRoles, role as DatabaseRole]);
                  } else {
                    setUserRoles(userRoles.filter((r) => r !== role as DatabaseRole));
                  }
                }}
              />
            ))}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={async () => 
          { 
            const api = new Api({ baseUrl: "http://localhost:5022" });
            if (editUser === null) {
              return}

            const removeRoles = editUser.roles?.filter(role => !userRoles.includes(role as DatabaseRole)) || [];
            const addRoles = userRoles.filter(role => !editUser.roles?.includes(role as DatabaseRole)) || [];

            const promises: Promise<HttpResponse<void, unknown>>[] = [];
            for(const role of removeRoles) {
              promises.push(api.databaseUserRole.deleteDatabaseUserRoleDelete({
                databaseUserId: editUser.id!,
                databaseRoleId: role,
                removeRole: true
              }))
            }

            for(const role of addRoles) {
              promises.push(api.databaseUserRole.addDatabaseUserRoleCreate({
                databaseUserId: editUser.id!,
                databaseRoleId: role,
                addRole: true
              }))
            }

            await Promise.all(promises);

            editUser.roles = userRoles;
            const newDatabaseUsers = databaseUsers.map((user) => 
              user.id === editUser.id ? editUser : user
            );
            setDatabaseUsers(newDatabaseUsers);
            handleClose();
        }}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DatabaseUsers;
