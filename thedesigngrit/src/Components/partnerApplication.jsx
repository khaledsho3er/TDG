import React, { useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import ApplicationSentPopup from "./JobDesc/applicationSentPopUp";
import * as Yup from "yup"; // Import Yup for validation

const PartnerApplicationForm = () => {
  const [formData, setFormData] = useState({
    CompanyName: "",
    email: "",
    phone: "",
    taxNumber: "",
    commercialRegisterNumber: "",
    RequestorName: "",
    country: "",
    city: "",
    notes: "",
    images: [],
  });

  const [isPopupVisible, setIsPopupVisible] = useState(false); // Control popup visibility
  const [errors, setErrors] = useState({}); // Store error messages

  // Validation schema using Yup
  const validationSchema = Yup.object({
    CompanyName: Yup.string().required("Company Name is required."),
    email: Yup.string()
      .email("Invalid email address.")
      .required("Email is required."),
    phone: Yup.string().required("Phone number is required."),
    taxNumber: Yup.string().required("Tax number is required."),
    commercialRegisterNumber: Yup.string().required(
      "Commercial register number is required."
    ),
    RequestorName: Yup.string().required("Requestor name is required."),
    country: Yup.string().required("Country is required."),
    city: Yup.string().required("City is required."),
    notes: Yup.string(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const imagePreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file), // Generate local URL for preview
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imagePreviews], // Append new images
    }));
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      return true; // Validation passed
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors); // Set error messages
      return false; // Validation failed
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateForm(); // Validate the form
    if (!isValid) return; // Stop submission if validation fails

    console.log(formData);
    setIsPopupVisible(true); // Show popup on form submission
  };

  const closePopup = () => {
    setIsPopupVisible(false); // Close the popup
  };

  return (
    <div className="job-form-container">
      <div className="job-form-card">
        <h1 className="job-form-title">FILL THE FORM</h1>

        <form onSubmit={handleSubmit} className="Job-form">
          <div className="job-form-field">
            <label>Company Name</label>
            <input
              type="text"
              name="CompanyName"
              placeholder="Art House"
              value={formData.CompanyName}
              onChange={handleInputChange}
            />
            {errors.CompanyName && (
              <p className="error-message">{errors.CompanyName}</p>
            )}
          </div>

          <div className="job-form-field">
            <label>Requestor Name</label>
            <input
              type="text"
              name="RequestorName"
              placeholder="Karim Wahba"
              value={formData.RequestorName}
              onChange={handleInputChange}
            />
            {errors.RequestorName && (
              <p className="error-message">{errors.RequestorName}</p>
            )}
          </div>

          <div className="job-form-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="karim@arthouse.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
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
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>

          <div className="job-form-field">
            <label>Tax Number</label>
            <input
              type="tel"
              name="taxNumber"
              placeholder="XXX-XXX-XXX"
              value={formData.taxNumber}
              onChange={handleInputChange}
            />
            {errors.taxNumber && (
              <p className="error-message">{errors.taxNumber}</p>
            )}
          </div>

          <div className="job-form-field">
            <label>Commercial Register Number</label>
            <input
              type="tel"
              name="commercialRegisterNumber"
              placeholder="XXX-XXX-XXX"
              value={formData.commercialRegisterNumber}
              onChange={handleInputChange}
            />
            {errors.commercialRegisterNumber && (
              <p className="error-message">{errors.commercialRegisterNumber}</p>
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
                <p className="error-message">{errors.country}</p>
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
              {errors.city && <p className="error-message">{errors.city}</p>}
            </div>
          </div>

          <div className="job-form-field">
            <label>Upload Document</label>
            <button
              type="button"
              className="job-upload-button"
              onClick={() => document.getElementById("image-upload").click()}
            >
              <IoMdCloudUpload size={20} className="upload-icon" />
              Upload Document
            </button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <div className="image-preview-container">
              {formData.images.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image.url} alt={image.name} />
                  <p>{image.name}</p>
                </div>
              ))}
            </div>
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
            {errors.notes && <p className="error-message">{errors.notes}</p>}
          </div>

          <button type="submit" className="job-submit-button">
            Submit
          </button>
        </form>
      </div>
      <ApplicationSentPopup show={isPopupVisible} closePopup={closePopup} />
    </div>
  );
};

export default PartnerApplicationForm;
