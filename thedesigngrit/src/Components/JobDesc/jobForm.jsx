import React, { useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import ApplicationSentPopup from "./applicationSentPopUp";

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
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Control popup visibility
  const [error, setError] = useState(""); // Handle error messages

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Validate that a resume is uploaded
    if (!formData.resume) {
      setError("Please upload your resume.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("linkedIn", formData.linkedIn);
    formDataToSend.append("notes", formData.notes);
    formDataToSend.append("resume", formData.resume);

    try {
      const response = await fetch("http://localhost:5000/api/jobforms", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form. Please try again.");
      }

      // Handle success
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
    } catch (error) {
      setError(error.message || "An unexpected error occurred.");
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false); // Close the popup
  };

  return (
    <div className="job-form-container">
      <div className="job-form-card">
        <h1 className="job-form-title">FILL THE FORM</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="Job-form">
          <div className="job-form-field">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Karim Ahmad"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="job-form-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="karim@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="job-form-field">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="01022161614"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="job-form-field">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="New Cairo, Cairo, Egypt"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
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
                required
              />
            </div>
            <div className="job-form-field">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="Cairo"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="job-form-field">
            <label>Upload Your Resume</label>
            <button
              type="button"
              className="job-upload-button"
              onClick={() => document.getElementById("resume-upload").click()}
            >
              <IoMdCloudUpload size={20} className="upload-icon" />
              Upload Resume
            </button>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              required
            />
            {formData.resume && (
              <p style={{ marginTop: "8px", fontFamily: "Montserrat" }}>
                Selected File: {formData.resume.name}
              </p>
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
      <ApplicationSentPopup show={isPopupVisible} closePopup={closePopup} />
    </div>
  );
};

export default ApplicationForm;
