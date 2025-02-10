import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateCategory = ({ category, onBack }) => {
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

  useEffect(() => {
    if (!category || !category._id) {
      console.error("Category is undefined or missing _id:", category);
      return;
    }

    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/categories/categories/${category._id}`
        );
        const fetchedCategory = response.data;

        setCategoryName(fetchedCategory.name || "");
        setCategoryDescription(fetchedCategory.description || "");
        setImagePreview(
          fetchedCategory.image
            ? `http://localhost:5000/uploads/${fetchedCategory.image}`
            : null
        );

        // Ensure subCategories are set correctly
        setSubCategories(fetchedCategory.subCategories || []);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [category]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

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

  const handleAddType = (subCategoryIndex) => {
    if (newType.trim() && subCategoryIndex !== null) {
      const updatedSubCategories = [...subCategories];

      // Ensure types are stored by ID (or create new type objects if needed)
      updatedSubCategories[subCategoryIndex].types.push({ name: newType });

      setSubCategories(updatedSubCategories);
      setNewType("");
    }
  };

  const handleRemoveSubCategory = (index) => {
    setSubCategories(subCategories.filter((_, i) => i !== index));
  };

  const handleRemoveType = (subCategoryIndex, typeIndex) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[subCategoryIndex].types = updatedSubCategories[
      subCategoryIndex
    ].types.filter((_, i) => i !== typeIndex);
    setSubCategories(updatedSubCategories);
  };

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

    // Convert subCategories to JSON format
    const formattedSubCategories = subCategories.map((subCategory) => {
      return {
        _id: subCategory._id || undefined,
        name: subCategory.name,
        description: subCategory.description || "",
        types: subCategory.types.map((type) =>
          typeof type === "string"
            ? { name: type }
            : { _id: type._id || undefined, name: type.name }
        ),
      };
    });

    formData.append("subCategories", JSON.stringify(formattedSubCategories));

    // Append images separately for subcategories
    subCategories.forEach((subCategory) => {
      if (subCategory.image instanceof File) {
        formData.append("subCategoryImages", subCategory.image);
      }
    });

    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/categories/${category._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Category updated successfully!");
        onBack();
      } else {
        alert(data.message);
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

        <div className="form-group">
          <label>Subcategories</label>
          {subCategories.map((subCategory, subIndex) => (
            <div key={subIndex} style={{ marginBottom: "10px" }}>
              <strong>{subCategory.name}</strong>
              <p>{subCategory.description}</p>
              <ul>
                {subCategory.types.map((type, typeIndex) => (
                  <li key={typeIndex}>
                    {type.name} {/* Ensure we access "name" property */}
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
