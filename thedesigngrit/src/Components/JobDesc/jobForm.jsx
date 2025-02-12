import React, { useState } from "react";
import * as Yup from "yup";
import { IoMdCloudUpload } from "react-icons/io";
import ApplicationSentPopup from "./applicationSentPopUp";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  linkedIn: Yup.string().url("Invalid LinkedIn URL"),
  resume: Yup.mixed().required("Resume is required"),
});

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    city: "",
    linkedIn: "",
    notes: "",
    resume: null,
  });

  const [errors, setErrors] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files[0],
    }));
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) return;

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await fetch("https://tdg-db.onrender.com/api/jobforms", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to submit the form.");

      setIsPopupVisible(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        city: "",
        linkedIn: "",
        notes: "",
        resume: null,
      });
      setErrors({});
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="job-form-container">
      <div className="job-form-card">
        <h1 className="job-form-title">FILL THE FORM</h1>

        <form onSubmit={handleSubmit} className="Job-form">
          <div className="job-form-field">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Karim Ahmad"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            {errors.fullName && (
              <span className="error-message">{errors.fullName}</span>
            )}
          </div>

          <div className="job-form-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="karim@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="job-form-field">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="01022161614"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          <div className="job-form-field">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="New Cairo, Cairo, Egypt"
              value={formData.address}
              onChange={handleInputChange}
            />
            {errors.address && (
              <span className="error-message">{errors.address}</span>
            )}
          </div>

          <div className="job-form-row">
            <div className="job-form-field">
              <label>Country</label>
              <input
                type="text"
                name="country"
                placeholder="Egypt"
                value={formData.country}
                onChange={handleInputChange}
              />
              {errors.country && (
                <span className="error-message">{errors.country}</span>
              )}
            </div>
            <div className="job-form-field">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="Cairo"
                value={formData.city}
                onChange={handleInputChange}
              />
              {errors.city && (
                <span className="error-message">{errors.city}</span>
              )}
            </div>
          </div>

          <div className="job-form-field">
            <label>Upload Your Resume</label>
            <button
              type="button"
              className="job-upload-button"
              onClick={() => document.getElementById("resume-upload").click()}
            >
              <IoMdCloudUpload size={20} className="upload-icon" /> Upload
              Resume
            </button>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            {formData.resume && <p>Selected File: {formData.resume.name}</p>}
            {errors.resume && (
              <span className="error-message">{errors.resume}</span>
            )}
          </div>

          <div className="job-form-field">
            <label>LinkedIn Profile</label>
            <input
              type="url"
              name="linkedIn"
              placeholder="https://linkedin.com"
              value={formData.linkedIn}
              onChange={handleInputChange}
            />
            {errors.linkedIn && (
              <span className="error-message">{errors.linkedIn}</span>
            )}
          </div>

          <div className="job-form-field">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              placeholder="Add a Note..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <button type="submit" className="job-submit-button">
            Submit
          </button>
        </form>
      </div>
      <ApplicationSentPopup
        show={isPopupVisible}
        closePopup={() => setIsPopupVisible(false)}
      />
    </div>
  );
};

export default ApplicationForm;
