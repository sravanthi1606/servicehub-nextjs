"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { useFormik } from "formik";

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

export default function RegisterPage() {
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

    onSubmit: (values) => {
      console.log("Register form submitted");
      console.log(values);
    },
  });

  return (
    <main className="register">
      <div className="container-fluid">
        <div className="row min-vh-100">

          {/* Left Section */}
          <div className="col-lg-5 d-none d-lg-flex register__left-section">
            <div className="register__overlay">

              <div className="register__brand">
                ServiceHub
              </div>

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

              {/* Mobile Brand */}
              <div className="register__mobile-brand">
                ServiceHub
              </div>

              <div className="register__form-container">

                {/* Header */}
                <div className="register__form-header">
                  <h2>Create an account</h2>

                  <p>
                    Join ServiceHub and get started today.
                  </p>
                </div>

                <form onSubmit={formik.handleSubmit}>

                  {/* Full Name */}
                  <div className="mb-3">
                    <label
                      htmlFor="name"
                      className="form-label"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-control"
                      placeholder="Enter your full name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="email"
                        className="form-label"
                      >
                        Email Address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="phone"
                        className="form-label"
                      >
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="form-control"
                        placeholder="Enter your phone number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                  </div>

                  {/* Password + Role */}
                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="password"
                        className="form-label"
                      >
                        Password
                      </label>

                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="Create a password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="role"
                        className="form-label"
                      >
                        Register As
                      </label>

                      <select
                        id="role"
                        name="role"
                        className="form-select"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="CUSTOMER">
                          Customer
                        </option>

                        <option value="PROVIDER">
                          Service Provider
                        </option>
                      </select>
                    </div>

                  </div>

                  {/* Location Section */}
                  <div className="register__section-title">
                    Location
                  </div>

                  {/* Country + State */}
                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="country"
                        className="form-label"
                      >
                        Country
                      </label>

                      <select
                        id="country"
                        name="country"
                        className="form-select"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="India">
                          India
                        </option>

                        <option value="USA">
                          United States
                        </option>

                        <option value="UK">
                          United Kingdom
                        </option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="state"
                        className="form-label"
                      >
                        State
                      </label>

                      <select
                        id="state"
                        name="state"
                        className="form-select"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option value="" disabled>
                          Select state
                        </option>

                        <option value="Telangana">
                          Telangana
                        </option>

                        <option value="Andhra Pradesh">
                          Andhra Pradesh
                        </option>

                        <option value="Karnataka">
                          Karnataka
                        </option>

                        <option value="Tamil Nadu">
                          Tamil Nadu
                        </option>

                        <option value="Maharashtra">
                          Maharashtra
                        </option>
                      </select>
                    </div>

                  </div>

                  {/* City + Pincode */}
                  <div className="row">

                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="city"
                        className="form-label"
                      >
                        City
                      </label>

                      <input
                        id="city"
                        name="city"
                        type="text"
                        className="form-control"
                        placeholder="Enter your city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="pincode"
                        className="form-label"
                      >
                        Pincode
                      </label>

                      <input
                        id="pincode"
                        name="pincode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        className="form-control"
                        placeholder="Enter pincode"
                        value={formik.values.pincode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                  </div>

                  {/* Area */}
                  <div className="mb-4">
                    <label
                      htmlFor="area"
                      className="form-label"
                    >
                      Area / Locality
                    </label>

                    <input
                      id="area"
                      name="area"
                      type="text"
                      className="form-control"
                      placeholder="Enter your area or locality"
                      value={formik.values.area}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn w-100 register__button"
                  >
                    Create Account
                  </button>

                </form>

                {/* Login */}
                <div className="register__login-text">
                  Already have an account?{" "}

                  <Link href="/login">
                    Login
                  </Link>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
