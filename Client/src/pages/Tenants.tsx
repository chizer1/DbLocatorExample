import Table from "react-bootstrap/Table";
import { Api, Tenant } from "../api";
import { useState, useEffect } from "react";
import { Trash, Pencil } from "react-bootstrap-icons";
import { Button, Modal, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import Form from "../components/forms/Form";
import FormField from "../components/forms/FormField";
import { FaBuilding, FaPlus, FaHashtag } from "react-icons/fa";
import { composeValidators, required, minLength } from "../utils/validation";

function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    api.tenant.getTenantsList().then((response) => {
      setTenants(response.data);
    });
  }, []);

  function deleteTenant(id: number) {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    api.tenant
      .deleteTenantDelete({ tenantId: id })
      .then((response) => {
        if (response.status === 200) {
          const newTenants = tenants.filter(
            (tenant) => tenant.id !== id
          );
          setTenants(newTenants);
          toast.success("Tenant deleted successfully!");
        }
      })
      .catch((error: any) => {
        const apiError = error.response?.data;
        const errorMessage = typeof apiError === 'string' ? apiError : 
                           apiError?.message || 
                           error.message || 
                           "An unknown error occurred";
        toast.error(errorMessage, {
          autoClose: false,
        });
      });
  }

  return (
    <>
      <div className="mb-4">
        <h1 className="display-4 mb-3">Tenants</h1>
        <p className="lead text-muted">
          Manage your tenants. Add new tenants or modify existing ones.
        </p>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          className="d-flex align-items-center gap-2"
        >
          <FaPlus /> Add New Tenant
        </Button>
        <AddTenantModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          tenants={tenants}
          setTenants={setTenants}
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
                <th className="border-0 px-4 py-3">Code</th>
                <th className="border-0 px-4 py-3">Status</th>
                <th className="border-0 px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaBuilding className="text-primary" />
                      <span>{tenant.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <FaHashtag className="text-info" />
                      <span>{tenant.code || 'Not specified'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge bg={tenant.status === 1 ? "success" : "warning"} className="px-3 py-2">
                      {tenant.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => {
                          setSelectedTenant(tenant);
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
                        onClick={() => deleteTenant(tenant.id!)}
                      >
                        <Trash size={16} />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
                    <div className="d-flex flex-column align-items-center gap-2">
                      <FaBuilding size={32} />
                      <p className="mb-0">No tenants found</p>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setShowAddModal(true)}
                      >
                        Create your first tenant
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <UpdateTenantModal
        show={showUpdateModal}
        handleClose={() => {
          setShowUpdateModal(false);
          setSelectedTenant(null);
        }}
        tenant={selectedTenant}
        tenants={tenants}
        setTenants={setTenants}
      />
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
  const initialValues = {
    name: "",
    code: "",
    status: "1",
  };

  const handleSubmit = async (values: any) => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    try {
      const response = await api.tenant.addTenantCreate({
        tenantName: values.name,
        tenantCode: values.code,
        tenantStatus: parseInt(values.status),
      });

      if (response.status === 200) {
        const newTenant: Tenant = {
          id: response.data!,
          name: values.name,
          code: values.code,
          status: parseInt(values.status),
        };
        setTenants([...tenants, newTenant]);
        handleClose();
        toast.success("Tenant added successfully!");
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
        <Modal.Title>Add Tenant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Add Tenant"
          loadingText="Adding Tenant..."
          successMessage="Tenant added successfully!"
        >
          <FormField
            name="name"
            label="Tenant Name"
            required
            icon={<FaBuilding />}
            validate={composeValidators(required, minLength(2))}
            helpText="Enter a unique name for the tenant"
          />
          <FormField
            name="code"
            label="Tenant Code"
            required
            icon={<FaHashtag />}
            validate={composeValidators(required, minLength(2))}
            helpText="Enter a unique code for the tenant"
          />
          <FormField
            name="status"
            label="Status"
            type="select"
            required
            options={[
              { value: "1", label: "Active" },
              { value: "2", label: "Inactive" }
            ]}
            helpText="Select the tenant's status"
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function UpdateTenantModal({
  show,
  handleClose,
  tenant,
  tenants,
  setTenants,
}: {
  show: boolean;
  handleClose: () => void;
  tenant: Tenant | null;
  tenants: Tenant[];
  setTenants: (tenants: Tenant[]) => void;
}) {
  if (!tenant) return null;

  const initialValues = {
    name: tenant.name || "",
    code: tenant.code || "",
    status: tenant.status?.toString() || "1",
  };

  const handleSubmit = async (values: any) => {
    const api = new Api({
      baseURL: "http://localhost:5022",
    });

    try {
      const response = await api.tenant.updateTenantUpdate({
        tenantId: tenant.id!,
        tenantName: values.name,
        tenantCode: values.code,
        tenantStatus: parseInt(values.status),
      });

      if (response.status === 200) {
        const updatedTenant: Tenant = {
          id: tenant.id,
          name: values.name,
          code: values.code,
          status: parseInt(values.status),
        };

        const newTenants = tenants.map((t) =>
          t.id === updatedTenant.id ? updatedTenant : t
        );

        setTenants(newTenants);
        handleClose();
        toast.success("Tenant updated successfully!");
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
        <Modal.Title>Update Tenant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitText="Update Tenant"
          loadingText="Updating Tenant..."
          successMessage="Tenant updated successfully!"
        >
          <FormField
            name="name"
            label="Tenant Name"
            required
            icon={<FaBuilding />}
            validate={composeValidators(required, minLength(2))}
            helpText="Enter a unique name for the tenant"
          />
          <FormField
            name="code"
            label="Tenant Code"
            required
            icon={<FaHashtag />}
            validate={composeValidators(required, minLength(2))}
            helpText="Enter a unique code for the tenant"
          />
          <FormField
            name="status"
            label="Status"
            type="select"
            required
            options={[
              { value: "1", label: "Active" },
              { value: "2", label: "Inactive" }
            ]}
            helpText="Select the tenant's status"
          />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Tenants;
