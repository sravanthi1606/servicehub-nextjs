"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetProviderBookingsQuery,
  useAcceptProviderBookingMutation,
  type ProviderBooking,
  useUpdateProviderBookingStatusMutation,
} from "@/app/redux/services/serviceApi";
import "@/styles/provider-bookings.scss";

export default function ProviderBookingsPage() {
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useGetProviderBookingsQuery();

  const [acceptBooking, { isLoading: isAccepting }] =
    useAcceptProviderBookingMutation();

  const [updateBookingStatus, { isLoading: isUpdatingStatus }] =
    useUpdateProviderBookingStatusMutation();

  const handleStatusUpdate = async (
    bookingId: string,
    status: "IN_PROGRESS" | "COMPLETED",
  ) => {
    setSelectedBooking(bookingId);
    setMessage("");
    setErrorMessage("");

    try {
      const response = await updateBookingStatus({
        bookingId,
        status,
      }).unwrap();

      setMessage(response.message || "Booking status updated successfully.");

      await refetch();
    } catch (error: unknown) {
      const apiError = error as {
        data?: { message?: string };
      };

      setErrorMessage(
        apiError.data?.message || "Unable to update booking status.",
      );
    } finally {
      setSelectedBooking(null);
    }
  };

  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const bookings = data?.data ?? [];

  const handleAccept = async (bookingId: string) => {
    setSelectedBooking(bookingId);
    setMessage("");
    setErrorMessage("");

    try {
      const response = await acceptBooking(bookingId).unwrap();

      setMessage(response.message || "Booking accepted successfully.");
      await refetch();
    } catch (error: unknown) {
      const apiError = error as {
        data?: { message?: string };
      };

      setErrorMessage(
        apiError.data?.message || "Unable to accept this booking.",
      );
    } finally {
      setSelectedBooking(null);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAddress = (address: ProviderBooking["address"]) => {
    return (
      [address.area, address.city, address.district, address.pincode]
        .filter(Boolean)
        .join(", ") || "Address unavailable"
    );
  };

  return (
    <div className="provider-bookings">
      <div className="provider-bookings__header">
        <div>
          <h1>Available Bookings</h1>
          <p>
            Review new service requests and accept the bookings you can fulfil.
          </p>
        </div>

        <button
          type="button"
          className="provider-bookings__refresh"
          onClick={() => refetch()}
        >
          Refresh
        </button>
      </div>

      <div className="provider-bookings__summary">
        <div className="provider-bookings__summary-card">
          <span>Open bookings</span>
          <strong>{bookings.length}</strong>
        </div>
      </div>

      {message && (
        <div className="provider-bookings__alert provider-bookings__alert--success">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="provider-bookings__alert provider-bookings__alert--error">
          {errorMessage}
        </div>
      )}

      <div className="provider-bookings__table-wrapper">
        {isLoading ? (
          <p className="provider-bookings__state">
            Loading available bookings...
          </p>
        ) : isError ? (
          <div className="provider-bookings__state">
            <p>Unable to load bookings.</p>
            <button type="button" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="provider-bookings__state">
            <h3>No open bookings right now</h3>
            <p>New customer requests will appear here.</p>
          </div>
        ) : (
          <table className="provider-bookings__table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Service ID</th>
                <th>Booking Date</th>
                <th>Time</th>
                <th>Customer Address</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking: ProviderBooking) => (
                <tr key={booking.id}>
                  <td>
                    <span className="provider-bookings__id">
                      {booking.id.slice(-8).toUpperCase()}
                    </span>
                  </td>

                  <td>
                    <span className="provider-bookings__service-id">
                      {booking.serviceId.slice(-8)}
                    </span>
                  </td>

                  <td>{formatDate(booking.bookingDate)}</td>
                  <td>{booking.bookingTime || "—"}</td>
                  <td className="provider-bookings__address">
                    {formatAddress(booking.address)}
                  </td>

                  <td className="provider-bookings__price">
                    ₹{booking.price.toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span className="provider-bookings__status">
                      {booking.status}
                    </span>
                  </td>

                  <td>
                    {booking.status === "OPEN" && !booking.providerId ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAccept(booking.id)}
                        disabled={isAccepting && selectedBooking === booking.id}
                      >
                        {isAccepting && selectedBooking === booking.id
                          ? "Accepting..."
                          : "Accept"}
                      </button>
                    ) : booking.status === "ACCEPTED" ? (
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          handleStatusUpdate(booking.id, "IN_PROGRESS")
                        }
                        disabled={
                          isUpdatingStatus && selectedBooking === booking.id
                        }
                      >
                        {isUpdatingStatus && selectedBooking === booking.id
                          ? "Starting..."
                          : "Start Service"}
                      </button>
                    ) : booking.status === "IN_PROGRESS" ? (
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          handleStatusUpdate(booking.id, "COMPLETED")
                        }
                        disabled={
                          isUpdatingStatus && selectedBooking === booking.id
                        }
                      >
                        {isUpdatingStatus && selectedBooking === booking.id
                          ? "Completing..."
                          : "Complete Booking"}
                      </button>
                    ) : booking.status === "COMPLETED" ||
                      booking.status === "CANCELLED" ? (
                      <span className="text-muted">—</span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          router.push(`/provider/bookings/${booking.id}`)
                        }
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
