import React, { useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import ApplicationSentPopup from "./JobDesc/applicationSentPopUp";

const PartnerApplicationForm = () => {
  const [formData, setFormData] = useState({
    CompanyName: "",
    email: "",
    phone: "",
    RequestorName: "",
    country: "",
    city: "",
    notes: "",
    images: [],
  });
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Control popup visibility

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

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <label>Company Nane</label>
            <input
              type="text"
              name="CompanyName"
              placeholder="Art House"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="job-form-field">
            <label>Requestor Name</label>
            <input
              type="text"
              name="RequestorName"
              placeholder="Karim wahba"
              value={formData.RequestorName}
              onChange={handleInputChange}
            />
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
              accept="image/*" // Restrict to images only
              multiple // Allow multiple uploads
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
              accept="image/*" // Restrict to images only
              multiple // Allow multiple uploads
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
          </div>
          <br></br>
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
