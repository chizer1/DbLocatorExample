import Table from "react-bootstrap/Table";
import { Api, DatabaseType } from "../api";
import { useState, useEffect } from "react";
import { Trash, GearFill } from "react-bootstrap-icons";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function DatabaseTypes() {
  const [databaseTypes, setDatabaseTypes] = useState<DatabaseType[]>([]);
  const [selectedDatabaseType, setSelectedDatabaseType] =
    useState<DatabaseType | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = (databaseType: DatabaseType) => {
    setSelectedDatabaseType(databaseType);
    setShowUpdateModal(true);
  };

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
            (databaseType) => databaseType.id !== id
          );
          setDatabaseTypes(newDatabaseTypes);
        }
      })
      .catch(async (error) => {
        toast.error(error.toString(), {
          autoClose: false,
        });
      });
  }

  return (
    <>
      <div>
        <h1>Database Types</h1>
        <p>
          Database Types can help provision seperate logical databases for each
          kind of workload. You can add, update, and delete database types.
        </p>
        <Button onClick={handleShowAddModal}>Add Database Type</Button>
        <AddDatabaseTypeModal
          show={showAddModal}
          handleClose={handleCloseAddModal}
          databaseTypes={databaseTypes}
          setDataTypes={setDatabaseTypes}
        />
      </div>
      <Table striped border={1} hover>
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {databaseTypes.map((databaseType) => (
            <tr key={databaseType.id}>
              <td>{databaseType.name}</td>
              <td>
                <Trash
                  size={30}
                  color="red"
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteDatabaseType(databaseType.id!)}
                />
                <GearFill
                  size={20}
                  color="gray"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShowUpdateModal(databaseType)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedDatabaseType && (
        <UpdateDatabaseTypeModal
          show={showUpdateModal}
          handleClose={handleCloseUpdateModal}
          selectedDatabaseType={selectedDatabaseType}
          databaseTypes={databaseTypes}
          setDatabaseTypes={setDatabaseTypes}
        />
      )}
    </>
  );
}

function AddDatabaseTypeModal({
  show,
  handleClose,
  databaseTypes,
  setDataTypes,
}: {
  show: boolean;
  handleClose: () => void;
  databaseTypes: DatabaseType[];
  setDataTypes: (databaseTypes: DatabaseType[]) => void;
}) {
  const [name, setName] = useState("");

  const databaseType: DatabaseType = {
    id: 0,
    name: name,
  };

  function addDatabaseType() {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    api.databaseType
      .addDatabaseTypeCreate({ databaseTypeName: name })
      .then((response) => {
        if (response.status === 200) {
          databaseType.id = response.data;

          setDataTypes([...databaseTypes, databaseType]);
          handleClose();

          setName("");
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
        <Modal.Title>Add Database Type</Modal.Title>
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={addDatabaseType}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function UpdateDatabaseTypeModal({
  show,
  handleClose,
  selectedDatabaseType,
  databaseTypes,
  setDatabaseTypes,
}: {
  show: boolean;
  handleClose: () => void;
  selectedDatabaseType: DatabaseType;
  databaseTypes: DatabaseType[];
  setDatabaseTypes: (databaseTypes: DatabaseType[]) => void;
}) {
  useEffect(() => {
    setName(selectedDatabaseType.name!);
  }, [selectedDatabaseType]);

  const [name, setName] = useState(selectedDatabaseType.name!);

  function updateDatabaseType() {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    api.databaseType
      .updateDatabaseTypeUpdate({
        databaseTypeId: selectedDatabaseType.id!,
        databaseTypeName: name,
      })
      .then((response) => {
        if (response.status === 200) {
          const updatedDatabaseType: DatabaseType = {
            id: selectedDatabaseType.id,
            name: name,
          };

          const newDatabaseTypes = databaseTypes.map((databaseType) =>
            databaseType.id === selectedDatabaseType.id
              ? updatedDatabaseType
              : databaseType
          );

          setDatabaseTypes(newDatabaseTypes);

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
        <Modal.Title>Update Database Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={updateDatabaseType}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DatabaseTypes;
