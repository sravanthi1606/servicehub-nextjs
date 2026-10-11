"use client";

import { useRouter } from "next/navigation";
import { useGetCustomerServicesQuery } from "@/app/redux/services/serviceApi";
import "./customer-services.scss";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  status: string;
}

interface CustomerServicesResponse {
  success: boolean;
  data: Service[];
  message?: string;
}

export default function CustomerServicesPage() {
  const router = useRouter();

  const { data, isLoading, isFetching, isError, refetch } =
    useGetCustomerServicesQuery();

  const response = data as CustomerServicesResponse | undefined;
  const services = response?.data ?? [];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  if (isLoading) {
    return (
      <div className="customer-services">
        {" "}
        <div className="customer-services__loading">
          {" "}
          <div className="spinner-border text-primary" role="status">
            {" "}
            <span className="visually-hidden">Loading services...</span>{" "}
          </div>{" "}
          <p>Loading available services...</p>{" "}
        </div>{" "}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="customer-services">
        {" "}
        <div className="customer-services__message">
          {" "}
          <h5>Unable to load services</h5>{" "}
          <p>Please check your connection and try again.</p>
          <button className="btn btn-primary" onClick={() => refetch()}>
            Try Again{" "}
          </button>{" "}
        </div>{" "}
      </div>
    );
  }

  return (
    <div className="customer-services">
      {" "}
      <div className="customer-services__header">
        {" "}
        <div>
          {" "}
          <p className="customer-services__eyebrow">SERVICEHUB </p>{" "}
          <h2>Explore Services</h2>{" "}
          <p className="customer-services__subtitle">
            Find trusted professionals for your everyday needs.{" "}
          </p>{" "}
        </div>
        ```
        <span className="customer-services__count">
          {services.length} {services.length === 1 ? "service" : "services"}{" "}
          available
        </span>
      </div>
      {isFetching && <p className="text-muted small">Refreshing services...</p>}
      {services.length === 0 ? (
        <div className="customer-services__message">
          <div className="customer-services__empty-icon">
            <i className="bi bi-search" aria-hidden="true" />
          </div>
          <h5>No services available</h5>
          <p>
            There are no active services right now. Please check again later.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {services.map((service) => (
            <div className="col-12 col-md-6 col-xl-4" key={service.id}>
              <article className="card customer-services__card h-100">
                <div className="customer-services__card-top">
                  <span className="customer-services__category">
                    {service.category}
                  </span>
                  <i
                    className="bi bi-patch-check-fill customer-services__verified"
                    aria-label="Available service"
                    title="Available service"
                  />
                </div>

                <div className="card-body d-flex flex-column">
                  <h5 className="customer-services__name">{service.name}</h5>

                  <p className="customer-services__description">
                    {service.description || "No description provided."}
                  </p>

                  <div className="customer-services__details">
                    <div>
                      <span className="customer-services__detail-label">
                        Price
                      </span>
                      <strong className="customer-services__price">
                        {formatPrice(service.price)}
                      </strong>
                    </div>

                    <div className="text-end">
                      <span className="customer-services__detail-label">
                        Duration
                      </span>
                      <strong>{service.duration || "Not specified"}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary customer-services__book-btn mt-auto"
                    onClick={() =>
                      router.push(
                        `/customer/bookings/create?serviceId=${encodeURIComponent(
                          service.id,
                        )}`,
                      )
                    }
                  >
                    Book Service
                    <i className="bi bi-arrow-right ms-2" />
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
