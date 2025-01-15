import React, { useState } from "react";
import { Link } from "react-router-dom";

const CategoryForm = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState("");
  const [newType, setNewType] = useState("");
  const [currentSubCategoryIndex, setCurrentSubCategoryIndex] = useState(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Add subcategory
  const handleAddSubCategory = () => {
    if (newSubCategory.trim()) {
      setSubCategories([...subCategories, { name: newSubCategory, types: [] }]);
      setNewSubCategory("");
    }
  };

  // Add type to a specific subcategory
  const handleAddType = () => {
    if (newType.trim() && currentSubCategoryIndex !== null) {
      const updatedSubCategories = [...subCategories];
      updatedSubCategories[currentSubCategoryIndex].types.push(newType);
      setSubCategories(updatedSubCategories);
      setNewType("");
    }
  };

  // Remove subcategory
  const handleRemoveSubCategory = (index) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
  };

  // Remove type from a subcategory
  const handleRemoveType = (subCategoryIndex, typeIndex) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[subCategoryIndex].types = updatedSubCategories[
      subCategoryIndex
    ].types.filter((_, i) => i !== typeIndex);
    setSubCategories(updatedSubCategories);
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !categoryDescription || !categoryImage) {
      alert("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("description", categoryDescription);
    formData.append("image", categoryImage);
    formData.append("subCategories", JSON.stringify(subCategories));

    try {
      const response = await fetch(
        "http://localhost:5000/api/categories/categories",
        {
          method: "POST",
          body: formData,
        }
      );

      const text = await response.text(); // Get the raw text
      console.log("Response Text:", text);

      try {
        const data = JSON.parse(text); // Manually parse the text as JSON

        if (response.ok) {
          alert("Category created successfully!");
          setCategoryName("");
          setCategoryDescription("");
          setCategoryImage(null);
          setImagePreview(null);
          setSubCategories([]);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error parsing response: " + error.message);
      }
    } catch (error) {
      alert("Error submitting category: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Montserrat" }}>
      <header className="dashboard-header-vendor">
        <h2>Create Category</h2>
        <p>
          <Link to="/adminpanel">Home</Link> &gt; Create Category
        </p>
      </header>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>
        <div className="form-group">
          <label>Category Description</label>
          <textarea
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            placeholder="Enter category description"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Category Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          {imagePreview && <img src={imagePreview} alt="Preview" width="200" />}
        </div>

        {/* Subcategories Section */}
        <div className="form-group">
          <label>Subcategories</label>
          {subCategories.map((subCategory, subIndex) => (
            <div key={subIndex} style={{ marginBottom: "10px" }}>
              <strong>{subCategory.name}</strong>
              <button
                type="button"
                onClick={() => handleRemoveSubCategory(subIndex)}
              >
                ×
              </button>
              <ul>
                {subCategory.types.map((type, typeIndex) => (
                  <li key={typeIndex}>
                    {type}
                    <button
                      type="button"
                      onClick={() => handleRemoveType(subIndex, typeIndex)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="Add type"
                value={currentSubCategoryIndex === subIndex ? newType : ""}
                onChange={(e) => {
                  setCurrentSubCategoryIndex(subIndex);
                  setNewType(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={handleAddType}
                disabled={currentSubCategoryIndex !== subIndex}
              >
                Add Type
              </button>
            </div>
          ))}
          <input
            type="text"
            placeholder="Add subcategory"
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
          />
          <button type="button" onClick={handleAddSubCategory}>
            Add Subcategory
          </button>
        </div>

        <button type="submit" className="btn update">
          Submit Category
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
