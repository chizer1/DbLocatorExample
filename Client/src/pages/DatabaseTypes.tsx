import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Api, DatabaseType } from "../api";
import { Trash, Pencil } from "react-bootstrap-icons";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import { FaCode } from "react-icons/fa";
import { composeValidators, required, minLength } from "../utils/validation";

function DatabaseTypes() {
  const [databaseTypes, setDatabaseTypes] = useState<DatabaseType[]>([]);
  const [selectedDatabaseType, setSelectedDatabaseType] =
    useState<DatabaseType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    api.databaseType.getDatabaseTypesList().then((response) => {
      setDatabaseTypes(response.data);
    });
  }, []);

  function deleteDatabaseType(id: number) {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    api.databaseType
      .deleteDatabaseTypeDelete({ databaseTypeId: id })
      .then((response) => {
        if (response.status === 200) {
          const newDatabaseTypes = databaseTypes.filter(
            (databaseType) => databaseType.id !== id,
          );
          setDatabaseTypes(newDatabaseTypes);
          toast.success("Database type deleted successfully!");
        }
      })
      .catch((error: any) => {
        const apiError = error.response?.data;
        const errorMessage =
          typeof apiError === "string"
            ? apiError
            : apiError?.message || error.message || "An unknown error occurred";
        toast.error(errorMessage, {
          autoClose: false,
        });
      });
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="display-4 mb-3">Database Types</h1>
        <p className="lead text-muted">
          Define and manage different types of databases in your system.
          DbLocator uses these types to apply appropriate connection handling
          and security policies. This allows you to support multiple database
          technologies while maintaining consistent access control and
          management practices. For example, you might create types like
          "Customer", "Order", "Inventory", or "Billing" to represent different
          parts of your system, each with its own database and specific access
          requirements.
        </p>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="d-flex align-items-center gap-2"
        >
          <FaCode /> Add New Type
        </Button>
        <AddDatabaseTypeModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          databaseTypes={databaseTypes}
          setDatabaseTypes={setDatabaseTypes}
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
                <th className="border-0 px-4 py-3">Name</th>
                <th className="border-0 px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {databaseTypes.map((type) => (
                <tr key={type.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaCode className="text-primary" />
                      <span>{type.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => {
                          setSelectedDatabaseType(type);
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
                        onClick={() => deleteDatabaseType(type.id!)}
                      >
                        <Trash size={16} />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {databaseTypes.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-5 text-muted">
                    <div className="d-flex flex-column align-items-center gap-2">
                      <FaCode size={32} />
                      <p className="mb-0">No database types found</p>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowAddModal(true)}
                      >
                        Create your first database type
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <UpdateDatabaseTypeModal
        show={showUpdateModal}
        handleClose={() => {
          setShowUpdateModal(false);
          setSelectedDatabaseType(null);
        }}
        type={selectedDatabaseType}
        databaseTypes={databaseTypes}
        setDatabaseTypes={setDatabaseTypes}
      />
    </>
  );
}

function AddDatabaseTypeModal({
  show,
  handleClose,
  databaseTypes,
  setDatabaseTypes,
}: {
  show: boolean;
  handleClose: () => void;
  databaseTypes: DatabaseType[];
  setDatabaseTypes: (types: DatabaseType[]) => void;
}) {
  const initialValues = {
    name: "",
  };

  const handleSubmit = async (values: any) => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    try {
      const response = await api.databaseType.addDatabaseTypeCreate({
        databaseTypeName: values.name,
      });

      if (response.status === 200) {
        const newType: DatabaseType = {
          id: response.data!,
          name: values.name,
        };
        setDatabaseTypes([...databaseTypes, newType]);
        handleClose();
        toast.success("Database type added successfully!");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage, {
        autoClose: false,
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Database Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Add Database Type"
          loadingText="Adding Database Type..."
          successMessage="Database type added successfully!"
        >
          <FormField
            name="name"
            label="Database Type Name"
            required
            icon={<FaCode />}
            validate={composeValidators(required, minLength(2))}
            helpText="Enter a unique name for the database type"
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function UpdateDatabaseTypeModal({
  show,
  handleClose,
  type,
  databaseTypes,
  setDatabaseTypes,
}: {
  show: boolean;
  handleClose: () => void;
  type: DatabaseType | null;
  databaseTypes: DatabaseType[];
  setDatabaseTypes: (types: DatabaseType[]) => void;
}) {
  if (!type) return null;

  const initialValues = {
    name: type.name || "",
  };

  const handleSubmit = async (values: any) => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    try {
      const response = await api.databaseType.updateDatabaseTypeUpdate({
        databaseTypeId: type.id!,
        databaseTypeName: values.name,
      });

      if (response.status === 200) {
        const updatedType: DatabaseType = {
          id: type.id,
          name: values.name,
        };

        const newTypes = databaseTypes.map((t) =>
          t.id === updatedType.id ? updatedType : t,
        );

        setDatabaseTypes(newTypes);
        handleClose();
        toast.success("Database type updated successfully!");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage, {
        autoClose: false,
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Database Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Update Database Type"
          loadingText="Updating Database Type..."
          successMessage="Database type updated successfully!"
        >
          <FormField
            name="name"
            label="Database Type Name"
            required
            icon={<FaCode />}
            validate={composeValidators(required, minLength(2))}
            helpText="Enter a unique name for the database type"
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DatabaseTypes;
