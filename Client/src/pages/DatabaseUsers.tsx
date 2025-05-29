import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Api, Database, DatabaseRole, DatabaseUser } from "../api";
import { Pencil, Trash } from "react-bootstrap-icons";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { AxiosResponse as HttpResponse } from "axios";
import FormField from "../components/forms/FormField";
import { FaUser, FaKey, FaDatabase } from "react-icons/fa";
import { composeValidators, required, minLength } from "../utils/validation";
import { Badge } from "react-bootstrap";
import CustomForm from "../components/forms/Form";

const DATABASE_ROLES = {
  1: { name: "Owner", description: "The user has all database permissions" },
  2: { name: "SecurityAdmin", description: "The user can perform any activity in the database, except for modifying the database itself" },
  3: { name: "AccessAdmin", description: "The user can modify access to the database for other users" },
  4: { name: "BackupOperator", description: "The user can backup the database" },
  5: { name: "DdlAdmin", description: "The user can run any Data Definition Language (DDL) command in the database" },
  6: { name: "DataWriter", description: "The user can update, delete, and insert into any table in the database. Cannot select unless used with DataReader or similar role." },
  7: { name: "DataReader", description: "The user can select from any table in the database. Cannot update, delete, or insert unless used with DataWriter or similar role." },
  8: { name: "DenyDataWriter", description: "The user cannot update, delete, or insert into any table in the database." },
  9: { name: "DenyDataReader", description: "The user cannot select from any table in the database." }
} as const;

