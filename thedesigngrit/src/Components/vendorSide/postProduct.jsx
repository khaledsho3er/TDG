import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiDeleteOutline } from "react-icons/ti"; // Import the delete icon

const AddProduct = () => {
  // State variables
  const [categories, setCategories] = useState([]); // Categories from API
  const [subCategories, setSubCategories] = useState([]); // Subcategories from API
  const [types, setTypes] = useState([]); // Types from API
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
  const [selectedSubCategory, setSelectedSubCategory] = useState(""); // Selected subcategory
  const [tags, setTags] = useState([]); // Tags array
  const [customizationOptions, setCustomizationOptions] = useState([]); // Customization options
  const [otherCustomization, setOtherCustomization] = useState(""); // Other customization details
  const [additionalCosts, setAdditionalCosts] = useState(""); // Additional costs selection
  const [costBreakdown, setCostBreakdown] = useState(""); // Cost breakdown for variable option

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    salePrice: "",
    category: "",
    subcategory: "",
    manufacturer: "",
    collection: "",
    type: "",
    manufactureYear: "",
    tags: [], // Tags array in formData
    reviews: [], // Initialize reviews as an empty array
    colors: [],
    sizes: [],
    images: [],
    mainImage: "",
    description: "",
    technicalDimensions: {
      length: "",
      width: "",
      height: "",
      weight: "",
    },
    brandId: "",
    brandName: "",
    leadTime: "",
    stock: "",
    sku: "",
    warrantyInfo: {
      warrantyYears: "",
      warrantyCoverage: [],
    },
    materialCareInstructions: "",
    productSpecificRecommendations: "",
    Estimatedtimeleadforcustomization: "",
    Customizationoptions: [], // Customization options in formData
    Additionaldetails: "",
    Additionalcosts: "",
    claimProcess: "",
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories/categories"
        );
        setCategories(response.data); // Assuming the response contains categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle category change
  // Handle category change
  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    setFormData({
      ...formData,
      category: selectedCategoryId, // Update formData.category
    });

    setSubCategories([]); // Reset subcategories
    setSelectedSubCategory(""); // Reset subcategory

    try {
      // Fetch subcategories for the selected category
      const response = await axios.get(
        `http://localhost:5000/api/subcategories/byCategory/${selectedCategoryId}`
      );
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Handle subcategory change
  const handleSubCategoryChange = async (e) => {
    const selectedSubCategoryId = e.target.value;
    setSelectedSubCategory(selectedSubCategoryId);
    setFormData({
      ...formData,
      subcategory: selectedSubCategoryId, // Update formData.subcategory
    });

    setTypes([]); // Reset types

    try {
      // Fetch types that are associated with the selected subcategory
      const response = await axios.get(
        `http://localhost:5000/api/subcategories/bySubcategory/${selectedSubCategoryId}`
      );
      setTypes(response.data); // Set types based on the fetched data
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };
  // Handle input change for basic fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle nested input change
  const handleNestedChange = (e, parentField) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [parentField]: {
        ...formData[parentField],
        [name]: value,
      },
    });
  };

  // Handle array fields (tags, colors, sizes, warrantyCoverage)
  const handleArrayChange = (e, field, parentField = null) => {
    const { value } = e.target;

    if (parentField) {
      // Handle nested fields (e.g., warrantyInfo.warrantyCoverage)
      setFormData({
        ...formData,
        [parentField]: {
          ...formData[parentField],
          [field]: value.split(",").map((item) => item.trim()),
        },
      });
    } else {
      // Handle top-level fields (e.g., tags, colors, sizes)
      setFormData({
        ...formData,
        [field]: value.split(",").map((item) => item.trim()),
      });
    }
  };

  // Handle adding new tags
  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newTag = e.target.value.trim();
      setTags([...tags, newTag]); // Update local tags state
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag], // Update formData tags
      });
      e.target.value = ""; // Clear input
    }
  };

  // Function to remove a tag by index
  const handleRemoveTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags); // Update local tags state
    setFormData({
      ...formData,
      tags: newTags, // Update formData tags
    });
  };

  // Handle customization options change
  const handleCustomizationChange = (e) => {
    const { value, checked } = e.target;
    let updatedOptions = [...customizationOptions];

    if (checked) {
      updatedOptions.push(value); // Add option if checked
    } else {
      updatedOptions = updatedOptions.filter((option) => option !== value); // Remove option if unchecked
    }

    setCustomizationOptions(updatedOptions);
    setFormData({
      ...formData,
      Customizationoptions: updatedOptions, // Update formData
    });
  };

  // Handle other customization details
  const handleOtherCustomizationChange = (e) => {
    const { value } = e.target;
    setOtherCustomization(value);
    setFormData({
      ...formData,
      Additionaldetails: value, // Update formData
    });
  };

  // Handle additional costs selection
  const handleAdditionalCostsChange = (e) => {
    const { value } = e.target;
    setAdditionalCosts(value);
    setFormData({
      ...formData,
      Additionalcosts: value, // Update formData
    });
  };

  // Handle cost breakdown for variable option
  const handleCostBreakdownChange = (e) => {
    const { value } = e.target;
    setCostBreakdown(value);
    setFormData({
      ...formData,
      Additionaldetails: value, // Update formData
    });
  };
  const [images, setImages] = useState([]); // Array of uploaded images
  const [mainImage, setMainImage] = useState(null); // Main image

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array

    // Create image previews
    const imagePreviews = files.map((file) => URL.createObjectURL(file));

    // If no main image is set, set the first image as the main image
    if (!mainImage && imagePreviews.length > 0) {
      setMainImage(imagePreviews[0]);
    }

    // Update the images array
    setImages([...images, ...imagePreviews]);

    // Prepare FormData to send files to the backend
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    // Send files to the backend
    axios
      .post("http://localhost:5000/api/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Images uploaded successfully:", response.data);

        // Update formData with the uploaded image paths
        setFormData((prevData) => ({
          ...prevData,
          images: [...prevData.images, ...response.data.filePaths], // Add new file paths
          mainImage: prevData.mainImage || response.data.filePaths[0], // Set main image if not already set
        }));
      })
      .catch((error) => {
        console.error("Error uploading images:", error);
      });
  };

  // Handle setting the main image
  const handleSetMainImage = (index) => {
    setMainImage(images[index]);
    setFormData((prevData) => ({
      ...prevData,
      mainImage: formData.images[index], // Update mainImage in formData
    }));
  };

  // Handle removing an image
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    // If the removed image was the main image, update the main image
    if (images[index] === mainImage) {
      setMainImage(updatedImages[0] || null);
      setFormData((prevData) => ({
        ...prevData,
        mainImage: updatedImages[0] || "", // Update mainImage in formData
      }));
    }

    // Remove the image path from formData
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const data = new FormData();

    // Append non-file fields to FormData
    for (const key in formData) {
      if (key === "technicalDimensions" || key === "warrantyInfo") {
        // Stringify nested objects
        data.append(key, JSON.stringify(formData[key]));
      } else if (Array.isArray(formData[key])) {
        // Stringify arrays (except for reviews)
        if (key === "reviews") {
          // Ensure reviews is an array of objects
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, JSON.stringify(formData[key]));
        }
      } else {
        // Append regular fields
        data.append(key, formData[key]);
      }
    }

    // Append images to FormData
    images.forEach((image, index) => {
      if (image instanceof File) {
        data.append("images", image);
      } else {
        console.error("Invalid image file at index:", index, image);
      }
    });

    // Append the main image
    if (mainImage instanceof File) {
      data.append("mainImage", mainImage);
    } else {
      console.error("Invalid main image file:", mainImage);
    }

    try {
      // Send the form data to the backend
      const response = await axios.post(
        "http://localhost:5000/api/products/addproduct",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product created successfully:", response.data);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to add product. Please try again.");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Product</h1>

      {/* Basic Information */}
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label>Price:</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <label>Sale Price:</label>
      <input
        type="number"
        name="salePrice"
        value={formData.salePrice}
        onChange={handleChange}
      />

      {/* Category Dropdown */}
      {/* Category Dropdown */}
      <label>Category:</label>
      <select
        name="category"
        value={formData.category} // Link to formData.category
        onChange={handleCategoryChange}
        required
      >
        <option value="" disabled>
          Select Category
        </option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Subcategory Dropdown */}
      <label>Subcategory:</label>
      <select
        name="subcategory"
        value={formData.subcategory} // Link to formData.subcategory
        onChange={handleSubCategoryChange}
      >
        <option value="" disabled>
          Select Subcategory
        </option>
        {subCategories.map((subCategory) => (
          <option key={subCategory._id} value={subCategory._id}>
            {subCategory.name}
          </option>
        ))}
      </select>

      {/* Type Dropdown */}
      <label>Type:</label>
      <select name="type" value={formData.type} onChange={handleChange}>
        <option value="" disabled>
          Select Type
        </option>
        {types.map((type) => (
          <option key={type._id} value={type._id}>
            {type.name}
          </option>
        ))}
      </select>

      {/* Tags Input */}
      <div className="form-group">
        <label>Tag</label>
        <input
          type="text"
          name="tags"
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

      {/* Customization Options */}
      <div className="form-group">
        <label>Customization Types (Select all that apply):</label>
        <div style={{ marginTop: "10px" }}>
          {[
            "Color Options",
            "Size Options",
            "Fabric/Material Options",
            "Finish Options",
            "Engraving/Personalization",
            "Design Modifications",
            "Other",
          ].map((option) => (
            <div key={option}>
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={customizationOptions.includes(option)}
                  onChange={handleCustomizationChange}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
        {customizationOptions.includes("Other") && (
          <div style={{ marginTop: "10px" }}>
            <label>Other (Please specify):</label>
            <textarea
              name="otherCustomization"
              value={otherCustomization}
              onChange={handleOtherCustomizationChange}
              placeholder="Specify other customization options"
            />
          </div>
        )}
      </div>

      {/* Additional Costs for Customization */}
      <div className="form-group">
        <label>Additional Costs for Customization (Select one):</label>
        <div style={{ marginTop: "10px" }}>
          <label>
            <input
              type="radio"
              name="additionalCosts"
              value="Yes, additional cost applies"
              checked={additionalCosts === "Yes, additional cost applies"}
              onChange={handleAdditionalCostsChange}
            />
            Yes, additional cost applies
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="additionalCosts"
              value="No additional cost"
              checked={additionalCosts === "No additional cost"}
              onChange={handleAdditionalCostsChange}
            />
            No additional cost
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="additionalCosts"
              value="Variable based on customization type"
              checked={
                additionalCosts === "Variable based on customization type"
              }
              onChange={handleAdditionalCostsChange}
            />
            Variable based on customization type (please specify breakdown):
          </label>
        </div>
        {additionalCosts === "Variable based on customization type" && (
          <div style={{ marginTop: "10px" }}>
            <textarea
              name="costBreakdown"
              value={costBreakdown}
              onChange={handleCostBreakdownChange}
              placeholder="Specify cost breakdown"
            />
          </div>
        )}
      </div>

      {/* Rest of the form fields */}
      <label>Manufacturer:</label>
      <input
        type="text"
        name="manufacturer"
        value={formData.manufacturer}
        onChange={handleChange}
      />

      <label>Collection:</label>
      <input
        type="text"
        name="collection"
        value={formData.collection}
        onChange={handleChange}
      />

      <label>Manufacture Year:</label>
      <input
        type="number"
        name="manufactureYear"
        value={formData.manufactureYear}
        onChange={handleChange}
      />

      <label>Colors (comma separated):</label>
      <input
        type="text"
        name="colors"
        value={formData.colors.join(",")}
        onChange={(e) => handleArrayChange(e, "colors")}
      />

      <label>Sizes (comma separated):</label>
      <input
        type="text"
        name="sizes"
        value={formData.sizes.join(",")}
        onChange={(e) => handleArrayChange(e, "sizes")}
      />

      <label>Main Image URL:</label>
      <input
        type="text"
        name="mainImage"
        value={formData.mainImage}
        onChange={handleChange}
      />

      <label>Description:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        maxLength="2000"
      />

      {/* Technical Dimensions */}
      <h2>Technical Dimensions</h2>
      <label>Length:</label>
      <input
        type="number"
        name="length"
        value={formData.technicalDimensions.length}
        onChange={(e) => handleNestedChange(e, "technicalDimensions")}
      />

      <label>Width:</label>
      <input
        type="number"
        name="width"
        value={formData.technicalDimensions.width}
        onChange={(e) => handleNestedChange(e, "technicalDimensions")}
      />

      <label>Height:</label>
      <input
        type="number"
        name="height"
        value={formData.technicalDimensions.height}
        onChange={(e) => handleNestedChange(e, "technicalDimensions")}
      />

      <label>Weight:</label>
      <input
        type="number"
        name="weight"
        value={formData.technicalDimensions.weight}
        onChange={(e) => handleNestedChange(e, "technicalDimensions")}
      />

      {/* Brand Information */}
      <h2>Brand Information</h2>
      <label>Brand ID:</label>
      <input
        type="text"
        name="brandId"
        value={formData.brandId}
        onChange={handleChange}
      />

      <label>Brand Name:</label>
      <input
        type="text"
        name="brandName"
        value={formData.brandName}
        onChange={handleChange}
      />

      {/* Stock and SKU */}
      <label>Lead Time:</label>
      <input
        type="text"
        name="leadTime"
        value={formData.leadTime}
        onChange={handleChange}
      />

      <label>Stock:</label>
      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={handleChange}
      />

      <label>SKU:</label>
      <input
        type="text"
        name="sku"
        value={formData.sku}
        onChange={handleChange}
      />

      {/* Warranty Information */}
      <h2>Warranty Information</h2>
      <label>Warranty Years:</label>
      <input
        type="number"
        name="warrantyYears"
        value={formData.warrantyInfo.warrantyYears}
        onChange={(e) => handleNestedChange(e, "warrantyInfo")}
      />

      <label>Warranty Coverage (comma separated):</label>
      <input
        type="text"
        name="warrantyCoverage"
        value={formData.warrantyInfo.warrantyCoverage.join(",")}
        onChange={(e) =>
          handleArrayChange(e, "warrantyCoverage", "warrantyInfo")
        }
      />

      {/* Additional Information */}
      <h2>Additional Information</h2>
      <label>Material Care Instructions:</label>
      <textarea
        name="materialCareInstructions"
        value={formData.materialCareInstructions}
        onChange={handleChange}
      />

      <label>Product Specific Recommendations:</label>
      <textarea
        name="productSpecificRecommendations"
        value={formData.productSpecificRecommendations}
        onChange={handleChange}
      />

      <label>Estimated Time Lead for Customization:</label>
      <input
        type="text"
        name="Estimatedtimeleadforcustomization"
        value={formData.Estimatedtimeleadforcustomization}
        onChange={handleChange}
      />

      <label>Claim Process:</label>
      <textarea
        name="claimProcess"
        value={formData.claimProcess}
        onChange={handleChange}
      />
      <div className="form-right">
        <div className="image-placeholder">
          {mainImage ? (
            <img src={mainImage} alt="Main Preview" className="main-image" />
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
                1080x1080px. Use .jpeg or .png format. Ensure clear visibility
                of the product from multiple angles. White background)
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
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddProduct;