"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    useCreateBookingMutation,
    useGetCustomerServicesQuery,
} from "@/app/redux/services/serviceApi";
import "@/styles/create-booking.scss";

interface BookingForm {
    bookingDate: string;
    bookingTime: string;
    country: string;
    state: string;
    district: string;
    city: string;
    pincode: string;
    area: string;
    buildingNumber: string;
    buildingName: string;
    flatNumber: string;
    block: string;
    street: string;
    landmark: string;
    notes: string;
}

interface ApiError {
    data?: {
        message?: string;
    };
}

const initialForm: BookingForm = {
    bookingDate: "",
    bookingTime: "",
    country: "India",
    state: "",
    district: "",
    city: "",
    pincode: "",
    area: "",
    buildingNumber: "",
    buildingName: "",
    flatNumber: "",
    block: "",
    street: "",
    landmark: "",
    notes: "",
};

function getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function CreateBookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceId = searchParams.get("serviceId");

    const { data: servicesResponse, isLoading: servicesLoading } =
        useGetCustomerServicesQuery();

    const [createBooking, { isLoading: isSubmitting }] =
        useCreateBookingMutation();

    const [form, setForm] = useState<BookingForm>(initialForm);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const services = servicesResponse?.data ?? [];
    const selectedService = services.find(
        (service) => service.id === serviceId
    );

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!serviceId) {
            setErrorMessage("Please select a service before booking.");
            return;
        }

        try {
            const response = await createBooking({
                serviceId,
                bookingDate: form.bookingDate,
                bookingTime: form.bookingTime,
                country: form.country,
                state: form.state,
                district: form.district,
                city: form.city,
                pincode: form.pincode,
                area: form.area,
                buildingNumber: form.buildingNumber,
                buildingName: form.buildingName,
                flatNumber: form.flatNumber,
                block: form.block,
                street: form.street,
                landmark: form.landmark,
                latitude: 0,
                longitude: 0,
                notes: form.notes,
            }).unwrap();

            setSuccessMessage(
                response.message || "Your booking request was submitted successfully."
            );
        } catch (error: unknown) {
            const apiError = error as ApiError;

            setErrorMessage(
                apiError.data?.message ||
                "Unable to create your booking. Please check your details and try again."
            );
        }
    }

    if (!serviceId) {
        return (
            <div className="create-booking">
                <div className="alert alert-warning">
                    No service was selected. Please return to the services page.
                    <button
                        className="btn btn-link"
                        onClick={() => router.push("/customer/services")}
                    >
                        Browse Services
                    </button>
                </div>
            </div>
        );
    }

    if (servicesLoading) {
        return (
            <div className="create-booking__loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading service...</span>
                </div>
                <p>Loading booking details...</p>
            </div>
        );
    }

    if (!selectedService) {
        return (
            <div className="create-booking">
                <div className="alert alert-warning">
                    This service is unavailable or no longer active.
                    <button
                        className="btn btn-link"
                        onClick={() => router.push("/customer/services")}
                    >
                        Browse Services
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="create-booking">
            <div className="create-booking__header">
                <button
                    type="button"
                    className="btn btn-link p-0 mb-3"
                    onClick={() => router.push("/customer/services")}
                >
                    <i className="bi bi-arrow-left me-2" />
                    Back to Services
                </button>

                <h2>Book a Service</h2>
                <p>Choose your preferred date, time, and service address.</p>
            </div>

            {successMessage ? (
                <div className="create-booking__success">
                    <div className="create-booking__success-icon">
                        <i className="bi bi-check-circle-fill" />
                    </div>
                    <h4>Booking Request Submitted!</h4>
                    <p>{successMessage}</p>
                    <p>
                        <strong>Service:</strong> {selectedService.name}
                    </p>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => router.push("/customer/bookings")}
                    >
                        View My Bookings
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary ms-2"
                        onClick={() => router.push("/customer/services")}
                    >
                        Browse More Services
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="create-booking__service-summary">
                        <div>
                            <span>{selectedService.category}</span>
                            <h5>{selectedService.name}</h5>
                            <p>{selectedService.description}</p>
                        </div>
                        <div className="create-booking__price">
                            <span>Service price</span>
                            <strong>
                                {new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                    maximumFractionDigits: 0,
                                }).format(selectedService.price)}
                            </strong>
                            <small>{selectedService.duration}</small>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <section className="create-booking__section">
                        <h5>
                            <i className="bi bi-calendar-event me-2" />
                            Schedule Your Service
                        </h5>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="bookingDate" className="form-label">
                                    Preferred Date *
                                </label>
                                <input
                                    id="bookingDate"
                                    name="bookingDate"
                                    type="date"
                                    className="form-control"
                                    min={getTodayDate()}
                                    value={form.bookingDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="bookingTime" className="form-label">
                                    Preferred Time *
                                </label>
                                <input
                                    id="bookingTime"
                                    name="bookingTime"
                                    type="time"
                                    className="form-control"
                                    value={form.bookingTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="create-booking__section">
                        <h5>
                            <i className="bi bi-geo-alt me-2" />
                            Service Address
                        </h5>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="country" className="form-label">
                                    Country *
                                </label>
                                <input
                                    id="country"
                                    name="country"
                                    className="form-control"
                                    value={form.country}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="state" className="form-label">
                                    State *
                                </label>
                                <input
                                    id="state"
                                    name="state"
                                    className="form-control"
                                    value={form.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="district" className="form-label">
                                    District
                                </label>
                                <input
                                    id="district"
                                    name="district"
                                    className="form-control"
                                    value={form.district}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="city" className="form-label">
                                    City *
                                </label>
                                <input
                                    id="city"
                                    name="city"
                                    className="form-control"
                                    value={form.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="pincode" className="form-label">
                                    PIN Code *
                                </label>
                                <input
                                    id="pincode"
                                    name="pincode"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]{6}"
                                    maxLength={6}
                                    className="form-control"
                                    value={form.pincode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="area" className="form-label">
                                    Area / Locality *
                                </label>
                                <input
                                    id="area"
                                    name="area"
                                    className="form-control"
                                    value={form.area}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="buildingNumber" className="form-label">
                                    Building / House Number
                                </label>
                                <input
                                    id="buildingNumber"
                                    name="buildingNumber"
                                    className="form-control"
                                    value={form.buildingNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="buildingName" className="form-label">
                                    Building Name
                                </label>
                                <input
                                    id="buildingName"
                                    name="buildingName"
                                    className="form-control"
                                    value={form.buildingName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="flatNumber" className="form-label">
                                    Flat Number
                                </label>
                                <input
                                    id="flatNumber"
                                    name="flatNumber"
                                    className="form-control"
                                    value={form.flatNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="block" className="form-label">
                                    Block
                                </label>
                                <input
                                    id="block"
                                    name="block"
                                    className="form-control"
                                    value={form.block}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="street" className="form-label">
                                    Street
                                </label>
                                <input
                                    id="street"
                                    name="street"
                                    className="form-control"
                                    value={form.street}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="landmark" className="form-label">
                                    Nearby Landmark
                                </label>
                                <input
                                    id="landmark"
                                    name="landmark"
                                    className="form-control"
                                    value={form.landmark}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="create-booking__section">
                        <h5>
                            <i className="bi bi-chat-left-text me-2" />
                            Additional Details
                        </h5>

                        <label htmlFor="notes" className="form-label">
                            Notes for the Service Provider
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            className="form-control"
                            rows={3}
                            placeholder="Add any special instructions (optional)"
                            value={form.notes}
                            onChange={handleChange}
                        />
                    </section>

                    <div className="create-booking__footer">
                        <div>
                            <span>Total service price</span>
                            <strong>
                                {new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                    maximumFractionDigits: 0,
                                }).format(selectedService.price)}
                            </strong>
                            <small>Final price is based on the selected service.</small>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        aria-hidden="true"
                                    />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Confirm Booking
                                    <i className="bi bi-arrow-right ms-2" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}