function DatabaseUsers() {
  const [databaseUsers, setDatabaseUsers] = useState<DatabaseUser[]>([]);
  const [databases, setDatabases] = useState<Database[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DatabaseUser | null>(null);

  useEffect(() => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    Promise.all([
      api.databaseUser.getDatabaseUsersList(),
      api.database.getDatabasesList()
    ]).then(([usersResponse, databasesResponse]) => {
      setDatabaseUsers(usersResponse.data);
      setDatabases(databasesResponse.data);
    });
  }, []);

  function deleteDatabaseUser(id: number) {
    const api = new Api({
      baseURL: "http://localhost:5022",
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
      <div className="mb-4">
        <h1 className="display-4 mb-3">Database Users</h1>
        <p className="lead text-muted">
          Manage database users and their access permissions. Note: This is unnecessary if the database is using Trusted Authentication.
        </p>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          className="d-flex align-items-center gap-2"
        >
          <FaUser /> Add New User
        </Button>
        <AddDatabaseUserModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          databaseUsers={databaseUsers}
          setDatabaseUsers={setDatabaseUsers}
          databases={databases}
        />
        <EditDatabaseUserModal
          show={showEditModal}
          handleClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          databaseUsers={databaseUsers}
          setDatabaseUsers={setDatabaseUsers}
          databases={databases}
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
                <th className="border-0 px-4 py-3">User Name</th>
                <th className="border-0 px-4 py-3">Databases</th>
                <th className="border-0 px-4 py-3">Roles</th>
                <th className="border-0 px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {databaseUsers.map((databaseUser) => (
                <tr key={databaseUser.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaUser className="text-primary" />
                      <span>{databaseUser.name || 'Not specified'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex flex-wrap gap-2">
                      {databaseUser.databases?.map((database: Database) => (
                        <Badge key={database.id} bg="info" className="px-3 py-2">
                          <FaDatabase className="me-1" />
                          {database.name}
                        </Badge>
                      ))}
                      {(!databaseUser.databases || databaseUser.databases.length === 0) && (
                        <span className="text-muted">No databases assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex flex-wrap gap-2">
                      {databaseUser.roles?.map((role) => (
                        <Badge key={role} bg="secondary" className="px-3 py-2" title={DATABASE_ROLES[role as keyof typeof DATABASE_ROLES]?.description}>
                          {DATABASE_ROLES[role as keyof typeof DATABASE_ROLES]?.name || role}
                        </Badge>
                      ))}
                      {(!databaseUser.roles || databaseUser.roles.length === 0) && (
                        <span className="text-muted">No roles assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => {
                          setSelectedUser(databaseUser);
                          setShowEditModal(true);
                        }}
                      >
                        <Pencil size={16} />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => deleteDatabaseUser(databaseUser.id!)}
                      >
                        <Trash size={16} />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {databaseUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
                    <div className="d-flex flex-column align-items-center gap-2">
                      <FaUser size={32} />
                      <p className="mb-0">No database users found</p>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setShowAddModal(true)}
                      >
                        Create your first database user
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

function AddDatabaseUserModal({
  show,
  handleClose,
  databaseUsers,
  setDatabaseUsers,
  databases,
}: {
  show: boolean;
  handleClose: () => void;
  databaseUsers: DatabaseUser[];
  setDatabaseUsers: (databaseUsers: DatabaseUser[]) => void;
  databases: Database[];
}) {
  const initialValues = {
    username: "",
    password: "",
    databaseIds: [] as string[],
    roles: [] as string[],
  };

  const roles = Object.entries(DATABASE_ROLES).map(([value, { name, description }]) => ({
    value,
    label: name,
    description
  }));

  const handleSubmit = async (values: any) => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    try {
      // First create the user
      const response = await api.databaseUser.addDatabaseUserCreate({
        username: values.username,
        userPassword: values.password,
        databaseIds: values.databaseIds.map((id: string) => parseInt(id)),
      });

      if (response.status === 200) {
        const userId = response.data!;
        
        // Then add roles for the user
        const rolePromises = values.roles.map((role: string) => 
          api.databaseUserRole.addDatabaseUserRoleCreate({
            databaseUserId: userId,
            databaseRoleId: parseInt(role),
          })
        );

        await Promise.all(rolePromises);

        const selectedDatabases = databases.filter(db => 
          values.databaseIds.includes(db.id?.toString() || "")
        );
        const newDatabaseUser: DatabaseUser = {
          id: userId,
          name: values.username,
          databases: selectedDatabases,
          roles: values.roles.map((role: string) => parseInt(role) as DatabaseRole),
        };
        setDatabaseUsers([...databaseUsers, newDatabaseUser]);
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
        <Modal.Title>Add Database User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CustomForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Add User"
          loadingText="Adding User..."
          successMessage="User added successfully!"
        >
          <FormField
            name="username"
            label="Username"
            required
            icon={<FaUser />}
            validate={composeValidators(required, minLength(3))}
            helpText="Enter a unique username for the database user"
          />

          <FormField
            name="password"
            label="Password"
            type="password"
            required
            icon={<FaKey />}
            validate={composeValidators(required, minLength(8))}
            helpText="Enter a secure password (minimum 8 characters)"
          />

          <FormField
            name="databaseIds"
            label="Databases"
            type="select"
            multiple
            required
            icon={<FaDatabase />}
            validate={required}
            helpText="Select one or more databases for this user"
            options={databases.map(db => ({
              value: db.id?.toString() || "",
              label: db.name || "Unnamed Database"
            }))}
          />

          <FormField
            name="roles"
            label="Roles"
            type="select"
            multiple
            required
            icon={<FaUser />}
            validate={required}
            helpText="Select one or more roles for this user"
            options={roles}
          />
        </CustomForm>
      </Modal.Body>
    </Modal>
  );
}

function EditDatabaseUserModal({
  show,
  handleClose,
  user,
  databaseUsers,
  setDatabaseUsers,
  databases,
}: {
  show: boolean;
  handleClose: () => void;
  user: DatabaseUser | null;
  databaseUsers: DatabaseUser[];
  setDatabaseUsers: (databaseUsers: DatabaseUser[]) => void;
  databases: Database[];
}) {
  const initialValues = {
    username: user?.name || "",
    password: user?.password || "",
    databaseIds: user?.databases?.map(db => db.id?.toString() || "") || [],
    roles: user?.roles?.map(role => role.toString()) || [],
  };

  const roles = Object.entries(DATABASE_ROLES).map(([value, { name, description }]) => ({
    value,
    label: name,
    description
  }));

  const handleSubmit = async (values: any) => {
    if (!user) return;
    const api = new Api({ baseURL: "http://localhost:5022" });

    try {
      // Update user details
      await api.databaseUser.updateDatabaseUserUpdate({
        databaseUserId: user.id!,
        userName: values.username,
        userPassword: values.password || "",
        databaseIds: values.databaseIds.map((id: string) => parseInt(id)),
      });

      // Update databases
      const currentDatabaseIds = user.databases?.map(db => db.id?.toString() || "");
      const newDatabaseIds = values.databaseIds;
      
      const databasesToAdd = newDatabaseIds.filter((id: string) => !currentDatabaseIds.includes(id));
      const databasesToRemove = currentDatabaseIds.filter(id => !newDatabaseIds.includes(id));

      const databasePromises = [
        ...databasesToAdd.map((id: string) => 
          api.databaseUserDatabase.addDatabaseUserDatabaseCreate({
            databaseUserId: user.id!,
            databaseId: parseInt(id),
          })
        ),
        ...databasesToRemove.map(id => 
          api.databaseUserDatabase.deleteDatabaseUserDatabaseDelete({
            databaseUserId: user.id!,
            databaseId: parseInt(id),
          })
        )
      ];

      // Update roles
      const currentRoles = user.roles?.map(role => role.toString()) || [];
      const newRoles = values.roles;
      
      const rolesToAdd = newRoles.filter((role: string) => !currentRoles.includes(role));
      const rolesToRemove = currentRoles.filter(role => !newRoles.includes(role));

      const rolePromises = [
        ...rolesToAdd.map((role: string) => 
          api.databaseUserRole.addDatabaseUserRoleCreate({
            databaseUserId: user.id!,
            databaseRoleId: parseInt(role),
          })
        ),
        ...rolesToRemove.map(role => 
          api.databaseUserRole.deleteDatabaseUserRoleDelete({
            databaseUserId: user.id!,
            databaseRoleId: parseInt(role),
          })
        )
      ];

      await Promise.all([...databasePromises, ...rolePromises]);

      // Update local state
      const updatedUser: DatabaseUser = {
        ...user,
        name: values.username,
        databases: databases.filter(db => values.databaseIds.includes(db.id?.toString() || "")),
        roles: values.roles.map((role: string) => parseInt(role) as DatabaseRole),
      };

      const newDatabaseUsers = databaseUsers.map(u => 
        u.id === user.id ? updatedUser : u
      );
      setDatabaseUsers(newDatabaseUsers);
      handleClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage, {
        autoClose: false,
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Database User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CustomForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Save Changes"
          loadingText="Saving Changes..."
          successMessage="Changes saved successfully!"
        >
          <FormField
            name="username"
            label="Username"
            required
            icon={<FaUser />}
            validate={composeValidators(required, minLength(3))}
            helpText="Enter a unique username for the database user"
          />

          <FormField
            name="password"
            label="Password"
            type="password"
            icon={<FaKey />}
            helpText="Enter a secure password (minimum 8 characters)"
          />

          <FormField
            name="databaseIds"
            label="Databases"
            type="select"
            multiple
            required
            icon={<FaDatabase />}
            validate={required}
            helpText="Select one or more databases for this user"
            options={databases.map(db => ({
              value: db.id?.toString() || "",
              label: db.name || "Unnamed Database"
            }))}
          />

          <FormField
            name="roles"
            label="Roles"
            type="select"
            multiple
            required
            icon={<FaUser />}
            validate={required}
            helpText="Select one or more roles for this user"
            options={roles}
          />
        </CustomForm>
      </Modal.Body>
    </Modal>
  );
}

export default DatabaseUsers;
