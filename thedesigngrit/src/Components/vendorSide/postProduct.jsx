import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiDeleteOutline } from "react-icons/ti"; // Import the delete icon
import { useVendor } from "../../utils/vendorContext";
// import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import ConfirmationDialog from "../confirmationMsg";
import Cropper from "react-easy-crop";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
const getCroppedImg = (imageSrc, croppedAreaPixels) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    };
  });
};

const AddProduct = () => {
  const { vendor } = useVendor(); // Access vendor data from context

  // State variables
  const [brandName, setBrandName] = useState(""); // Store fetched brand name
  const [categories, setCategories] = useState([]); // Categories from API
  const [subCategories, setSubCategories] = useState([]); // Subcategories from API
  const [types, setTypes] = useState([]); // Types from API
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
  const [selectedSubCategory, setSelectedSubCategory] = useState(""); // Selected subcategory
  const [tags, setTags] = useState([]); // Tags array
  const [tagOptions, setTagOptions] = useState({}); // Store tags per category
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    salePrice: null,
    category: "",
    subcategory: "",
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
    readyToShip: false, // Add readyToShip field with default value false
    warrantyInfo: {
      warrantyYears: "",
      warrantyCoverage: [],
    },
    materialCareInstructions: "",
    productSpecificRecommendations: "",
    Estimatedtimeleadforcustomization: "",

    cadFile: null, // Add CAD field
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
  }, [vendor?.brandId]);
  // Set brandId from vendor context
  useEffect(() => {
    if (vendor) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        brandId: vendor.brandId || "", // Ensure the brandId exists in the vendor data
      }));
    }
  }, [vendor]);
  console.log("Brand Name:", brandName); // Handle category change
  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    setSelectedCategory(selectedCategoryId);
    setFormData({
      ...formData,
      category: selectedCategoryId, // Update formData.category
    });

    setSubCategories([]); // Reset subcategories
    setSelectedSubCategory(""); // Reset subcategory
    console.log(selectedCategory);
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
    console.log(selectedSubCategory);
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

    // Special handling for leadTime and Estimatedtimeleadforcustomization to ensure they're valid ranges
    if (name === "leadTime" || name === "Estimatedtimeleadforcustomization") {
      // Allow numbers and a single hyphen
      const validValue = value.replace(/[^\d-]/g, "");
      // Ensure only one hyphen
      const parts = validValue.split("-");
      if (parts.length > 2) {
        // If more than one hyphen, keep only the first one
        const firstPart = parts[0];
        const secondPart = parts[1];
        setFormData({
          ...formData,
          [name]: `${firstPart}-${secondPart}`,
        });
      } else {
        setFormData({
          ...formData,
          [name]: validValue,
        });
      }
      return;
    }

    // Handle bullet points for specific fields
    if (name === "materialCareInstructions") {
      // For material care instructions, just allow normal line breaks
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name === "productSpecificRecommendations") {
      // For product recommendations, add bullet points
      const formattedValue = value
        .split("\n")
        .map((line) => (line.startsWith("•") ? line : `• ${line.trim()}`))
        .join("\n");

      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else {
      // For all other fields, just update normally
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const { name } = e.target;

      if (name === "productSpecificRecommendations") {
        // Only add bullet points for product recommendations
        setFormData((prev) => ({
          ...prev,
          productSpecificRecommendations:
            (prev.productSpecificRecommendations
              ? prev.productSpecificRecommendations + "\n• "
              : "• ") + e.target.value.slice(e.target.selectionStart),
        }));
      } else if (name === "materialCareInstructions") {
        // For material care, just add a new line
        setFormData((prev) => ({
          ...prev,
          materialCareInstructions:
            (prev.materialCareInstructions
              ? prev.materialCareInstructions + "\n"
              : "") + e.target.value.slice(e.target.selectionStart),
        }));
      }
    }
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

  // Handles adding a tag from the input field (Press Enter)
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const categories = [
          "Color",
          "Shape",
          "Size",
          "Material",
          "Style",
          "Finish",
          "Functionality",
        ];

        const fetchedTags = {};
        for (const category of categories) {
          const response = await axios.get(
            `https://api.thedesigngrit.com/api/tags/tags/${category}`
          );
          fetchedTags[category] = response.data.map((tag) => tag.name);
        }

        setTagOptions(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);
  const handleAddTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newTag = e.target.value.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]); // Update local state
        setFormData({ ...formData, tags: [...formData.tags, newTag] }); // Update formData
      }
      e.target.value = ""; // Clear input
    }
  };

  // Handles adding a tag from a dropdown
  const handleSelectTag = (category, value) => {
    if (value && !tags.includes(value)) {
      setTags([...tags, value]); // Update local state
      setFormData({ ...formData, tags: [...formData.tags, value] }); // Update formData
    }
  };

  // Function to remove a tag by index
  const handleRemoveTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags); // Update local state
    setFormData({ ...formData, tags: newTags }); // Update formData
  };
  const [imagePreviews, setImagePreviews] = useState([]); // Preview URLs
  const [mainImagePreview, setMainImagePreview] = useState(null); // Main image preview
  const [images, setImages] = useState([]); // Uploaded images
  const [mainImage, setMainImage] = useState(null); // Main image file
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      if (img.width < 400 || img.height < 300) {
        alert("Image too small. Minimum size: 400x300px for 4:3 ratio.");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setSelectedImageSrc(previewUrl);
      setPendingFile(file);
      setShowCropModal(true);
    };
    img.src = URL.createObjectURL(file);
  };

  // const handleCropComplete = (croppedBlob, croppedUrl) => {
  //   const croppedFile = new File([croppedBlob], "cropped.jpg", {
  //     type: "image/jpeg",
  //   });

  //   setImages((prev) => [...prev, croppedFile]);
  //   setImagePreviews((prev) => [...prev, croppedUrl]);

  //   if (!mainImage) {
  //     setMainImage(croppedFile);
  //     setMainImagePreview(croppedUrl);
  //   }

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     images: [...prevData.images, croppedFile],
  //     mainImage: prevData.mainImage || croppedFile,
  //   }));

  //   setShowCropModal(false);
  // };

  // Handle setting the main image
  const handleSetMainImage = (index) => {
    setMainImage(images[index]); // Set main image file
    setMainImagePreview(imagePreviews[index]); // Set preview

    setFormData((prevData) => ({
      ...prevData,
      mainImage: images[index], // Update formData with the selected main image
    }));
  };

  // Handle removing an image
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(updatedImages);
    setImagePreviews(updatedPreviews);

    // If the removed image was the main image, update the main image
    if (images[index] === mainImage) {
      setMainImage(updatedImages[0] || null);
      setMainImagePreview(updatedPreviews[0] || null);

      setFormData((prevData) => ({
        ...prevData,
        mainImage: updatedImages[0] || "", // Update mainImage in formData
      }));
    }

    // Update formData images list
    setFormData((prevData) => ({
      ...prevData,
      images: updatedImages,
    }));
  };
  // Open confirmation dialog
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // Close confirmation dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Add CAD file handling functions
  const handleCADUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const allowedTypes = [".dwg", ".dxf", ".stp", ".step", ".igs", ".iges"];
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        alert(
          "Please upload a valid CAD file (DWG, DXF, STP, STEP, IGS, or IGES format)"
        );
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        cadFile: file, // Changed from 'cad' to 'cadFile' to match backend
      }));
    }
  };

  // Add handleCheckboxChange function
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // Update handleSubmit to include readyToShip
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogOpen(false);
    setIsSubmitting(true);
    const data = new FormData();

    // Append basic fields
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("salePrice", formData.salePrice || null || "");
    data.append("category", formData.category);
    data.append("subcategory", formData.subcategory);
    data.append("collection", formData.collection || "");
    data.append("type", formData.type || "");
    data.append("manufactureYear", formData.manufactureYear || "");
    data.append("description", formData.description || "");
    data.append("brandId", formData.brandId || "");
    data.append("brandName", formData.brandName || "");
    data.append("leadTime", formData.leadTime || "");
    data.append("stock", formData.stock || "");
    data.append("sku", formData.sku || "");
    data.append("readyToShip", formData.readyToShip); // Add readyToShip to FormData
    data.append(
      "materialCareInstructions",
      formData.materialCareInstructions || ""
    );
    data.append(
      "productSpecificRecommendations",
      formData.productSpecificRecommendations || ""
    );
    data.append(
      "Estimatedtimeleadforcustomization",
      formData.Estimatedtimeleadforcustomization || ""
    );
    // Append array fields
    formData.tags.forEach((tag, index) => data.append(`tags[${index}]`, tag));
    formData.colors.forEach((color, index) =>
      data.append(`colors[${index}]`, color)
    );
    formData.sizes.forEach((size, index) =>
      data.append(`sizes[${index}]`, size)
    );
    // Append nested objects
    data.append(
      "technicalDimensions",
      JSON.stringify(formData.technicalDimensions)
    );
    data.append("warrantyInfo", JSON.stringify(formData.warrantyInfo));

    // Append images
    formData.images.forEach((file) => {
      data.append("images", file);
    });

    // Append CAD file if exists
    if (formData.cadFile) {
      // Changed from 'cad' to 'cadFile'
      data.append("cadFile", formData.cadFile);
    }

    // Log FormData for debugging
    for (let [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(
        "https://api.thedesigngrit.com/api/products/addproduct",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Product created successfully:", response.data);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error creating product:", error.response?.data || error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this new function near your other handlers
  const handleWarrantyCoverageChange = (coverage) => {
    setFormData((prevState) => {
      const currentCoverage = prevState.warrantyInfo.warrantyCoverage;
      let newCoverage;

      if (currentCoverage.includes(coverage)) {
        // Remove the coverage if it's already selected
        newCoverage = currentCoverage.filter((item) => item !== coverage);
      } else {
        // Add the coverage if it's not selected
        newCoverage = [...currentCoverage, coverage];
      }

      return {
        ...prevState,
        warrantyInfo: {
          ...prevState.warrantyInfo,
          warrantyCoverage: newCoverage,
        },
      };
    });
  };

  // Add success dialog
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    window.location.reload();
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push("Product Name");
    if (!formData.price || isNaN(formData.price)) errors.push("Product Price");
    if (!formData.sku.trim()) errors.push("SKU");
    if (!formData.collection.trim()) errors.push("Collection");
    if (!formData.stock || isNaN(formData.stock)) errors.push("Stock");
    if (!formData.leadTime.trim()) errors.push("Lead Time");
    if (!formData.description.trim()) errors.push("Description");
    if (!formData.images || formData.images.length === 0)
      errors.push("At least one image");
    return errors;
  };

  return (
    <>
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>All Products</h2>
          <p>
            {/* <Link to={`/vendor-dashboard/${formData.brandId}`}></Link> */}
            Home &gt; Add Products
          </p>
        </div>
      </header>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="product-form">
          <div className="form-left">
            <h1>Add Product</h1>

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
                  placeholder="Ex: L-shaped Sofa "
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
                  placeholder="Ex: 10,000.00"
                  required
                />
              </div>
              {/* <div className="form-group">
                <label>Sale Price:</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  placeholder="Ex: 1000.00"
                />
              </div> */}
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

                {/* Dropdowns for predefined tag categories */}
                <div className="dropdown-container">
                  {Object.entries(tagOptions).map(([category, options]) => (
                    <select
                      key={category}
                      onChange={(e) => {
                        handleSelectTag(category, e.target.value);
                        e.target.value = ""; // Reset dropdown after selection
                      }}
                    >
                      <option value="">{`Select ${category}`}</option>
                      {options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>

                {/* Input field for custom tags */}
                <input
                  type="text"
                  name="tags"
                  placeholder="Add tag and press Enter  Ex: Sofa, Living Room"
                  onKeyDown={handleAddTag}
                  className="tag-input"
                  style={{ margin: "10px 0px" }}
                />

                {/* Display Selected Tags */}
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
            </Box>
            {/* <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              // Customization Options 
              <div className="form-group">
                <label>Customization Types (Select all that apply):</label>
                <div
                  style={{
                    marginTop: "10px",
                    display: "inline",

                    alignItems: "flex-start",
                  }}
                >
                  {[
                    "Color Options",
                    "Size Options",
                    "Fabric/Material Options",
                    "Finish Options",
                    "Engraving/Personalization",
                    "Design Modifications",
                    "Other",
                  ].map((option) => (
                    <div
                      key={option}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <input
                        type="checkbox"
                        value={option}
                        checked={customizationOptions.includes(option)}
                        onChange={handleCustomizationChange}
                        style={{ marginRight: "8px" }}
                      />
                      <label style={{ width: "100%", marginBottom: "1px" }}>
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

              //Additional Costs for Customization 
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
            </Box> */}
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <h2>Product Details</h2>
              {/* <div className="form-group">
                
                <label>Manufacturer:</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="Ex: Home Essentials"
                />
              </div> */}
              <div className="form-group">
                <label>Collection:</label>
                <input
                  type="text"
                  name="collection"
                  value={formData.collection}
                  onChange={handleChange}
                  placeholder="Ex: Living Room"
                />
              </div>
              <div className="form-group">
                <label>Manufacture Year:</label>
                <input
                  type="number"
                  name="manufactureYear"
                  value={formData.manufactureYear}
                  onChange={handleChange}
                  placeholder="Ex: 2023"
                  required
                />
              </div>
              <div className="form-group">
                <label>Colors (comma separated):</label>
                <span
                  style={{
                    color: "grey",
                    margin: "5px",
                  }}
                >
                  Enter the colors of the product which be vaild for variants.
                </span>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors.join(",")}
                  onChange={(e) => handleArrayChange(e, "colors")}
                  placeholder="Ex: Red, Blue, Green"
                  style={{ marginTop: "10px" }}
                />
              </div>
              <div className="form-group">
                <label>Sizes (comma separated):</label>
                <span
                  style={{
                    color: "grey",
                    margin: "5px",
                  }}
                >
                  Enter the sizes of the product which be vaild for variants.
                </span>

                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes.join(",")}
                  onChange={(e) => handleArrayChange(e, "sizes")}
                  placeholder="Ex: Small, Medium, Large"
                  style={{ marginTop: "10px" }}
                />
              </div>
              {/* <div className="form-group">
                <label>Main Image URL:</label>
                <input
                  type="text"
                  name="mainImage"
                  value={formData.mainImage}
                  onChange={handleChange}
                  readOnly
                />
              </div> */}
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => {
                    const words = e.target.value
                      .trim()
                      .split(/\s+/)
                      .filter((word) => word.length > 0);
                    if (words.length <= 10) {
                      handleChange(e);
                    }
                  }}
                  placeholder="Provide a brief product description (max 10 words). Include key features and benefits."
                  maxLength="2000"
                />
                <div
                  style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}
                >
                  Word count:{" "}
                  {
                    formData.description
                      .trim()
                      .split(/\s+/)
                      .filter((word) => word.length > 0).length
                  }
                  /10 words
                </div>
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
                    placeholder="CM"
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
                    placeholder="CM"
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
                    placeholder="CM"
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
                    placeholder="Kg"
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
                  readOnly
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
                <label
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <input
                    type="checkbox"
                    name="readyToShip"
                    checked={formData.readyToShip}
                    onChange={handleCheckboxChange}
                    style={{ width: "auto" }}
                  />
                  Ready to Ship
                  <span style={{ fontWeight: "normal" }}>
                    (That The Product is Ready to Ship )
                  </span>
                </label>
              </div>
              <div className="form-group">
                <label>Lead Time:</label>
                <input
                  type="text"
                  name="leadTime"
                  value={formData.leadTime}
                  onChange={handleChange}
                  placeholder="Enter lead time range (e.g., 5-7 days)"
                  required
                  pattern="\d+-\d+"
                  title="Please enter a valid range (e.g., 5-7)"
                />
              </div>
              <div className="form-group">
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter the stock quantity  Ex:100"
                />
              </div>
              <div className="form-group">
                <label>SKU:</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Enter the Stock Keeping Unit"
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
                  placeholder="Enter the number of years of warranty"
                />
              </div>
              <div className="form-group">
                <label>Warranty Coverage:</label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  {[
                    "Manufacturer Defects",
                    "Wear and Tear",
                    "Damage During Shipping",
                  ].map((coverage) => (
                    <label
                      key={coverage}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.warrantyInfo.warrantyCoverage.includes(
                          coverage
                        )}
                        onChange={() => handleWarrantyCoverageChange(coverage)}
                        style={{ cursor: "pointer" }}
                      />
                      {coverage}
                    </label>
                  ))}
                </div>
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
                  onKeyDown={handleKeyDown}
                  placeholder="Enter the material care instructions"
                  required
                />
              </div>
              <div className="form-group">
                <label>Product Specific Recommendations:</label>
                <textarea
                  name="productSpecificRecommendations"
                  value={formData.productSpecificRecommendations}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter the product specific recommendations"
                  required
                />
              </div>
              <div className="form-group">
                <label>Estimated Time Lead for Customization:</label>
                <input
                  type="text"
                  name="Estimatedtimeleadforcustomization"
                  value={formData.Estimatedtimeleadforcustomization}
                  onChange={handleChange}
                  placeholder="Enter time range (e.g., 5-7 days)"
                  pattern="\d+-\d+"
                  title="Please enter a valid range (e.g., 5-7)"
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
              {mainImagePreview ? (
                <img
                  src={mainImagePreview} // Use preview URL instead of file object
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
                  accept="image/jpeg, image/png, image/webp"
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
                {imagePreviews.map((preview, index) => (
                  <div
                    className={`thumbnail ${
                      preview === mainImagePreview ? "main-thumbnail" : ""
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
                        src={preview}
                        alt={`Thumbnail ${index}`}
                        className="image-thumbnail"
                        onClick={() => handleSetMainImage(index)}
                      />
                      <span>Product thumbnail.png</span>
                      <span className="checkmark">
                        {preview === mainImagePreview ? "✔ Main" : "✔"}
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

            {/* Update CAD Upload Section */}
            <div className="cad-upload-section">
              <label>CAD File Upload</label>
              <div className="cad-drop-zone">
                <input
                  type="file"
                  accept=".dwg,.dxf,.stp,.step,.igs,.iges"
                  onChange={handleCADUpload}
                  className="cad-file-input"
                  style={{ display: "none" }}
                  id="cadFileInput"
                />
                <label htmlFor="cadFileInput" className="cad-drop-zone-label">
                  Drop your CAD file here, or browse
                  <br />
                  Supported formats: DWG, DXF, STP, STEP, IGS, IGES
                </label>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("cadFileInput").click()
                  }
                  className="upload-btn"
                >
                  Upload CAD File
                </button>
              </div>
              {formData.cadFile && ( // Changed from 'cad' to 'cadFile'
                <div className="cad-file-info">
                  <span>Selected file: {formData.cadFile.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, cadFile: null }))
                    }
                    className="remove-cad-btn"
                  >
                    ✖
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="form-actions">
          {validationErrors.length > 0 && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              Please fill the following required fields:{" "}
              {validationErrors.join(", ")}
            </div>
          )}
          <button
            className="btn update"
            type="button"
            onClick={() => {
              const errors = validateForm();
              if (errors.length > 0) {
                setValidationErrors(errors);
                return;
              }
              setValidationErrors([]);
              handleOpenDialog();
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "ADD"}
          </button>
          <button className="btn cancel">CANCEL</button>
        </div>{" "}
        {/* Confirmation Dialog */}
        <ConfirmationDialog
          open={isDialogOpen}
          title="Confirm Product Addition"
          content="Are you sure you want to add this product?"
          onConfirm={handleSubmit}
          onCancel={handleCloseDialog}
        />
        <Dialog open={showSuccessDialog} onClose={handleCloseSuccessDialog}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <DialogContentText>Product added successfully!</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccessDialog} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </form>
      {showCropModal && (
        <div className="modal-overlay-uploadimage">
          <div className="modal-content-uploadimage">
            <div className="cropper-container-uploadimage">
              <Cropper
                image={selectedImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setCroppedAreaPixels(area)}
              />
            </div>
            <div className="cropper-buttons-uploadimage">
              <button
                onClick={async () => {
                  const blob = await getCroppedImg(
                    selectedImageSrc,
                    croppedAreaPixels
                  );
                  const url = URL.createObjectURL(blob);
                  const croppedFile = new File([blob], pendingFile.name, {
                    type: "image/jpeg",
                  });

                  setImages((prev) => [...prev, croppedFile]);
                  setImagePreviews((prev) => [...prev, url]);

                  if (!mainImage) {
                    setMainImage(croppedFile);
                    setMainImagePreview(url);
                  }

                  setFormData((prevData) => ({
                    ...prevData,
                    images: [...prevData.images, croppedFile],
                    mainImage: prevData.mainImage || croppedFile,
                  }));

                  setShowCropModal(false);
                  setPendingFile(null);
                  setSelectedImageSrc(null);
                }}
              >
                Crop Image
              </button>
              <button onClick={() => setShowCropModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProduct;
