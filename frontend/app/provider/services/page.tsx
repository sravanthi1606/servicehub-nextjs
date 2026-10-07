"use client";

import Link from "next/link";
import { useState } from "react";

import {
  useGetProviderServicesQuery,
  useUpdateServiceStatusMutation,
} from "@/app/redux/services/serviceApi";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  providerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ProviderServicesPage = () => {
  const {
    data: response,
    isLoading,
    isError,
  } = useGetProviderServicesQuery(undefined);
  const [updateServiceStatus] = useUpdateServiceStatusMutation();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const services: Service[] = response?.data || [];

  const handleToggleStatus = async (service: Service) => {
    const status = service.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    setTogglingId(service.id);
    setStatusError(null);

    try {
      await updateServiceStatus({ id: service.id, status }).unwrap();
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update service status. Please try again.";

      setStatusError(message);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-semibold">My Services</h4>

          <p className="text-muted mb-0">
            Manage the services you provide to customers.
          </p>
        </div>

        <Link href="/provider/services/create" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>
          Add Service
        </Link>
      </div>

      {/* Services Card */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {/* Loading */}
          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>

              <p className="text-muted mt-3 mb-0">Loading services...</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="alert alert-danger mb-0">
              <i className="bi bi-exclamation-circle me-2"></i>
              Failed to load services. Please try again.
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && services.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-grid fs-1 text-muted"></i>

              <h5 className="mt-3">No services found</h5>

              <p className="text-muted">
                You haven&apos;t created any services yet.
              </p>

              <Link
                href="/provider/services/create"
                className="btn btn-primary"
              >
                <i className="bi bi-plus-lg me-1"></i>
                Create Service
              </Link>
            </div>
          )}

          {/* Status Update Error */}
          {statusError && (
            <div className="alert alert-danger alert-dismissible">
              <i className="bi bi-exclamation-circle me-2"></i>
              {statusError}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setStatusError(null)}
              ></button>
            </div>
          )}

          {/* Services Table */}
          {!isLoading && !isError && services.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Service</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      {/* Service */}
                      <td>
                        <div>
                          <h6 className="mb-1 fw-semibold">{service.name}</h6>

                          <small className="text-muted">
                            {service.description}
                          </small>
                        </div>
                      </td>

                      {/* Category */}
                      <td>{service.category.replace(/_/g, " ")}</td>

                      {/* Price */}
                      <td>
                        <span className="fw-medium">₹{service.price}</span>
                      </td>

                      {/* Duration */}
                      <td>{service.duration}</td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge ${
                            service.status === "ACTIVE"
                              ? "bg-success-subtle text-success"
                              : "bg-secondary-subtle text-secondary"
                          }`}
                        >
                          {service.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="text-end">
                        <Link
                          href={`/provider/services/edit/${service.id}`}
                          className="btn btn-sm btn-light me-3 align-middle"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>

                        <div className="form-check form-switch d-inline-block mb-0 align-middle">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            title={
                              service.status === "ACTIVE"
                                ? "Deactivate service"
                                : "Activate service"
                            }
                            aria-label={`Toggle status for ${service.name}`}
                            checked={service.status === "ACTIVE"}
                            onChange={() => handleToggleStatus(service)}
                            disabled={togglingId === service.id}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderServicesPage;
