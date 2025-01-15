import { Box, TextField, Button, InputLabel } from "@mui/material";
import React, { useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { Link } from "react-router-dom";

const ProductForm = () => {
  const [tags, setTags] = useState(["Lorem", "Lorem", "Lorem"]); // Default tags
  const [images, setImages] = useState([]); // Uploaded images
  const [mainImage, setMainImage] = useState(null); // Main image placeholder
  const [warrantyDuration, setWarrantyDuration] = useState("");
  const [claimProcess, setClaimProcess] = useState("");
  const [materialCareInstructions, setMaterialCareInstructions] = useState("");
  const [productSpecificRecommendations, setProductSpecificRecommendations] =
    useState("");
  const [bimCadFileName, setBimCadFileName] = useState("");
  // Customization state
  const [customization, setCustomization] = useState({
    customizationTypes: [],
    otherCustomization: "",
    additionalDetails: "",
    additionalCosts: "",
    costBreakdown: "",
    leadTime: "",
  });

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setCustomization((prev) => ({
      ...prev,
      customizationTypes: checked
        ? [...prev.customizationTypes, value]
        : prev.customizationTypes.filter((type) => type !== value),
    }));
  };

  // Handle input changes for customization fields
  const handleCustomizationChange = (e) => {
    const { name, value } = e.target;
    setCustomization((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding new tags
  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setTags([...tags, e.target.value.trim()]);
      e.target.value = ""; // Clear input
    }
  };
  // Function to remove a tag by index
  const handleRemoveTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    const imagePreviews = files.map((file) => URL.createObjectURL(file));

    if (images.length === 0 && imagePreviews.length > 0) {
      setMainImage(imagePreviews[0]); // Set the first image as the main image if none exists
    }

    setImages([...images, ...imagePreviews]); // Add to the images array
  };

  // Handle removing an image
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);

    // If the removed image was the main image, update the main image
    if (images[index] === mainImage) {
      setMainImage(updatedImages[0] || null); // Set to the next image or null
    }

    setImages(updatedImages);
  };
  // Set an image as the main image
  const handleSetMainImage = (index) => {
    setMainImage(images[index]);
  };
  return (
    <div style={{ padding: "20px", fontFamily: "Montserrat" }}>
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>All Products</h2>
          <p>
            <Link to="/vendorpanel">Home</Link> &gt; All Products
          </p>
        </div>
      </header>
      <form>
        <div className="product-form">
          <div className="form-left">
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" placeholder="Type name here" required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Provide a detailed product description of 20-50 words. Include unique selling points, features, and benefits."
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Technical Specifications / Dimensions</label>
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <input type="text" placeholder="Length (cm)" required />
                <input type="text" placeholder="Width (cm)" required />
                <input type="text" placeholder="Height (cm)" required />
                <input type="text" placeholder="Weight (cm)" required />
              </Box>
            </div>
            <div className="form-row">
              <div className="form-group half-width">
                <label>Category</label>
                <input type="text" placeholder="Type Category here" required />
              </div>
              <div className="form-group half-width">
                <label>Sub Category</label>
                <input
                  type="text"
                  placeholder="Type Sub-Category here"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Brand Name</label>
              <input type="text" placeholder="Type brand name here" required />
            </div>
            <div className="form-group">
              <label>Lead Time</label>
              <input
                type="text"
                placeholder="Guaranteed lead time for delivery in days or weeks from the time of order placement."
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group half-width">
                <label>SKU</label>
                <input type="text" placeholder="Fox-3983" required />
              </div>
              <div className="form-group half-width">
                <label>Stock Quantity</label>
                <input type="number" placeholder="1258" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group half-width">
                <label>Regular Price</label>
                <input type="text" placeholder="LE 1000" required />
              </div>
              <div className="form-group half-width">
                <label>Sale Price</label>
                <input type="text" placeholder="LE 450" required />
              </div>
            </div>
            <div className="form-group">
              <label>Tag</label>
              <input
                type="text"
                placeholder="Add tag and press Enter"
                onKeyDown={handleAddTag}
                className="tag-input"
                required
              />
              <br />
              <div className="tags">
                {tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="remove-tag-btn"
                    >
                      <TiDeleteOutline size={18} /> {/* TiDeleteOutline icon */}
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>BIM/CAD File Upload</label>
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="file"
                  accept=".dwg,.dxf,.ifc,.rvt"
                  id="bimCadFile"
                  style={{ display: "none" }} // Hide the input visually
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setBimCadFileName(file.name);
                  }}
                />
                <label htmlFor="bimCadFile">
                  <Button
                    component="span"
                    style={{
                      marginTop: "1rem",
                      backgroundColor: "#6e7e5f",
                      color: "white",
                      padding: "0.5rem 1.5rem",
                      fontSize: "1rem",
                      textAlign: "center",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "5px",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    Upload File
                  </Button>
                </label>
                {bimCadFileName && <span>{bimCadFileName}</span>}
              </Box>
            </div>

            <div className="form-group">
              <label>Customization Options</label>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Box className="color-options-checkbox">
                  <label>Color Options</label>
                  <input
                    type="checkbox"
                    value="Color Options"
                    onChange={handleCheckboxChange}
                  />
                </Box>
                <Box className="color-options-checkbox">
                  <label>Size Options</label>
                  <input
                    type="checkbox"
                    value="Size Options"
                    onChange={handleCheckboxChange}
                  />
                </Box>
                <Box className="color-options-checkbox">
                  <label>Fabric/Material Options</label>
                  <input
                    type="checkbox"
                    value="Fabric/Material Options"
                    onChange={handleCheckboxChange}
                  />
                </Box>
                <Box className="color-options-checkbox">
                  <label>Finish Options</label>
                  <input
                    type="checkbox"
                    value="Finish Options"
                    onChange={handleCheckboxChange}
                  />
                </Box>
                <Box className="color-options-checkbox">
                  <label>
                    Engraving
                    <br />
                    /Personalization
                  </label>
                  <input
                    type="checkbox"
                    value="Engraving/Personalization"
                    onChange={handleCheckboxChange}
                  />
                </Box>
                <Box className="color-options-checkbox">
                  <label>Other</label>
                  <input
                    type="checkbox"
                    value="Other"
                    onChange={handleCheckboxChange}
                  />
                </Box>
              </div>
              {customization.customizationTypes.includes("Other") && (
                <input
                  type="text"
                  name="otherCustomization"
                  value={customization.otherCustomization}
                  onChange={handleCustomizationChange}
                  placeholder="Specify other customization options"
                />
              )}
            </div>

            <div className="form-group">
              <label>Additional Details</label>
              <textarea
                name="additionalDetails"
                value={customization.additionalDetails}
                onChange={handleCustomizationChange}
                placeholder="Provide further customization details..."
                required
              />
            </div>

            <div className="form-group">
              <label>Additional Costs</label>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Box className="color-options-checkbox">
                  <label>Yes, additional cost applies</label>
                  <input
                    type="radio"
                    name="additionalCosts"
                    value="Yes"
                    onChange={handleCustomizationChange}
                  />
                </Box>
                <Box className="color-options-checkbox">
                  <label>No additional cost</label>
                  <input
                    type="radio"
                    name="additionalCosts"
                    value="No"
                    onChange={handleCustomizationChange}
                  />
                </Box>
                <Box className="color-options-checkbox">
                  <label>Variable (please specify)</label>

                  <input
                    type="radio"
                    name="additionalCosts"
                    value="Variable"
                    onChange={handleCustomizationChange}
                  />
                </Box>
              </div>
              {customization.additionalCosts === "Variable" && (
                <textarea
                  name="costBreakdown"
                  value={customization.costBreakdown}
                  onChange={handleCustomizationChange}
                  placeholder="Specify cost breakdown"
                />
              )}
            </div>

            <div className="form-group">
              <label>Estimated Lead Time</label>
              <textarea
                name="leadTime"
                value={customization.leadTime}
                onChange={handleCustomizationChange}
                placeholder="Enter estimated lead time for custom orders"
                required
              />
            </div>
            <div className="form-group">
              <label>Warranty Information</label>

              {/* Warranty Duration */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <label style={{ marginBottom: "5px", fontWeight: "normal" }}>
                  Warranty Duration
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    backgroundColor: "#f9f9f9",
                    color: "#333",
                  }}
                  value={warrantyDuration}
                  onChange={(e) => setWarrantyDuration(e.target.value)}
                >
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="Lifetime">Lifetime</option>
                  <option value="Other">Other</option>
                </select>
              </Box>

              {/* Warranty Coverage */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <label>Warranty Coverage</label>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "5px" }}
                >
                  <Box className="color-options-checkbox">
                    <label>Manufacturer Defects</label>
                    <input type="checkbox" value="Manufacturer Defects" />
                  </Box>
                  <Box className="color-options-checkbox">
                    <label>Wear and Tear</label>
                    <input type="checkbox" value="Wear and Tear" />
                  </Box>
                  <Box className="color-options-checkbox">
                    <label>Damage During Shipping</label>
                    <input type="checkbox" value="Damage During Shipping" />
                  </Box>
                </Box>
              </Box>

              {/* Claim Process */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <label>Claim Process</label>
                <TextField
                  multiline
                  rows={2}
                  fullWidth
                  value={claimProcess}
                  onChange={(e) => setClaimProcess(e.target.value)}
                  placeholder="Steps on how a customer can claim the warranty, required documentation, etc."
                  required
                />
              </Box>
            </div>
            <Box sx={{ marginBottom: "20px" }}>
              <h3>Product Care Instructions</h3>

              <Box sx={{ marginBottom: "10px" }}>
                <InputLabel>Material Care Instructions</InputLabel>
                <TextField
                  multiline
                  rows={2}
                  fullWidth
                  value={materialCareInstructions}
                  onChange={(e) => setMaterialCareInstructions(e.target.value)}
                  placeholder="General care instructions for fabric, wood, metal, etc."
                  required
                />
              </Box>

              <Box sx={{ marginBottom: "10px" }}>
                <InputLabel>Product-Specific Recommendations</InputLabel>
                <TextField
                  multiline
                  rows={2}
                  fullWidth
                  value={productSpecificRecommendations}
                  onChange={(e) =>
                    setProductSpecificRecommendations(e.target.value)
                  }
                  placeholder="Any additional care recommendations."
                  required
                />
              </Box>
            </Box>
          </div>
          <div className="form-right">
            <div className="image-placeholder">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Main Preview"
                  className="main-image"
                />
              ) : (
                <p>Image Preview</p>
              )}
            </div>
            <div className="product-gallery">
              <label>Product Gallery</label>

              <div
                className="drop-zone"
                onDragOver={(e) => e.preventDefault()} // Prevent default to allow drop
                onDrop={(e) => {
                  e.preventDefault(); // Prevent default behavior
                  const files = Array.from(e.dataTransfer.files); // Access dropped files
                  handleImageUpload({ target: { files } }); // Pass to handleImageUpload
                }}
              >
                <span>
                  <strong>
                    (Upload high-quality images with a minimum resolution of
                    1080x1080px. Use .jpeg or .png format. Ensure clear
                    visibility of the product from multiple angles. White
                    background)
                  </strong>
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg, image/png"
                  onChange={handleImageUpload}
                  className="file-input"
                  style={{ display: "none" }} // Hide the input visually
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="drop-zone-label">
                  Drop your image here, or browse
                  <br />
                  Jpeg, png are allowed
                </label>
                <button
                  type="button"
                  onClick={() => document.getElementById("fileInput").click()}
                  className="upload-btn"
                >
                  Upload Images
                </button>
              </div>
              <div className="thumbnail-list">
                {images.map((image, index) => (
                  <div
                    className={`thumbnail ${
                      image === mainImage ? "main-thumbnail" : ""
                    }`}
                    key={index}
                  >
                    {" "}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index}`}
                        className="image-thumbnail"
                        onClick={() => handleSetMainImage(index)}
                      />
                      <span>Product thumbnail.png</span>
                      <span className="checkmark">
                        {image === mainImage ? "✔ Main" : "✔"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <span
                        className="remove-thumbnail"
                        onClick={() => handleRemoveImage(index)}
                      >
                        ✖
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button className="btn update">ADD</button>
              <button className="btn delete">DELETE</button>
              <button className="btn cancel">CANCEL</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
