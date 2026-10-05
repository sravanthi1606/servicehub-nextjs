"use client";

import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginUserMutation } from "@/app/redux/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/app/redux/slice/authSlice";
import { useRouter } from "next/dist/client/components/navigation";

interface LoginFormValues {
  email: string;
  password: string;
}

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email address is required"),

  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginValidationSchema,

    onSubmit: async (values) => {
      try {
        const response = await loginUser(values).unwrap();

        dispatch(
          setCredentials({
            token: response.data.token,
            user: response.data.user,
          }),
        );

        const role = response.data.user.role;

        if (role === "CUSTOMER") {
          router.push("/customer/dashboard");
        } else if (role === "PROVIDER") {
          router.push("/provider/dashboard");
        } else if (role === "ADMIN") {
          router.push("/admin/dashboard");
        }
      } catch (error) {
        console.error("Login failed:", error);
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
                  Welcome back to
                  <span> ServiceHub.</span>
                </h1>

                <p>
                  Login to manage your bookings, services and ServiceHub
                  account.
                </p>

                <div className="register__feature-list">
                  <div className="register__feature-item">
                    <span>✓</span>
                    Manage your bookings
                  </div>

                  <div className="register__feature-item">
                    <span>✓</span>
                    Connect with trusted professionals
                  </div>

                  <div className="register__feature-item">
                    <span>✓</span>
                    Access your ServiceHub account
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
                  <h2>Welcome Back</h2>

                  <p>Login to your ServiceHub account.</p>
                </div>

                <form onSubmit={formik.handleSubmit}>
                  {/* Email */}

                  <div className="mb-3">
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

                  {/* Password */}

                  <div className="mb-4">
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
                      placeholder="Enter your password"
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

                  {/* Login Button */}

                  <button type="submit" className="btn w-100 register__button">
                    Login
                  </button>
                </form>

                {/* Register */}

                <div className="register__login-text">
                  Don&apos;t have an account?{" "}
                  <Link href="/register">Create an account</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
