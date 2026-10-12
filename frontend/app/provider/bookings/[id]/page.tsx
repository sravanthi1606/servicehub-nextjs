
"use client";

import { useParams, useRouter } from "next/navigation";
import {
    useGetProviderBookingByIdQuery,
} from "@/app/redux/services/serviceApi";

export default function ProviderBookingDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const bookingId = params.id;

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetProviderBookingByIdQuery(bookingId, {
        skip: !bookingId,
    });

    const booking = data?.data;

    const formatDate = (date: string) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const address = booking?.address;

    const fullAddress = address
        ? [
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
              .join(", ")
        : "Address unavailable";

    return (
        <div className="container py-4">
            <button
                type="button"
                className="btn btn-outline-secondary mb-4"
                onClick={() => router.push("/provider/bookings")}
            >
                ← Back to My Bookings
            </button>

            <h1 className="mb-1">Booking Details</h1>
            <p className="text-muted mb-4">
                View the information for this service request.
            </p>

            {isLoading ? (
                <div className="card">
                    <div className="card-body">
                        Loading booking details...
                    </div>
                </div>
            ) : isError || !booking ? (
                <div className="alert alert-danger">
                    <p>Unable to load booking details.</p>
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => refetch()}
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <>
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                                <div>
                                    <h5 className="text-muted">
                                        Booking ID
                                    </h5>
                                    <p className="mb-0 fw-semibold">
                                        {booking.id}
                                    </p>
                                </div>

                                <span className="badge bg-primary">
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-12 col-lg-6">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title mb-4">
                                        Service & Schedule
                                    </h5>

                                    <p>
                                        <strong>Service ID:</strong>{" "}
                                        {booking.serviceId}
                                    </p>

                                    <p>
                                        <strong>Booking Date:</strong>{" "}
                                        {formatDate(booking.bookingDate)}
                                    </p>

                                    <p>
                                        <strong>Booking Time:</strong>{" "}
                                        {booking.bookingTime || "—"}
                                    </p>

                                    <p className="mb-0">
                                        <strong>Price:</strong>{" "}
                                        ₹
                                        {booking.price.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title mb-4">
                                        Customer Address
                                    </h5>

                                    <p className="mb-0">{fullAddress}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">
                                        Additional Notes
                                    </h5>

                                    <p className="mb-0">
                                        {booking.notes?.trim() ||
                                            "No additional notes provided."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
