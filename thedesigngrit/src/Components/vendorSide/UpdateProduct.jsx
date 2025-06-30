import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiDeleteOutline } from "react-icons/ti"; // Import the delete icon
import { useVendor } from "../../utils/vendorContext";
import { Box, IconButton } from "@mui/material";
import { IoIosArrowRoundBack } from "react-icons/io";
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
    const image = new window.Image();
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

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    salePrice: "",
    category: "",
    subcategory: "",
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
  });

  // Add states for new features
  const [readyToShip, setReadyToShip] = useState(
    existingProduct.readyToShip || false
  );
  const [cadFile, setCadFile] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [tagOptions, setTagOptions] = useState({});

  // Add state for existing and new images
  const [images, setImages] = useState([]); // Array of File objects or filenames
  const [newImages, setNewImages] = useState([]); // File objects

  // On initial load, populate images/imagePreviews/mainImage/mainImagePreview from existingProduct
  useEffect(() => {
    if (existingProduct && existingProduct.images) {
      setImages(existingProduct.images);
      setImagePreviews(
        existingProduct.images.map((img) =>
          typeof img === "string"
            ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${img}`
            : URL.createObjectURL(img)
        )
      );
      if (existingProduct.mainImage) {
        setMainImage(existingProduct.mainImage);
        setMainImagePreview(
          typeof existingProduct.mainImage === "string"
            ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${existingProduct.mainImage}`
            : URL.createObjectURL(existingProduct.mainImage)
        );
      } else if (existingProduct.images.length > 0) {
        setMainImage(existingProduct.images[0]);
        setMainImagePreview(
          typeof existingProduct.images[0] === "string"
            ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${existingProduct.images[0]}`
            : URL.createObjectURL(existingProduct.images[0])
        );
      }
    }
    // Fetch subcategories and types based on existing product data
    if (existingProduct) {
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
  }, [existingProduct]);

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
    }
  }, [existingProduct, selectedCategory, selectedSubCategory]);

  // Fetch tag options for dropdowns
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
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      }
      e.target.value = "";
    }
  };

  // Function to remove a tag by index
  const handleRemoveTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setFormData({ ...formData, tags: newTags });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new window.Image();
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

  const handleCropComplete = async () => {
    const blob = await getCroppedImg(selectedImageSrc, croppedAreaPixels);
    const croppedFile = new File([blob], pendingFile.name, {
      type: "image/jpeg",
    });
    setNewImages((prev) => [...prev, croppedFile]);
    // Set as mainImage if it's the first image
    if (!mainImage) {
      setMainImage(croppedFile.name);
    }
    setFormData((prevData) => ({
      ...prevData,
      images: [...images, ...newImages, croppedFile],
      mainImage: prevData.mainImage || croppedFile.name,
    }));
    setShowCropModal(false);
    setPendingFile(null);
    setSelectedImageSrc(null);
  };

  // Image gallery logic: remove image from either array
  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      const updated = images.filter((_, i) => i !== index);
      setImages(updated);
      // If mainImage was removed, update mainImage
      if (images[index] === mainImage) {
        setMainImage(updated[0] || (newImages[0] && newImages[0].name) || "");
      }
    } else {
      const updated = newImages.filter((_, i) => i !== index);
      setNewImages(updated);
      if (newImages[index].name === mainImage) {
        setMainImage(images[0] || (updated[0] && updated[0].name) || "");
      }
    }
  };

  // Set main image from gallery
  const handleSetMainImage = (index) => {
    setMainImage(images[index]);
    setMainImagePreview(
      typeof images[index] === "string"
        ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${images[index]}`
        : URL.createObjectURL(images[index])
    );
    setFormData((prevData) => ({
      ...prevData,
      mainImage: images[index],
    }));
  };

  // Handle cancel
  const handleCancel = () => {
    onBack();
  };

  // Add handlers for new features
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };
  const handleCADUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [".dwg", ".dxf", ".stp", ".step", ".igs", ".iges"];
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        alert(
          "Please upload a valid CAD file (DWG, DXF, STP, STEP, IGS, or IGES format)"
        );
        return;
      }
      setCadFile(file);
      setFormData((prevData) => ({ ...prevData, cadFile: file }));
    }
  };
  const handleRemoveCAD = () => {
    setCadFile(null);
    setFormData((prevData) => ({ ...prevData, cadFile: null }));
  };
  const handleWarrantyCoverageChange = (coverage) => {
    setFormData((prevState) => {
      const currentCoverage = prevState.warrantyInfo.warrantyCoverage;
      let newCoverage;
      if (currentCoverage.includes(coverage)) {
        newCoverage = currentCoverage.filter((item) => item !== coverage);
      } else {
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
  const handleSelectTag = (category, value) => {
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
      setFormData({ ...formData, tags: [...formData.tags, value] });
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const { name } = e.target;
      if (name === "productSpecificRecommendations") {
        setFormData((prev) => ({
          ...prev,
          productSpecificRecommendations:
            (prev.productSpecificRecommendations
              ? prev.productSpecificRecommendations + "\n• "
              : "• ") + e.target.value.slice(e.target.selectionStart),
        }));
      } else if (name === "materialCareInstructions") {
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

  // Update handleSubmit to match AddProduct logic
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    onBack();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDialogOpen(false);
    setIsSubmitting(true);
    const data = new FormData();
    // Append all fields as in AddProduct
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
    data.append("readyToShip", formData.readyToShip);
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
    formData.tags.forEach((tag, index) => data.append(`tags[${index}]`, tag));
    formData.colors.forEach((color, index) =>
      data.append(`colors[${index}]`, color)
    );
    formData.sizes.forEach((size, index) =>
      data.append(`sizes[${index}]`, size)
    );
    data.append(
      "technicalDimensions",
      JSON.stringify(formData.technicalDimensions)
    );
    data.append("warrantyInfo", JSON.stringify(formData.warrantyInfo));
    // Append existing image filenames
    images.forEach((filename, idx) => {
      data.append(`images[${idx}]`, filename);
    });
    // Append new image files
    newImages.forEach((file) => {
      data.append("images", file);
    });
    // Set mainImage as filename
    data.append("mainImage", mainImage);
    // CAD file
    if (cadFile) {
      data.append("cadFile", cadFile);
    }
    try {
      const response = await axios.put(
        `https://api.thedesigngrit.com/api/products/${formData._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setShowSuccessDialog(true);
    } catch (error) {
      alert("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
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
      <form onSubmit={(e) => e.preventDefault()}>
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
                  value={formData.category}
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
                  value={formData.subcategory}
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
              {/* Tags Input and Dropdowns */}
              <div className="form-group">
                <label>Tag</label>
                <div className="dropdown-container">
                  {Object.entries(tagOptions).map(([category, options]) => (
                    <select
                      key={category}
                      onChange={(e) => {
                        handleSelectTag(category, e.target.value);
                        e.target.value = "";
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
                <input
                  type="text"
                  name="tags"
                  placeholder="Add tag and press Enter  Ex: Sofa, Living Room"
                  onKeyDown={handleAddTag}
                  className="tag-input"
                  style={{ margin: "10px 0px" }}
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
            </Box>
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
                />
              </div> */}
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
              {/* <div className="form-group">
                <label>Main Image URL:</label>
                <input
                  type="text"
                  name="mainImage"
                  value={formData.mainImage}
                  onChange={handleChange}
                />
              </div> */}
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
                  src={mainImagePreview}
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
                      mainImage &&
                      ((typeof mainImage === "string" && mainImage === image) ||
                        (mainImage instanceof File &&
                          image instanceof File &&
                          mainImage.name === image.name))
                        ? "main-thumbnail"
                        : ""
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
                        src={
                          typeof image === "string"
                            ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${image}`
                            : URL.createObjectURL(image)
                        }
                        alt={`Thumbnail ${index}`}
                        className="image-thumbnail"
                        onClick={() => handleSetMainImage(index)}
                      />
                      <span>Product thumbnail.png</span>
                      <span className="checkmark">
                        {mainImage &&
                        ((typeof mainImage === "string" &&
                          mainImage === image) ||
                          (mainImage instanceof File &&
                            image instanceof File &&
                            mainImage.name === image.name))
                          ? "✔ Main"
                          : "✔"}
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
                {newImages.map((image, index) => (
                  <div
                    className={`thumbnail ${
                      image.name === mainImage ? "main-thumbnail" : ""
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
                        src={URL.createObjectURL(image)}
                        alt={`Thumbnail ${index}`}
                        className="image-thumbnail"
                        onClick={() => handleSetMainImage(index)}
                      />
                      <span>Product thumbnail.png</span>
                      <span className="checkmark">
                        {image.name === mainImage ? "✔ Main" : "✔"}
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
          <button
            className="btn update"
            type="button"
            onClick={handleOpenDialog}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "UPDATE"}
          </button>
          <button className="btn cancel" onClick={handleCancel}>
            CANCEL
          </button>
        </div>
      </form>
      <ConfirmationDialog
        open={isDialogOpen}
        title="Confirm Product Update"
        content="Are you sure you want to update this product?"
        onConfirm={handleSubmit}
        onCancel={handleCloseDialog}
      />
      <Dialog open={showSuccessDialog} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>Product updated successfully!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
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
              <button onClick={handleCropComplete}>Crop Image</button>
              <button onClick={() => setShowCropModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateProduct;
