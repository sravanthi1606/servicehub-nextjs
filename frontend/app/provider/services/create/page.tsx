"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useCreateServiceMutation } from "@/app/redux/services/serviceApi";

interface CreateServiceFormValues {
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

const CreateServicePage = () => {
  const router = useRouter();

  const [createService, { isLoading }] = useCreateServiceMutation();

  const formik = useFormik<CreateServiceFormValues>({
    initialValues: {
      name: "",
      category: "",
      description: "",
      price: "",
      duration: "",
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          name: values.name.trim(),
          category: values.category,
          description: values.description.trim(),
          price: Number(values.price),
          duration: values.duration,
        };

        const response = await createService(payload).unwrap();

        console.log("Service created successfully:", response);

        resetForm();

        router.push("/provider/services");
      } catch (error) {
        console.error("Create service failed:", error);
      }
    },
  });

  return (
    <div className="container-fluid py-4">
      {/* Page Header */}
      <div className="d-flex align-items-center mb-4">
        <Link href="/provider/services" className="btn btn-light border me-3">
          <i className="bi bi-arrow-left"></i>
        </Link>

        <div>
          <h4 className="mb-1 fw-semibold">Create Service</h4>

          <p className="text-muted mb-0">
            Add a new service that customers can book.
          </p>
        </div>
      </div>

      {/* Full Width Card */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            {/* Card Header */}
            <div className="card-header bg-white border-bottom py-3">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "42px",
                    height: "42px",
                  }}
                >
                  <i className="bi bi-plus-lg text-primary"></i>
                </div>

                <div>
                  <h5 className="mb-1 fw-semibold">Service Details</h5>

                  <p className="text-muted mb-0 small">
                    Enter the information for your new service.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card-body p-4">
              <form onSubmit={formik.handleSubmit}>
                {/* Row 1 - Service Name + Category */}
                <div className="row">
                  {/* Service Name */}
                  <div className="col-md-6 mb-4">
                    <label htmlFor="name" className="form-label fw-medium">
                      Service Name
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
                      placeholder="e.g. AC Repair"
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

                  {/* Category */}
                  <div className="col-md-6 mb-4">
                    <label htmlFor="category" className="form-label fw-medium">
                      Category
                    </label>

                    <select
                      id="category"
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

                      <option value="CLEANING">Cleaning</option>

                      <option value="PLUMBING">Plumbing</option>

                      <option value="ELECTRICAL">Electrical</option>

                      <option value="BEAUTY">Beauty</option>

                      <option value="REPAIR">Repair</option>
                    </select>

                    {formik.touched.category && formik.errors.category && (
                      <div className="invalid-feedback">
                        {formik.errors.category}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2 - Description + Price */}
                <div className="row">
                  {/* Description */}
                  <div className="col-md-6 mb-4">
                    <label
                      htmlFor="description"
                      className="form-label fw-medium"
                    >
                      Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className={`form-control ${
                        formik.touched.description && formik.errors.description
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Describe the service..."
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                    <label htmlFor="price" className="form-label fw-medium">
                      Price
                    </label>

                    <div className="input-group">
                      <span className="input-group-text">₹</span>

                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        className={`form-control ${
                          formik.touched.price && formik.errors.price
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="500"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    {formik.touched.price && formik.errors.price && (
                      <div className="text-danger small mt-1">
                        {formik.errors.price}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3 - Duration + Empty Space */}
                <div className="row">
                  {/* Duration */}
                  <div className="col-md-6 mb-4">
                    <label htmlFor="duration" className="form-label fw-medium">
                      Duration
                    </label>

                    <select
                      id="duration"
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-lg me-1"></i>
                        Create Service
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

export default CreateServicePage;
