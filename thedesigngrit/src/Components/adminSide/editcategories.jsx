import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateCategory = ({ categoryId, onBack }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    description: "",
    image: null,
    imagePreview: null,
  });
  const [newType, setNewType] = useState("");

  // Fetch the category data on mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/categories/categories/${categoryId}`
        );
        const fetchedCategory = response.data;
        setCategoryName(fetchedCategory.name);
        setCategoryDescription(fetchedCategory.description);
        setImagePreview(
          `http://localhost:5000/uploads/${fetchedCategory.image}`
        );
        setSubCategories(fetchedCategory.subCategories || []);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  // Handle main category image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle subcategory image upload
  const handleSubCategoryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSubCategory((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Add subcategory
  const handleAddSubCategory = () => {
    if (newSubCategory.name.trim()) {
      setSubCategories([...subCategories, { ...newSubCategory, types: [] }]);
      setNewSubCategory({
        name: "",
        description: "",
        image: null,
        imagePreview: null,
      });
    }
  };
  // Add type to a specific subcategory  // Add type to a specific subcategory
  const handleAddType = (subCategoryIndex) => {
    if (newType.trim() && subCategoryIndex !== null) {
      const updatedSubCategories = [...subCategories];
      updatedSubCategories[subCategoryIndex].types.push(newType);
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
 // Handle form submission
const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (!categoryName || !categoryDescription) {
    alert("Please fill all required fields!");
    return;
  }

  const formData = new FormData();
  formData.append("name", categoryName);
  formData.append("description", categoryDescription);
  if (categoryImage) {
    formData.append("image", categoryImage);
  }

  // Append subcategories
  subCategories.forEach((subCategory, index) => {
    const subCategoryData = {
      name: subCategory.name,
      description: subCategory.description || "",
      types: subCategory.types,
      _id: subCategory._id || undefined, // Keep existing subcategories, create new ones if missing _id
    };
    formData.append(`subCategories[${index}]`, JSON.stringify(subCategoryData));

    if (subCategory.image) {
      formData.append("subCategoryImages", subCategory.image); // Handles subcategory images
    }
  });

  try {
    const response = await fetch(
      `http://localhost:5000/api/categories/categories/${categoryId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const text = await response.text();
    console.log("Response Text:", text);

    try {
      const data = JSON.parse(text);
      if (response.ok) {
        alert("Category updated successfully!");
        onBack();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error parsing response: " + error.message);
    }
  } catch (error) {
    alert("Error updating category: " + error.message);
  }
};

  return (
    <div style={{ padding: "20px", fontFamily: "Montserrat" }}>
      <header className="dashboard-header-vendor">
        <h2>Update Category</h2>
        <button onClick={onBack}>Back to Categories</button>
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
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imagePreview && <img src={imagePreview} alt="Preview" width="200" />}
        </div>

        {/* Subcategories Section */}
        <div className="form-group">
          <label>Subcategories</label>
          {subCategories.map((subCategory, subIndex) => (
            <div key={subIndex} style={{ marginBottom: "10px" }}>
              <strong>{subCategory.name}</strong>
              <p>{subCategory.description}</p>
              <ul>
                {subCategory.types.map((type, typeIndex) => (
                  <li key={typeIndex}>
                    {type}
                    <button
                      type="button"
                      onClick={() => handleRemoveType(subIndex, typeIndex)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleRemoveSubCategory(subIndex)}
              >
                Remove Subcategory
              </button>
            </div>
          ))}
          <div>
            <h4>Add New Subcategory</h4>
            <input
              type="text"
              value={newSubCategory.name}
              onChange={(e) =>
                setNewSubCategory({ ...newSubCategory, name: e.target.value })
              }
              placeholder="Subcategory Name"
            />
            <textarea
              value={newSubCategory.description}
              onChange={(e) =>
                setNewSubCategory({
                  ...newSubCategory,
                  description: e.target.value,
                })
              }
              placeholder="Subcategory Description"
            ></textarea>
            <input
              type="file"
              accept="image/*"
              onChange={handleSubCategoryImageUpload}
            />
            {newSubCategory.imagePreview && (
              <img
                src={newSubCategory.imagePreview}
                alt="Preview"
                width="100"
              />
            )}
            <button type="button" onClick={handleAddSubCategory}>
              Add Subcategory
            </button>
          </div>
        </div>

        {/* Types Section */}
        <div className="form-group">
          <label>Add Type to Subcategory</label>
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Type Name"
          />
          <button
            type="button"
            onClick={() => handleAddType(subCategories.length - 1)}
          >
            Add Type
          </button>
        </div>

        <button type="submit" className="btn update">
          Update Category
        </button>
      </form>
    </div>
  );
};

export default UpdateCategory;
