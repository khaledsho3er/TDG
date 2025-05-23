import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiDeleteOutline } from "react-icons/ti"; // Import the delete icon
import { useVendor } from "../../utils/vendorContext";
import { Box, IconButton } from "@mui/material";
import { IoIosArrowRoundBack } from "react-icons/io";

const UpdateProduct = ({ existingProduct, onBack }) => {
  const { vendor } = useVendor(); // Access vendor data from context

  // State variables
  const [brandName, setBrandName] = useState("");
  const [categories, setCategories] = useState([]); // Categories from API
  const [subCategories, setSubCategories] = useState([]); // Subcategories from API
  const [types, setTypes] = useState([]); // Types from API
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [tags, setTags] = useState([]); // Tags array
  const [customizationOptions, setCustomizationOptions] = useState([]); // Customization options
  const [otherCustomization, setOtherCustomization] = useState(""); // Other customization details
  const [additionalCosts, setAdditionalCosts] = useState(""); // Additional costs selection
  const [costBreakdown, setCostBreakdown] = useState(""); // Cost breakdown for variable option
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
    colors: [], // Initialize colors as an empty array
    sizes: [], // Initialize sizes as an empty array
    images: [], // Initialize images
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
      warrantyCoverage: [], // Initialize as an empty array
    },
    materialCareInstructions: "",
    productSpecificRecommendations: "",
    Estimatedtimeleadforcustomization: "",
    Customizationoptions: [], // Customization options in formData
    Additionaldetails: "",
    Additionalcosts: "",
    // claimProcess: "",
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.thedesigngrit.com/api/categories/categories"
        );
        setCategories(response.data); // Assuming the response contains categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch brand details using brandId from the vendor session
  useEffect(() => {
    if (vendor?.brandId) {
      const fetchBrandName = async () => {
        try {
          const response = await axios.get(
            `https://api.thedesigngrit.com/api/brand/${vendor.brandId}`
          );
          setBrandName(response.data.brandName); // Set the brand name in state
          setFormData((prevData) => ({
            ...prevData,
            brandName: response.data.brandName, // Update formData with brand name
          }));
        } catch (error) {
          console.error("Error fetching brand name:", error);
        }
      };
      fetchBrandName();
    }
  }, [vendor?.brandId, brandName]);

  // Set brandId from vendor context
  useEffect(() => {
    if (vendor) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        brandId: vendor.brandId || "", // Ensure the brandId exists in the vendor data
      }));
    }
  }, [vendor]);

  // Populate form with existing product data
  useEffect(() => {
    if (existingProduct) {
      setFormData(existingProduct);
      setTags(existingProduct.tags || []);
      setSelectedCategory(existingProduct.category);
      setSelectedSubCategory(existingProduct.subcategory);
      setImages(existingProduct.images || []); // Set existing images
      setMainImage(existingProduct.mainImage || ""); // Set existing main image

      // Fetch subcategories and types based on existing product data
      const fetchSubCategoriesAndTypes = async () => {
        try {
          const subCategoryResponse = await axios.get(
            `https://api.thedesigngrit.com/api/subcategories/byCategory/${existingProduct.category}`
          );
          setSubCategories(subCategoryResponse.data);

          const typeResponse = await axios.get(
            `https://api.thedesigngrit.com/api/subcategories/bySubcategory/${existingProduct.subcategory}`
          );
          setTypes(typeResponse.data);
        } catch (error) {
          console.error("Error fetching subcategories or types:", error);
        }
      };
      fetchSubCategoriesAndTypes();
    }
  }, [existingProduct, selectedCategory, selectedSubCategory]);

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
        `https://api.thedesigngrit.com/api/subcategories/byCategory/${selectedCategoryId}`
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
        `https://api.thedesigngrit.com/api/subcategories/bySubcategory/${selectedSubCategoryId}`
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

    // Split the input value by commas and trim each item
    const arrayValues = value.split(",").map((item) => item.trim());

    if (parentField) {
      // Handle nested fields (e.g., warrantyInfo.warrantyCoverage)
      setFormData({
        ...formData,
        [parentField]: {
          ...formData[parentField],
          [field]: arrayValues, // Ensure this is an array
        },
      });
    } else {
      // Handle top-level fields (e.g., tags, colors, sizes)
      setFormData({
        ...formData,
        [field]: arrayValues, // Ensure this is an array
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

  const [images, setImages] = useState(existingProduct.images || []); // Initialize with existing images
  const [mainImage, setMainImage] = useState(existingProduct.mainImage || ""); // Initialize with existing main image

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
      .post("https://api.thedesigngrit.com/api/products/upload", formData, {
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
      mainImage: images[index], // Update mainImage in formData
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

  // Handle cancel
  const handleCancel = () => {
    onBack();
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
        // Append each array item individually
        formData[key].forEach((item, index) => {
          data.append(`${key}[${index}]`, item);
        });
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
    }

    try {
      // Send the form data to the backend
      const response = await axios.put(
        `https://api.thedesigngrit.com/api/products/${formData._id}`, // Use the product ID for updating
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product updated successfully:", response.data);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };
  return (
    <>
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: "10px",
              justifyContent: "flex-start",
            }}
          >
            <IconButton>
              <IoIosArrowRoundBack size={"30px"} onClick={onBack} />
            </IconButton>
            <h2>Update Products</h2>
          </div>
          <p>Home &gt; Update Products</p>
        </div>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="product-form">
          <div className="form-left">
            <h1>Update Product</h1>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              {/* Basic Information */}
              <div className="form-group">
                <label>Product Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label> Product Price:</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Sale Price:</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                />
              </div>
              {/* Category Dropdown */}
              <div className="form-group">
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
              </div>
              <div className="form-group">
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
              </div>
              <div className="form-group">
                {/* Type Dropdown */}
                <label>Type:</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {types.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

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
                        <TiDeleteOutline size={18} />{" "}
                        {/* TiDeleteOutline icon */}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
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
                      checked={
                        additionalCosts === "Yes, additional cost applies"
                      }
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
                        additionalCosts ===
                        "Variable based on customization type"
                      }
                      onChange={handleAdditionalCostsChange}
                    />
                    Variable based on customization type (please specify
                    breakdown):
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
            </Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <div className="form-group">
                {/* Rest of the form fields */}
                <label>Manufacturer:</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Collection:</label>
                <input
                  type="text"
                  name="collection"
                  value={formData.collection}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Manufacture Year:</label>
                <input
                  type="number"
                  name="manufactureYear"
                  value={formData.manufactureYear}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Colors (comma separated):</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors ? formData.colors.join(",") : ""} // Check if colors is defined
                  onChange={(e) => handleArrayChange(e, "colors")}
                />
              </div>
              <div className="form-group">
                <label>Sizes (comma separated):</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes.join(",")}
                  onChange={(e) => handleArrayChange(e, "sizes")}
                />
              </div>
              <div className="form-group">
                <label>Main Image URL:</label>
                <input
                  type="text"
                  name="mainImage"
                  value={formData.mainImage}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength="2000"
                />
              </div>
            </Box>

            {/* Technical Dimensions */}
            <div className="form-group">
              <h2
                style={{
                  textAlign: "left",
                  marginBottom: "10px",
                  marginTop: "20px",
                }}
              >
                Technical Dimensions
              </h2>
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label>Length:</label>
                  <input
                    type="number"
                    name="length"
                    value={formData.technicalDimensions.length}
                    onChange={(e) =>
                      handleNestedChange(e, "technicalDimensions")
                    }
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label>Width:</label>
                  <input
                    type="number"
                    name="width"
                    value={formData.technicalDimensions.width}
                    onChange={(e) =>
                      handleNestedChange(e, "technicalDimensions")
                    }
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label>Height:</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.technicalDimensions.height}
                    onChange={(e) =>
                      handleNestedChange(e, "technicalDimensions")
                    }
                  />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <label>Weight:</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.technicalDimensions.weight}
                    onChange={(e) =>
                      handleNestedChange(e, "technicalDimensions")
                    }
                  />
                </Box>
              </Box>
            </div>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              {/* Brand Information */}
              <h2>Brand Information</h2>
              <div className="form-group">
                <label>Brand ID:</label>
                <input
                  type="text"
                  name="brandId"
                  value={formData.brandId}
                  readOnly // Make it read-only since it's fetched from vendor
                />
              </div>
              <div className="form-group">
                <label>Brand Name:</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                {/* Stock and SKU */}
                <label>Lead Time:</label>
                <input
                  type="text"
                  name="leadTime"
                  value={formData.leadTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>SKU:</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                />
              </div>
            </Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              {/* Warranty Information */}
              <h2>Warranty Information</h2>
              <div className="form-group">
                <label>Warranty Years:</label>
                <input
                  type="number"
                  name="warrantyYears"
                  value={formData.warrantyInfo.warrantyYears}
                  onChange={(e) => handleNestedChange(e, "warrantyInfo")}
                />
              </div>
              <div className="form-group">
                <label>Warranty Coverage (comma separated):</label>
                <input
                  type="text"
                  name="warrantyCoverage"
                  value={
                    formData.warrantyInfo.warrantyCoverage
                      ? formData.warrantyInfo.warrantyCoverage.join(",")
                      : ""
                  } // Check if warrantyCoverage is defined
                  onChange={(e) =>
                    handleArrayChange(e, "warrantyCoverage", "warrantyInfo")
                  }
                />
              </div>
            </Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              {/* Additional Information */}
              <h2>Additional Information</h2>
              <div className="form-group">
                <label>Material Care Instructions:</label>
                <textarea
                  name="materialCareInstructions"
                  value={formData.materialCareInstructions}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Product Specific Recommendations:</label>
                <textarea
                  name="productSpecificRecommendations"
                  value={formData.productSpecificRecommendations}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Estimated Time Lead for Customization:</label>
                <input
                  type="text"
                  name="Estimatedtimeleadforcustomization"
                  value={formData.Estimatedtimeleadforcustomization}
                  onChange={handleChange}
                />
              </div>
              {/* <div className="form-group">
                <label>Claim Process:</label>
                <textarea
                  name="claimProcess"
                  value={formData.claimProcess}
                  onChange={handleChange}
                />
              </div> */}
            </Box>
          </div>
          <div className="form-right">
            <div className="image-placeholder">
              {mainImage ? (
                <img
                  src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${mainImage}`}
                  alt="Main Preview"
                  className="main-image"
                />
              ) : (
                <p
                  style={{
                    border: "1px solid #8A9A5B",
                    borderRadius: "10px",
                    color: "#71797E",
                    margin: " auto",
                    width: "30%",
                    textAlign: "center",
                    padding: "10px",
                    marginTop: "80px",
                  }}
                >
                  Image Preview
                </p>
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${image}`} // Adjust the URL as needed
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
        </div>
        <div className="form-actions">
          <button className="btn update" type="submit">
            UPDATE
          </button>
          <button className="btn cancel" onClick={handleCancel}>
            CANCEL
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateProduct;
