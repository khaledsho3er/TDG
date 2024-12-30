import React, { useState } from "react";
import { Link } from "react-router-dom";

const CategoryForm = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For previewing the uploaded image

  // Handle category image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCategoryImage(file);
      setImagePreview(imageUrl); // Set image preview
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !categoryDescription || !categoryImage) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("description", categoryDescription);
    formData.append("image", categoryImage); // Appending the image file

    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Category created successfully!");
        // Clear the form after submission
        setCategoryName("");
        setCategoryDescription("");
        setCategoryImage(null);
        setImagePreview(null);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Error creating category: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Montserrat" }}>
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Create Category</h2>
          <p>
            <Link to="/adminpanel">Home</Link> &gt; Create Category
          </p>
        </div>
      </header>
      <form onSubmit={handleFormSubmit}>
        <div className="category-form">
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              placeholder="Type category name here"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Category Description</label>
            <textarea
              placeholder="Describe the category"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Category Image</label>
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageUpload}
              required
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Category Preview" width="200" />
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn update">
              ADD Category
            </button>
            <button type="button" className="btn cancel">
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
