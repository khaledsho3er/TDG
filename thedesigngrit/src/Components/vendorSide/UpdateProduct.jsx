import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TiDeleteOutline } from "react-icons/ti";
import VendorPageLayout from "./VendorLayout";
const UpdateProductForm = () => {
  const location = useLocation();
  const { product } = location.state || {};

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brandName, setBrandName] = useState("");
  const [sku, setSku] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (product) {
      setProductName(product.name || "");
      setDescription(product.description || "");
      setCategory(product.type || "");
      setBrandName(product.brand || "");
      setSku(product.sku || "");
      setStockQuantity(product.stockQuantity || "");
      setRegularPrice(product.regularPrice || "");
      setSalePrice(product.salePrice || "");
      setTags(product.tags || []);
      setImages(product.thumbnailUrls || []);
      setMainImage(product.imageUrl || null);
    }
  }, [product]);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setTags([...tags, e.target.value.trim()]);
      e.target.value = ""; // Clear input
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    const imagePreviews = files.map((file) => URL.createObjectURL(file));

    if (images.length === 0 && imagePreviews.length > 0) {
      setMainImage(imagePreviews[0]); // Set the first image as the main image if none exists
    }

    setImages([...images, ...imagePreviews]); // Add to the images array
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);

    // If the removed image was the main image, update the main image
    if (images[index] === mainImage) {
      setMainImage(updatedImages[0] || null); // Set to the next image or null
    }

    setImages(updatedImages);
  };

  const handleSetMainImage = (index) => {
    setMainImage(images[index]);
  };

  const updateProduct = async (event) => {
    event.preventDefault();
    // Logic to update the product goes here
    // After update, navigate back to the product list page or any desired route
  };

  const deleteProduct = () => {
    // Logic to delete the product goes here
    // After deletion, navigate back to the product list page or any desired route
  };

  return (
    <VendorPageLayout>
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
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group half-width">
                  <label>SKU</label>
                  <input type="text" placeholder="Fox-3983" />
                </div>
                <div className="form-group half-width">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Regular Price</label>
                <input
                  type="text"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Sale Price</label>
                <input
                  type="text"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
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
                        <TiDeleteOutline size={18} />
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
                    style={{ display: "none" }}
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
                  {(images || []).map((image, index) => (
                    <div
                      className={`thumbnail ${
                        image === mainImage ? "main-thumbnail" : ""
                      }`}
                      key={index}
                    >
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
                <button className="btn save" onClick={updateProduct}>
                  Save Changes
                </button>
                <button className="btn delete" onClick={deleteProduct}>
                  DELETE
                </button>
                <button className="btn cancel">CANCEL</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </VendorPageLayout>
  );
};

export default UpdateProductForm;
