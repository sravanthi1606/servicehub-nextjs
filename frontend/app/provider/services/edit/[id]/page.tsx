"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  useGetProviderServicesQuery,
  useUpdateServiceMutation,
} from "@/app/redux/services/serviceApi";

interface ServiceFormValues {
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Service name is required")
    .min(3, "Service name must be at least 3 characters"),

  category: Yup.string().required("Please select a category"),

  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),

  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0"),

  duration: Yup.string().required("Duration is required"),
});

const EditServicePage = () => {
  const params = useParams();
  const router = useRouter();

  const serviceId = params.id as string;

  const {
    data: response,
    isLoading: isFetching,
    isError: isFetchError,
  } = useGetProviderServicesQuery(undefined);

  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const service = response?.data?.find((item : { id: string }) => item.id === serviceId);

  const formik = useFormik<ServiceFormValues>({
    initialValues: {
      name: "",
      category: "",
      description: "",
      price: "",
      duration: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        const payload = {
          id: serviceId,
          name: values.name.trim(),
          category: values.category,
          description: values.description.trim(),
          price: Number(values.price),
          duration: values.duration,
        };

        await updateService(payload).unwrap();

        router.push("/provider/services");
      } catch (error) {
        console.error("Update service failed:", error);
      }
    },
  });

  useEffect(() => {
    if (service) {
      formik.setValues({
        name: service.name,
        category: service.category,
        description: service.description,
        price: String(service.price),
        duration: service.duration,
      });
    }
  }, [service]);

  if (isFetching) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary">
          <span className="visually-hidden">Loading...</span>
        </div>

        <p className="text-muted mt-3">Loading service...</p>
      </div>
    );
  }

  if (isFetchError || !service) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          Service not found or failed to load.
        </div>

        <Link href="/provider/services" className="btn btn-light border">
          <i className="bi bi-arrow-left me-1"></i>
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Link href="/provider/services" className="btn btn-light border me-3">
          <i className="bi bi-arrow-left"></i>
        </Link>

        <div>
          <h4 className="mb-1 fw-semibold">Edit Service</h4>

          <p className="text-muted mb-0">
            Update the information for your service.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            {/* Header */}
            <div className="card-header bg-white border-bottom py-3">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "42px",
                    height: "42px",
                  }}
                >
                  <i className="bi bi-pencil text-primary"></i>
                </div>

                <div>
                  <h5 className="mb-1 fw-semibold">Service Details</h5>

                  <p className="text-muted mb-0 small">
                    Update your service information.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card-body p-4">
              <form onSubmit={formik.handleSubmit}>
                {/* Row 1 */}
                <div className="row">
                  {/* Service Name */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Service Name</label>

                    <input
                      type="text"
                      name="name"
                      className={`form-control ${
                        formik.touched.name && formik.errors.name
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter service name"
                    />

                    {formik.touched.name && formik.errors.name && (
                      <div className="invalid-feedback">
                        {formik.errors.name}
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Category</label>

                    <select
                      name="category"
                      className={`form-select ${
                        formik.touched.category && formik.errors.category
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select category</option>

                      <option value="HOME_APPLIANCES">Home Appliances</option>

                      <option value="PLUMBING">Plumbing</option>

                      <option value="ELECTRICAL">Electrical</option>

                      <option value="CLEANING">Cleaning</option>

                      <option value="BEAUTY">Beauty</option>

                      <option value="AC_REPAIR">AC Repair</option>

                      <option value="OTHER">Other</option>
                    </select>

                    {formik.touched.category && formik.errors.category && (
                      <div className="invalid-feedback">
                        {formik.errors.category}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="row">
                  {/* Description */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Description</label>

                    <textarea
                      name="description"
                      rows={4}
                      className={`form-control ${
                        formik.touched.description && formik.errors.description
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Describe your service"
                    />

                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="invalid-feedback">
                          {formik.errors.description}
                        </div>
                      )}
                  </div>

                  {/* Price */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Price</label>

                    <div className="input-group">
                      <span className="input-group-text">₹</span>

                      <input
                        type="text"
                        name="price"
                        className={`form-control ${
                          formik.touched.price && formik.errors.price
                            ? "is-invalid"
                            : ""
                        }`}
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter price"
                      />

                      {formik.touched.price && formik.errors.price && (
                        <div className="invalid-feedback">
                          {formik.errors.price}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="row">
                  {/* Duration */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label">Duration</label>

                    <select
                      name="duration"
                      className={`form-select ${
                        formik.touched.duration && formik.errors.duration
                          ? "is-invalid"
                          : ""
                      }`}
                      value={formik.values.duration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select duration</option>

                      <option value="30 minutes">30 minutes</option>

                      <option value="1 hour">1 hour</option>

                      <option value="2 hours">2 hours</option>

                      <option value="3 hours">3 hours</option>

                      <option value="4 hours">4 hours</option>

                      <option value="Full Day">Full Day</option>
                    </select>

                    {formik.touched.duration && formik.errors.duration && (
                      <div className="invalid-feedback">
                        {formik.errors.duration}
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                  <Link
                    href="/provider/services"
                    className="btn btn-light border"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-1"></i>
                        Update Service
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditServicePage;
