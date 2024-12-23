import { Box } from "@mui/material";
import React, { useState } from "react";

const BrandingPage = () => {
  const [formData, setFormData] = useState({
    logos: [], // Array for multiple logos
    brandDescription: "",
    coverPhoto: null, // Single cover photo
    catalogues: [], // Array for multiple catalogs
    catalogReleaseDate: "",
    catalogTitle: "",
  });

  // Handle file upload (multiple files)
  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setFormData((prev) => ({
      ...prev,
      [field]: files,
    }));
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Render image previews (for logos and cover photo)
  const renderImagePreviews = (files) => {
    return files.map((file, index) => {
      // Only create object URL for image files
      if (file && file.type && file.type.startsWith("image")) {
        return (
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt={`preview-${index}`}
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
              marginLeft: "10px",
              marginBottom: "10px",
            }}
          />
        );
      } else {
        return null; // Skip non-image files
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Branding Data Submitted:", formData);
  };

  return (
    <div className="branding-page-form">
      <h2>Branding Page</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo Upload (Multiple) */}
        <div className="form-field">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <label>Digital Copies of Logo </label>
            <span style={{ fontSize: "12px" }}>
              (Please upload in .png, .jpeg, or .svg format)
            </span>
          </Box>
          <input
            type="file"
            accept=".png, .jpeg, .svg"
            onChange={(e) => handleFileChange(e, "logos")}
            multiple
          />
          <div>{renderImagePreviews(formData.logos)}</div>
        </div>

        {/* Brand Description */}
        <div className="form-field">
          <label>Brand Description</label>
          <textarea
            name="brandDescription"
            value={formData.brandDescription}
            onChange={handleInputChange}
            placeholder="Enter a brief brand description, around 50-150 words. Ensure it's consistent in style and tone with the brand’s voice."
            required
          />
        </div>

        {/* Cover Photo Upload */}
        <div className="form-field">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <label>Cover Photo</label>
            <span style={{ fontSize: "12px" }}>
              {" "}
              (Upload image with recommended dimensions of 1920x1080px or 16:9
              aspect ratio)
            </span>
          </Box>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={(e) => handleFileChange(e, "coverPhoto")}
            required
          />
          {formData.coverPhoto &&
            formData.coverPhoto[0] &&
            fileIsImage(formData.coverPhoto[0]) && (
              <img
                src={URL.createObjectURL(formData.coverPhoto[0])}
                alt="Cover Preview"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  marginTop: "10px",
                }}
              />
            )}
        </div>

        {/* Catalogues Upload (Multiple PDFs) */}
        <div className="form-field">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <label>Catalogues</label>
            <span style={{ fontSize: "12px" }}>
              (Upload multiple catalogs in PDF format)
            </span>
          </Box>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e, "catalogues")}
            multiple
          />
          <div>
            {formData.catalogues.map((file, index) => (
              <p key={index}>{file.name}</p>
            ))}
          </div>
        </div>

        {/* Catalog Release Date */}
        <div className="form-field">
          <label>Catalog Release Date</label>
          <input
            type="text"
            name="catalogReleaseDate"
            value={formData.catalogReleaseDate}
            onChange={handleInputChange}
            placeholder="For example: Spring/Summer 2024"
            required
          />
        </div>

        {/* Catalog Title */}
        <div className="form-field">
          <label>Catalog Title (if any)</label>
          <input
            type="text"
            name="catalogTitle"
            value={formData.catalogTitle}
            onChange={handleInputChange}
            placeholder="Enter the catalog title if any"
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

// Helper function to check if a file is an image
const fileIsImage = (file) => {
  return file && file.type && file.type.startsWith("image");
};

export default BrandingPage;
