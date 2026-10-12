
"use client";

import { useMemo, useState } from "react";
import {
  useGetCustomerBookingsQuery,
  useCancelCustomerBookingMutation,
} from "@/app/redux/services/serviceApi";
import "@/styles/customer-bookings.scss";

interface BookingAddress {
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
  area?: string;
  buildingNumber?: string;
  buildingName?: string;
  flatNumber?: string;
  block?: string;
  street?: string;
  landmark?: string;
}

interface CustomerBooking {
  id: string;
  customerId: string;
  providerId?: string | null;
  serviceId: string;
  serviceName?: string;
  provider?: {
    name: string;
    phone?: string;
    email?: string;
  };
  bookingDate: string;
  bookingTime: string;
  price: number;
  status: string;
  notes?: string;
  address?: BookingAddress | string;
  createdAt?: string;
  updatedAt?: string;
}

type BookingStatus =
  | "ALL"
  | "OPEN"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

const formatDate = (value?: string) => {
  if (!value) return "—";

  const match = value.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) return value;

  const [, year, month, day] = match;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value?: string) => {
  if (!value) return "—";

  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) return value;

  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price ?? 0);

const getBookingId = (booking: CustomerBooking) => {
  const id = booking.id || "";
  return id.length > 8 ? id.slice(-6).toUpperCase() : id.toUpperCase();
};

const getServiceName = (booking: CustomerBooking) => {
  if (booking.serviceName) return booking.serviceName;

  return booking.serviceId
    ? `Service #${booking.serviceId.slice(-6)}`
    : "Service";
};

const getStatusClass = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "OPEN":
      return "customer-bookings__status--open";
    case "ACCEPTED":
      return "customer-bookings__status--accepted";
    case "IN_PROGRESS":
      return "customer-bookings__status--progress";
    case "COMPLETED":
      return "customer-bookings__status--completed";
    case "CANCELLED":
      return "customer-bookings__status--cancelled";
    default:
      return "customer-bookings__status--default";
  }
};

