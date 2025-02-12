import React, { useState } from "react";

const BrandForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    brandName: "",
    commercialRegisterNo: "",
    taxNumber: "",
    companyAddress: "",
    phoneNumber: "",
    email: "",
    bankAccountNumber: "",
    websiteURL: "",
    instagramURL: "",
    facebookURL: "",
    tiktokURL: "",
    linkedinURL: "",
    shippingPolicy: "",
    brandDescription: "",
    fees: "",
    status: "pending",
    brandlogo: null,
    digitalCopiesLogo: [],
    coverPhoto: null,
    catalogues: [],
    documents: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle text input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle single file input change
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [fieldName]: file });
    }
  };

  // Handle multiple file input change
  const handleMultipleFilesChange = (e, fieldName) => {
    const files = Array.from(e.target.files);
    if (files) {
      setFormData({ ...formData, [fieldName]: files });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Create FormData object
    const formDataToSend = new FormData();

    // Append text fields
    for (const key in formData) {
      if (
        key !== "brandlogo" &&
        key !== "digitalCopiesLogo" &&
        key !== "coverPhoto" &&
        key !== "catalogues" &&
        key !== "documents"
      ) {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Append single files
    if (formData.brandlogo)
      formDataToSend.append("brandlogo", formData.brandlogo);
    if (formData.coverPhoto)
      formDataToSend.append("coverPhoto", formData.coverPhoto);

    // Append multiple files
    if (formData.digitalCopiesLogo.length > 0) {
      formData.digitalCopiesLogo.forEach((file, index) => {
        formDataToSend.append(`digitalCopiesLogo`, file);
      });
    }
    if (formData.catalogues.length > 0) {
      formData.catalogues.forEach((file, index) => {
        formDataToSend.append(`catalogues`, file);
      });
    }
    if (formData.documents.length > 0) {
      formData.documents.forEach((file, index) => {
        formDataToSend.append(`documents`, file);
      });
    }

    try {
      // Send POST request to backend
      const response = await fetch(
        "https://tdg-db.onrender.com/api/brand/brand",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setMessage("Brand created successfully!");
        console.log("Server response:", result);
      } else {
        throw new Error("Failed to upload files");
      }
    } catch (error) {
      setMessage("Error uploading files: " + error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Brand Upload Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Text Inputs */}
        <div>
          <label htmlFor="brandName">Brand Name:</label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={formData.brandName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="commercialRegisterNo">Commercial Register No:</label>
          <input
            type="text"
            id="commercialRegisterNo"
            name="commercialRegisterNo"
            value={formData.commercialRegisterNo}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="taxNumber">Tax Number:</label>
          <input
            type="text"
            id="taxNumber"
            name="taxNumber"
            value={formData.taxNumber}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="companyAddress">Company Address:</label>
          <input
            type="text"
            id="companyAddress"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="bankAccountNumber">Bank Account Number:</label>
          <input
            type="text"
            id="bankAccountNumber"
            name="bankAccountNumber"
            value={formData.bankAccountNumber}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="websiteURL">Website URL:</label>
          <input
            type="url"
            id="websiteURL"
            name="websiteURL"
            value={formData.websiteURL}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="instagramURL">Instagram URL:</label>
          <input
            type="url"
            id="instagramURL"
            name="instagramURL"
            value={formData.instagramURL}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="facebookURL">Facebook URL:</label>
          <input
            type="url"
            id="facebookURL"
            name="facebookURL"
            value={formData.facebookURL}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="tiktokURL">TikTok URL:</label>
          <input
            type="url"
            id="tiktokURL"
            name="tiktokURL"
            value={formData.tiktokURL}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="linkedinURL">LinkedIn URL:</label>
          <input
            type="url"
            id="linkedinURL"
            name="linkedinURL"
            value={formData.linkedinURL}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="shippingPolicy">Shipping Policy:</label>
          <textarea
            id="shippingPolicy"
            name="shippingPolicy"
            value={formData.shippingPolicy}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="brandDescription">Brand Description:</label>
          <textarea
            id="brandDescription"
            name="brandDescription"
            value={formData.brandDescription}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="fees">Fees:</label>
          <input
            type="number"
            id="fees"
            name="fees"
            value={formData.fees}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="deactivate">Deactivate</option>
          </select>
        </div>

        {/* File Inputs */}
        <div>
          <label htmlFor="brandlogo">Brand Logo:</label>
          <input
            type="file"
            id="brandlogo"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "brandlogo")}
            required
          />
        </div>

        <div>
          <label htmlFor="digitalCopiesLogo">Digital Copies Logo:</label>
          <input
            type="file"
            id="digitalCopiesLogo"
            accept="image/*"
            multiple
            onChange={(e) => handleMultipleFilesChange(e, "digitalCopiesLogo")}
          />
        </div>

        <div>
          <label htmlFor="coverPhoto">Cover Photo:</label>
          <input
            type="file"
            id="coverPhoto"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "coverPhoto")}
          />
        </div>

        <div>
          <label htmlFor="catalogues">Catalogues:</label>
          <input
            type="file"
            id="catalogues"
            accept="application/pdf"
            multiple
            onChange={(e) => handleMultipleFilesChange(e, "catalogues")}
          />
        </div>

        <div>
          <label htmlFor="documents">Documents:</label>
          <input
            type="file"
            id="documents"
            accept="application/pdf"
            multiple
            onChange={(e) => handleMultipleFilesChange(e, "documents")}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Submit"}
        </button>
      </form>

      {/* Display message */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default BrandForm;
