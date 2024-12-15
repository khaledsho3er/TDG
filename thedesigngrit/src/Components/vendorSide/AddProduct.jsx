import React, { useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";

const ProductForm = () => {
  const [tags, setTags] = useState(["Lorem", "Lorem", "Lorem"]); // Default tags
  const [images, setImages] = useState([]); // Uploaded images
  const [mainImage, setMainImage] = useState(null); // Main image placeholder

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
          <p>Home &gt; All Products</p>
        </div>
      </header>
      <form>
        <div className="product-form">
          <div className="form-left">
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" placeholder="Type name here" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Type Description here"></textarea>
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" placeholder="Type Category here" />
            </div>
            <div className="form-group">
              <label>Brand Name</label>
              <input type="text" placeholder="Type brand name here" />
            </div>
            <div className="form-row">
              <div className="form-group half-width">
                <label>SKU</label>
                <input type="text" placeholder="Fox-3983" />
              </div>
              <div className="form-group half-width">
                <label>Stock Quantity</label>
                <input type="number" placeholder="1258" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group half-width">
                <label>Regular Price</label>
                <input type="text" placeholder="LE 1000" />
              </div>
              <div className="form-group half-width">
                <label>Sale Price</label>
                <input type="text" placeholder="LE 450" />
              </div>
            </div>
            <div className="form-group">
              <label>Tag</label>
              <input
                type="text"
                placeholder="Add tag and press Enter"
                onKeyDown={handleAddTag}
                className="tag-input"
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