const formatAddress = (address?: BookingAddress | string) => {
  if (!address) return "Address not available";
  if (typeof address === "string") return address;

  return (
    [
      address.flatNumber,
      address.buildingNumber,
      address.buildingName,
      address.block,
      address.street,
      address.area,
      address.landmark,
      address.city,
      address.district,
      address.state,
      address.pincode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ") || "Address not available"
  );
};

export default function CustomerBookingsPage() {
  const { data, isLoading, isError, refetch } =
    useGetCustomerBookingsQuery();

  const [cancelCustomerBooking, { isLoading: isCancelling }] =
    useCancelCustomerBookingMutation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus>("ALL");
  const [selectedBooking, setSelectedBooking] =
    useState<CustomerBooking | null>(null);

  const [cancelFeedback, setCancelFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const bookings = (data?.data ?? []) as CustomerBooking[];

  const summary = useMemo(
    () => ({
      total: bookings.length,
      open: bookings.filter(
        (booking) => booking.status?.toUpperCase() === "OPEN",
      ).length,
      accepted: bookings.filter(
        (booking) => booking.status?.toUpperCase() === "ACCEPTED",
      ).length,
      completed: bookings.filter(
        (booking) => booking.status?.toUpperCase() === "COMPLETED",
      ).length,
    }),
    [bookings],
  );

  const filteredBookings = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const status = booking.status?.toUpperCase();

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      const matchesSearch =
        !searchText ||
        getBookingId(booking).toLowerCase().includes(searchText) ||
        booking.id?.toLowerCase().includes(searchText) ||
        getServiceName(booking).toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const handleCancelBooking = async (booking: CustomerBooking) => {
    const status = booking.status?.toUpperCase();

    if (status !== "OPEN" && status !== "ACCEPTED") return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel booking #${getBookingId(booking)}?`,
    );

    if (!confirmed) return;

    setCancelFeedback(null);

    try {
      const response = await cancelCustomerBooking(booking.id).unwrap();

      setCancelFeedback({
        type: "success",
        message: response.message || "Booking cancelled successfully.",
      });

      // Close the modal if the cancelled booking is currently open.
      setSelectedBooking(null);
    } catch (error) {
      const apiError = error as {
        data?: { message?: string };
      };

      setCancelFeedback({
        type: "error",
        message:
          apiError.data?.message ||
          "Unable to cancel this booking. Please try again.",
      });
    }
  };

  return (
    <div className="customer-bookings">
      <div className="customer-bookings__header">
        <div>
          <h1 className="customer-bookings__title">My Bookings</h1>
          <p className="customer-bookings__subtitle">
            View and track all your service bookings.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="customer-bookings__summary">
        <div className="customer-bookings__summary-card">
          <div className="customer-bookings__summary-icon customer-bookings__summary-icon--total">
            <i className="bi bi-calendar-check" />
          </div>
          <div>
            <p>Total Bookings</p>
            <h3>{summary.total}</h3>
          </div>
        </div>

        <div className="customer-bookings__summary-card">
          <div className="customer-bookings__summary-icon customer-bookings__summary-icon--open">
            <i className="bi bi-clock-history" />
          </div>
          <div>
            <p>Open</p>
            <h3>{summary.open}</h3>
          </div>
        </div>

        <div className="customer-bookings__summary-card">
          <div className="customer-bookings__summary-icon customer-bookings__summary-icon--accepted">
            <i className="bi bi-check-circle" />
          </div>
          <div>
            <p>Accepted</p>
            <h3>{summary.accepted}</h3>
          </div>
        </div>

        <div className="customer-bookings__summary-card">
          <div className="customer-bookings__summary-icon customer-bookings__summary-icon--completed">
            <i className="bi bi-patch-check" />
          </div>
          <div>
            <p>Completed</p>
            <h3>{summary.completed}</h3>
          </div>
        </div>
      </div>

      {/* Booking history */}
      <div className="customer-bookings__panel">
        <div className="customer-bookings__toolbar">
          <div>
            <h2 className="customer-bookings__section-title">
              Booking History
            </h2>
            <p className="customer-bookings__section-subtitle">
              {filteredBookings.length} booking
              {filteredBookings.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="customer-bookings__filters">
            <div className="customer-bookings__search">
              <i className="bi bi-search" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search bookings..."
                aria-label="Search bookings"
              />

              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <i className="bi bi-x-lg" />
                </button>
              )}
            </div>

            <select
              className="form-select customer-bookings__status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as BookingStatus)
              }
              aria-label="Filter bookings by status"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {cancelFeedback && (
          <div
            className={`alert ${
              cancelFeedback.type === "success"
                ? "alert-success"
                : "alert-danger"
            } m-3`}
            role="status"
          >
            {cancelFeedback.message}
          </div>
        )}

        {isLoading ? (
          <div className="customer-bookings__state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading bookings...</span>
            </div>
            <p>Loading your bookings...</p>
          </div>
        ) : isError ? (
          <div className="customer-bookings__state">
            <div className="customer-bookings__state-icon customer-bookings__state-icon--error">
              <i className="bi bi-exclamation-triangle" />
            </div>
            <h3>Unable to load bookings</h3>
            <p>Please check your connection and try again.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => refetch()}
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="customer-bookings__state">
            <div className="customer-bookings__state-icon">
              <i className="bi bi-calendar2-x" />
            </div>
            <h3>No bookings yet</h3>
            <p>
              Your service bookings will appear here after you book a service.
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="customer-bookings__state">
            <div className="customer-bookings__state-icon">
              <i className="bi bi-search" />
            </div>
            <h3>No matching bookings</h3>
            <p>Try changing your search or status filter.</p>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive customer-bookings__table-wrapper">
            <table className="table customer-bookings__table align-middle">
              <thead>
                <tr>
                  <th scope="col">Booking ID</th>
                  <th scope="col">Service</th>
                  <th scope="col">Booking Date</th>
                  <th scope="col">Time</th>
                  <th scope="col">Price</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => {
                  const canCancel = ["OPEN", "ACCEPTED"].includes(
                    booking.status?.toUpperCase(),
                  );

                  return (
                    <tr key={booking.id}>
                      <td>
                        <button
                          type="button"
                          className="customer-bookings__id customer-bookings__id-button"
                          onClick={() => setSelectedBooking(booking)}
                          aria-label={`View booking ${getBookingId(booking)}`}
                        >
                          #{getBookingId(booking)}
                        </button>
                      </td>

                      <td>
                        <span className="customer-bookings__service">
                          {getServiceName(booking)}
                        </span>
                      </td>

                      <td>{formatDate(booking.bookingDate)}</td>
                      <td>{formatTime(booking.bookingTime)}</td>

                      <td className="customer-bookings__price">
                        {formatPrice(booking.price)}
                      </td>

                      <td>
                        <span
                          className={`customer-bookings__status ${getStatusClass(
                            booking.status,
                          )}`}
                        >
                          <span className="customer-bookings__status-dot" />
                          {booking.status?.replaceAll("_", " ") || "UNKNOWN"}
                        </span>
                      </td>

                      <td>
                        {canCancel && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            disabled={isCancelling}
                            onClick={() => handleCancelBooking(booking)}
                          >
                            {isCancelling ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-1"
                                  aria-hidden="true"
                                />
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-x-circle me-1" />
                                Cancel
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking details modal */}
      {selectedBooking && (
        <div
          className="customer-bookings__modal-backdrop"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="customer-bookings__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-bookings__modal-header">
              <div>
                <span className="customer-bookings__details-label">
                  BOOKING DETAILS
                </span>
                <h3 id="booking-modal-title">
                  Booking #{getBookingId(selectedBooking)}
                </h3>
                <p>{getServiceName(selectedBooking)}</p>
              </div>

              <button
                type="button"
                className="customer-bookings__close-button"
                onClick={() => setSelectedBooking(null)}
                aria-label="Close booking details"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="customer-bookings__modal-body">
              <div className="customer-bookings__details-grid">
                <div>
                  <span>Service</span>
                  <strong>{getServiceName(selectedBooking)}</strong>
                </div>

                <div>
                  <span>Booking ID</span>
                  <strong>#{getBookingId(selectedBooking)}</strong>
                </div>

                <div>
                  <span>Booking Date</span>
                  <strong>{formatDate(selectedBooking.bookingDate)}</strong>
                </div>

                <div>
                  <span>Booking Time</span>
                  <strong>{formatTime(selectedBooking.bookingTime)}</strong>
                </div>

                <div>
                  <span>Price</span>
                  <strong>{formatPrice(selectedBooking.price)}</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>
                    <span
                      className={`customer-bookings__status ${getStatusClass(
                        selectedBooking.status,
                      )}`}
                    >
                      <span className="customer-bookings__status-dot" />
                      {selectedBooking.status?.replaceAll("_", " ")}
                    </span>
                  </strong>
                </div>

                <div className="customer-bookings__details-full">
                  <span>Service Address</span>
                  <strong>{formatAddress(selectedBooking.address)}</strong>
                </div>

                <div className="customer-bookings__details-full">
                  <span>Notes</span>
                  <strong>
                    {selectedBooking.notes || "No additional notes"}
                  </strong>
                </div>
              </div>

              {selectedBooking.provider && (
                <div className="customer-bookings__provider">
                  <h4>Service Provider</h4>
                  <p>
                    <i className="bi bi-person me-2" />
                    {selectedBooking.provider.name}
                  </p>

                  {selectedBooking.provider.phone && (
                    <p>
                      <i className="bi bi-telephone me-2" />
                      {selectedBooking.provider.phone}
                    </p>
                  )}

                  {selectedBooking.provider.email && (
                    <p>
                      <i className="bi bi-envelope me-2" />
                      {selectedBooking.provider.email}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="customer-bookings__modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>

              {["OPEN", "ACCEPTED"].includes(
                selectedBooking.status?.toUpperCase(),
              ) && (
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={isCancelling}
                  onClick={() => handleCancelBooking(selectedBooking)}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Booking"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}