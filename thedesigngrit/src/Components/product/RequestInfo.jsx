import React, { useState, useContext, useEffect } from "react";
import { IconButton } from "@mui/material";
import { IoIosClose } from "react-icons/io";
import ConfirmationDialog from "../confirmationMsg"; // Import ConfirmationDialog
import { UserContext } from "../../utils/userContext"; // Assuming you have UserContext
import axios from "axios"; // Import axios for API calls
import * as Yup from "yup"; // Import Yup for validation

const RequestQuote = ({ onClose, productId }) => {
  const { userSession } = useContext(UserContext); // Get user data from context
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for the confirmation dialog
  const [isConfirmed, setIsConfirmed] = useState(false); // State for confirmation status
  const [material, setMaterial] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [customization, setCustomization] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [brandData, setBrandData] = useState(null);
  const [errors, setErrors] = useState({}); // Add errors state

  // New state for tracking dropdown selections
  const [materialOption, setMaterialOption] = useState("");
  const [sizeOption, setSizeOption] = useState("");
  const [colorOption, setColorOption] = useState("");

  // Validation schema using Yup
  const validationSchema = Yup.object({
    material: Yup.string().required("Material is required"),
    size: Yup.string().required("Size is required"),
    color: Yup.string().required("Color is required"),
    // Customization is optional
  });

  // Fetch brand data if needed
  useEffect(() => {
    // If productId has brandId as an ID string instead of an object
    if (
      productId &&
      productId.brandId &&
      typeof productId.brandId === "string"
    ) {
      const fetchBrandData = async () => {
        try {
          const response = await axios.get(
            `https://api.thedesigngrit.com/api/brand/${productId.brandId}`
          );
          setBrandData(response.data);
        } catch (error) {
          console.error("Error fetching brand data:", error);
        }
      };
      fetchBrandData();
    } else if (productId && productId.brandId) {
      // If brandId is already an object, use it directly
      setBrandData(productId.brandId);
    }
  }, [productId]);

  // Validate form fields
  const validateForm = async () => {
    try {
      const formData = { material, size, color, customization };
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  // Handle dropdown changes
  const handleMaterialChange = (e) => {
    const value = e.target.value;
    setMaterialOption(value);
    if (value !== "Other") {
      setMaterial(value);
    } else {
      setMaterial("");
    }
    // Clear error when user makes a selection
    if (errors.material && value !== "") {
      setErrors({ ...errors, material: "" });
    }
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setSizeOption(value);
    if (value !== "Other") {
      setSize(value);
    } else {
      setSize("");
    }
    // Clear error when user makes a selection
    if (errors.size && value !== "") {
      setErrors({ ...errors, size: "" });
    }
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    setColorOption(value);
    if (value !== "Other") {
      setColor(value);
    } else {
      setColor("");
    }
    // Clear error when user makes a selection
    if (errors.color && value !== "") {
      setErrors({ ...errors, color: "" });
    }
  };

  // Handle text input changes
  const handleMaterialInput = (e) => {
    setMaterial(e.target.value);
    // Clear error when user types
    if (errors.material && e.target.value !== "") {
      setErrors({ ...errors, material: "" });
    }
  };

  const handleSizeInput = (e) => {
    setSize(e.target.value);
    // Clear error when user types
    if (errors.size && e.target.value !== "") {
      setErrors({ ...errors, size: "" });
    }
  };

  const handleColorInput = (e) => {
    setColor(e.target.value);
    // Clear error when user types
    if (errors.color && e.target.value !== "") {
      setErrors({ ...errors, color: "" });
    }
  };

  const handleCustomizationInput = (e) => {
    setCustomization(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before proceeding
    const isValid = await validateForm();
    if (!isValid) return;

    setIsDialogOpen(true); // Open the confirmation dialog
  };

  // Handle confirmation
  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      // Determine the correct brandId to use
      const brandIdToUse = brandData
        ? brandData._id
        : typeof productId.brandId === "object"
        ? productId.brandId._id
        : productId.brandId;

      // Ensure we have a valid product ID
      const productIdToUse = productId._id || productId;

      const response = await axios.post(
        "https://api.thedesigngrit.com/api/quotation/create",
        {
          userId: userSession.id,
          brandId: brandIdToUse,
          productId: productIdToUse,
          material: material,
          size: size,
          color: color,
          customization: customization,
        }
      );

      console.log("Quotation sent successfully:", response.data);
      setIsConfirmed(true);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting quotation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsDialogOpen(false); // Close the confirmation dialog
  };

  // Determine which brand data to display
  const displayBrand =
    brandData ||
    (typeof productId.brandId === "object" ? productId.brandId : null);

  if (!displayBrand) {
    return (
      <div className="requestInfo-popup-overlay">
        <div className="requestInfo-popup">
          <div className="requestInfo-popup-header">
            <h2>REQUEST INFO</h2>
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                top: "16px",
                right: "16px",
                color: "#2d2d2d",
              }}
            >
              <IoIosClose size={30} color="#fff" />
            </IconButton>
          </div>
          <div className="requestInfo-popup-content">
            <p>Loading brand information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if form is valid for submit button state
  const isFormValid = material !== "" && size !== "" && color !== "";

  return (
    <div className="requestInfo-popup-overlay">
      <div className="requestInfo-popup">
        <div className="requestInfo-popup-header">
          <h2>REQUEST INFO</h2>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: "16px",
              right: "16px",
              color: "#2d2d2d",
            }}
          >
            <IoIosClose size={30} color="#fff" />
          </IconButton>
        </div>

        {/* Show confirmation message if confirmed */}
        {isConfirmed ? (
          <div className="confirmation-message">
            <h3>
              Thank you for your request! We will get back to you shortly.
            </h3>
            <button onClick={onClose}>Close</button>
          </div>
        ) : (
          <div className="requestInfo-popup-content">
            <div className="requestInfo-brand-user-info">
              <div className="requestInfo-brand">
                <div className="requestInfo-brand-info">
                  {displayBrand.brandlogo && (
                    <img
                      src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${displayBrand.brandlogo}`}
                      alt={displayBrand.brandName}
                      className="requestInfo-brand-logo"
                    />
                  )}
                </div>
                <div className="requestInfo-brand-name">
                  <p>Get In Touch</p>
                  <h2>{displayBrand.brandName}</h2>
                </div>
              </div>
              <div className="requestInfo-user-info">
                <p>{userSession.firstName}</p>
                <p>{userSession.email}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>{" "}
                {/* Display current date */}
              </div>
            </div>
            <form className="requestInfo-form" onSubmit={handleSubmit}>
              <div className="requestInfo-form-group">
                <label>Material</label>
                <div className="requestInfo-input-group">
                  <select
                    value={materialOption}
                    onChange={handleMaterialChange}
                    className={errors.material ? "input-error" : ""}
                  >
                    <option value="">Select Material</option>
                    <option value="Wool Fabric">Wool Fabric</option>
                    <option value="Cotton Fabric">Cotton Fabric</option>
                    <option value="Leather">Leather</option>
                    <option value="Denim">Denim</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Other..."
                    value={material}
                    onChange={handleMaterialInput}
                    disabled={materialOption !== "Other"}
                    className={
                      errors.material && materialOption === "Other"
                        ? "input-error"
                        : ""
                    }
                    style={{
                      backgroundColor:
                        materialOption !== "Other" ? "#f0f0f0" : "white",
                      cursor:
                        materialOption !== "Other" ? "not-allowed" : "text",
                    }}
                  />
                </div>
                {errors.material && (
                  <div className="error-message">{errors.material}</div>
                )}
              </div>
              <div className="requestInfo-form-group">
                <label>Size</label>
                <div className="requestInfo-input-group">
                  <select
                    value={sizeOption}
                    onChange={handleSizeChange}
                    className={errors.size ? "input-error" : ""}
                  >
                    <option value="">Select Size</option>
                    <option value="4080 x 1000">4080 x 1000</option>
                    <option value="4080 x 1200">4080 x 1200</option>
                    <option value="4080 x 1400">4080 x 1400</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Other..."
                    value={size}
                    onChange={handleSizeInput}
                    disabled={sizeOption !== "Other"}
                    className={
                      errors.size && sizeOption === "Other" ? "input-error" : ""
                    }
                    style={{
                      backgroundColor:
                        sizeOption !== "Other" ? "#f0f0f0" : "white",
                      cursor: sizeOption !== "Other" ? "not-allowed" : "text",
                    }}
                  />
                </div>
                {errors.size && (
                  <div className="error-message">{errors.size}</div>
                )}
              </div>
              <div className="requestInfo-form-group">
                <label>Colour</label>
                <div className="requestInfo-input-group">
                  <select
                    value={colorOption}
                    onChange={handleColorChange}
                    className={errors.color ? "input-error" : ""}
                  >
                    <option value="">Select Colour</option>
                    <option value="White Grey">White Grey</option>
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                    <option value="Grey">Grey</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Other..."
                    value={color}
                    onChange={handleColorInput}
                    disabled={colorOption !== "Other"}
                    className={
                      errors.color && colorOption === "Other"
                        ? "input-error"
                        : ""
                    }
                    style={{
                      backgroundColor:
                        colorOption !== "Other" ? "#f0f0f0" : "white",
                      cursor: colorOption !== "Other" ? "not-allowed" : "text",
                    }}
                  />
                </div>
                {errors.color && (
                  <div className="error-message">{errors.color}</div>
                )}
              </div>
              <div className="requestInfo-form-group">
                <label>Customization</label>
                <textarea
                  placeholder="Add a note..."
                  value={customization}
                  onChange={handleCustomizationInput}
                ></textarea>
              </div>
              <button
                type="submit"
                className={`requestInfo-submit-button ${
                  !isFormValid ? "button-disabled" : ""
                }`}
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? "Sending..." : "SEND"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        title="Confirm Your Request"
        content="Are you sure you want to submit your request?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default RequestQuote;
