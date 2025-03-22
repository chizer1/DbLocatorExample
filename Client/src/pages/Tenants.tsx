import Table from "react-bootstrap/Table";
import { Api, Tenant } from "../api";
import { useState, useEffect } from "react";
import { Trash, GearFill } from "react-bootstrap-icons";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const handleShowUpdateModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.tenant.getTenantsList().then((response) => {
      setTenants(response.data);
    });
  }, []);

  function deleteTenant(id: number) {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.tenant
      .deleteTenantDelete({ tenantId: id })
      .then((response) => {
        if (response.status === 200) {
          const newTenants = tenants.filter((tenant) => tenant.id !== id);
          setTenants(newTenants);
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
        <h1>Tenants</h1>
        <p>
          Tenants can be organizations or other entities that use your
          application. You can add, update, and delete tenants.
        </p>
        <Button className="btn btn-primary" onClick={handleShowAddModal}>
          Add Tenant
        </Button>
        <AddTenantModal
          show={showAddModal}
          handleClose={handleCloseAddModal}
          tenants={tenants}
          setTenants={setTenants}
        />
      </div>
      <Table striped border={1} hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td>{tenant.name}</td>
              <td>{tenant.code}</td>
              <td>{tenant.status === 1 ? "Active" : "Inactive"}</td>
              <td>
                <Trash
                  size={30}
                  color="red"
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteTenant(tenant.id!)}
                />
                <GearFill
                  size={20}
                  color="gray"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShowUpdateModal(tenant)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedTenant && (
        <UpdateTenantModal
          show={showUpdateModal}
          handleClose={handleCloseUpdateModal}
          selectedTenant={selectedTenant}
          tenants={tenants}
          setTenants={setTenants}
        />
      )}
    </>
  );
}

function AddTenantModal({
  show,
  handleClose,
  tenants,
  setTenants,
}: {
  show: boolean;
  handleClose: () => void;
  tenants: Tenant[];
  setTenants: (tenants: Tenant[]) => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(1);

  function addTenant() {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    const tenant: Tenant = {
      id: 0,
      name: name,
      code: code,
      status: status,
    };

    api.tenant
      .addTenantCreate({
        tenantName: name,
        tenantCode: code,
        tenantStatus: status,
      })
      .then((response) => {
        if (response.status === 200) {
          tenant.id = response.data;

          setTenants([...tenants, tenant]);
          handleClose();

          setName("");
          setCode("");
          setStatus(1);
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
        <Modal.Title>Add Tenant</Modal.Title>
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
          <Form.Group>
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
            >
              <option value="1">Active</option>
              <option value="2">Inactive</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={addTenant}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function UpdateTenantModal({
  show,
  handleClose,
  selectedTenant,
  tenants,
  setTenants,
}: {
  show: boolean;
  handleClose: () => void;
  selectedTenant: Tenant;
  tenants: Tenant[];
  setTenants: (tenants: Tenant[]) => void;
}) {
  useEffect(() => {
    setName(selectedTenant.name);
    setCode(selectedTenant.code);
    setStatus(selectedTenant.status);
  }, [selectedTenant]);

  const [name, setName] = useState(selectedTenant.name);
  const [code, setCode] = useState(selectedTenant.code);
  const [status, setStatus] = useState(selectedTenant.status);

  function updateTenant() {
    const api = new Api({
      baseUrl: "http://localhost:5022",
    });

    api.tenant
      .updateTenantUpdate({
        tenantId: selectedTenant.id!,
        tenantName: name!,
        tenantCode: code!,
        tenantStatus: status!,
      })
      .then((response) => {
        if (response.status === 200) {
          const newTenants = tenants.map((tenant) => {
            if (tenant.id === selectedTenant.id) {
              return {
                ...tenant,
                name: name,
                code: code,
                status: status,
              };
            }
            return tenant;
          });

          setTenants(newTenants);
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
        <Modal.Title>Update Tenant</Modal.Title>
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
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              value={code!}
              onChange={(e) => setCode(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
            >
              <option value="1">Active</option>
              <option value="2">Inactive</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={updateTenant}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Tenants;
