"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useRegisterUserMutation } from "@/app/redux/services/authApi";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface RegisterFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  area: string;
}

const getApiErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "status" in error) {
    const apiError = error as FetchBaseQueryError;

    if (apiError.status === 409) {
      return "Email already registered. Please use a different email.";
    }

    if (
      typeof apiError.data === "object" &&
      apiError.data !== null &&
      "message" in apiError.data &&
      typeof apiError.data.message === "string"
    ) {
      return apiError.data.message;
    }

    return "Unable to register. Please try again later.";
  }

  return "Unable to connect to the server. Please try again.";
};

const registerValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email address is required"),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  role: Yup.string()
    .oneOf(["CUSTOMER", "PROVIDER"], "Please select a valid registration type")
    .required("Role is required"),

  country: Yup.string().required("Country is required"),

  state: Yup.string().required("State is required"),

  city: Yup.string().trim().required("City is required"),

  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
    .required("Pincode is required"),

  area: Yup.string().trim().required("Area / Locality is required"),
});

export default function RegisterPage() {
  const router = useRouter();

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "CUSTOMER",
      country: "India",
      state: "",
      city: "",
      pincode: "",
      area: "",
    },

    validationSchema: registerValidationSchema,

    onSubmit: async (values) => {
      // Clear old messages
      setSuccessMessage("");
      setApiError("");

      try {
        const response = await registerUser({
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
          role: values.role as "CUSTOMER" | "PROVIDER",

          address: {
            country: values.country,
            state: values.state,
            city: values.city,
            pincode: values.pincode,
            area: values.area,
          },
        }).unwrap();

        // 1. SUCCESS MESSAGE
        setSuccessMessage(response.message || "Registration successful!");

        // 4. REDIRECT TO LOGIN
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch (error) {
        console.error("Registration failed:", error);

        setApiError(getApiErrorMessage(error));
      }
    },
  });

  return (
    <main className="register">
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Left Section */}
          <div className="col-lg-5 d-none d-lg-flex register__left-section">
            <div className="register__overlay">
              <div className="register__brand">ServiceHub</div>

              <div className="register__hero-content">
                <h1>
                  Connect with trusted
                  <span> service professionals.</span>
                </h1>

                <p>
                  Find reliable local professionals or grow your service
                  business with ServiceHub.
                </p>

                <div className="register__feature-list">
                  <div className="register__feature-item">
                    <span>✓</span>
                    Find trusted local services
                  </div>

                  <div className="register__feature-item">
                    <span>✓</span>
                    Easy and secure booking
                  </div>

                  <div className="register__feature-item">
                    <span>✓</span>
                    Manage your bookings easily
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-lg-7">
            <div className="register__form-section">
              <div className="register__mobile-brand">ServiceHub</div>

              <div className="register__form-container">
                <div className="register__form-header">
                  <h2>Create an account</h2>

                  <p>Join ServiceHub and get started today.</p>
                </div>

                {/* SUCCESS MESSAGE */}

                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                    <br />
                    Redirecting you to login...
                  </div>
                )}

                {/* API ERROR MESSAGE */}

                {apiError && (
                  <div className="alert alert-danger" role="alert">
                    {apiError}
                  </div>
                )}

                <form onSubmit={formik.handleSubmit}>
                  {/* Full Name */}

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`form-control ${
                        formik.touched.name && formik.errors.name
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter your full name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    {formik.touched.name && formik.errors.name && (
                      <div className="invalid-feedback">
                        {formik.errors.name}
                      </div>
                    )}
                  </div>

                  {/* Email + Phone */}

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        className={`form-control ${
                          formik.touched.email && formik.errors.email
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter your email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.email && formik.errors.email && (
                        <div className="invalid-feedback">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        className={`form-control ${
                          formik.touched.phone && formik.errors.phone
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter your phone number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.phone && formik.errors.phone && (
                        <div className="invalid-feedback">
                          {formik.errors.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password + Role */}

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>

                      <input
                        id="password"
                        name="password"
                        type="password"
                        className={`form-control ${
                          formik.touched.password && formik.errors.password
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Create a password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.password && formik.errors.password && (
                        <div className="invalid-feedback">
                          {formik.errors.password}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="role" className="form-label">
                        Register As
                      </label>

                      <select
                        id="role"
                        name="role"
                        className={`form-select ${
                          formik.touched.role && formik.errors.role
                            ? "is-invalid"
                            : ""
                        }`}
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="CUSTOMER">Customer</option>

                        <option value="PROVIDER">Service Provider</option>
                      </select>

                      {formik.touched.role && formik.errors.role && (
                        <div className="invalid-feedback">
                          {formik.errors.role}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location */}

                  <div className="register__section-title">Location</div>

                  {/* Country + State */}

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="country" className="form-label">
                        Country
                      </label>

                      <select
                        id="country"
                        name="country"
                        className={`form-select ${
                          formik.touched.country && formik.errors.country
                            ? "is-invalid"
                            : ""
                        }`}
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="India">India</option>

                        <option value="USA">United States</option>

                        <option value="UK">United Kingdom</option>
                      </select>

                      {formik.touched.country && formik.errors.country && (
                        <div className="invalid-feedback">
                          {formik.errors.country}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="state" className="form-label">
                        State
                      </label>

                      <select
                        id="state"
                        name="state"
                        className={`form-select ${
                          formik.touched.state && formik.errors.state
                            ? "is-invalid"
                            : ""
                        }`}
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="" disabled>
                          Select state
                        </option>

                        <option value="Telangana">Telangana</option>

                        <option value="Andhra Pradesh">Andhra Pradesh</option>

                        <option value="Karnataka">Karnataka</option>

                        <option value="Tamil Nadu">Tamil Nadu</option>

                        <option value="Maharashtra">Maharashtra</option>
                      </select>

                      {formik.touched.state && formik.errors.state && (
                        <div className="invalid-feedback">
                          {formik.errors.state}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* City + Pincode */}

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="city" className="form-label">
                        City
                      </label>

                      <input
                        id="city"
                        name="city"
                        type="text"
                        className={`form-control ${
                          formik.touched.city && formik.errors.city
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter your city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.city && formik.errors.city && (
                        <div className="invalid-feedback">
                          {formik.errors.city}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="pincode" className="form-label">
                        Pincode
                      </label>

                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        className={`form-control ${
                          formik.touched.pincode && formik.errors.pincode
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Enter pincode"
                        value={formik.values.pincode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.pincode && formik.errors.pincode && (
                        <div className="invalid-feedback">
                          {formik.errors.pincode}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Area */}

                  <div className="mb-4">
                    <label htmlFor="area" className="form-label">
                      Area / Locality
                    </label>

                    <input
                      id="area"
                      name="area"
                      type="text"
                      className={`form-control ${
                        formik.touched.area && formik.errors.area
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter your area or locality"
                      value={formik.values.area}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    {formik.touched.area && formik.errors.area && (
                      <div className="invalid-feedback">
                        {formik.errors.area}
                      </div>
                    )}
                  </div>

                  {/* Submit */}

                  <button
                    type="submit"
                    className="btn w-100 register__button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering..." : "Register"}
                  </button>
                </form>

                {/* Login */}

                <div className="register__login-text">
                  Already have an account? <Link href="/login">Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
