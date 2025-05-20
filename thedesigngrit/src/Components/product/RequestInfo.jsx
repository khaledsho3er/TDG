import React, { useState, useContext, useEffect } from "react";
import { IconButton } from "@mui/material";
import { IoIosClose } from "react-icons/io";
import ConfirmationDialog from "../confirmationMsg"; // Import ConfirmationDialog
import { UserContext } from "../../utils/userContext"; // Assuming you have UserContext
import axios from "axios"; // Import axios for API calls

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

  // New state for tracking dropdown selections
  const [materialOption, setMaterialOption] = useState("");
  const [sizeOption, setSizeOption] = useState("");
  const [colorOption, setColorOption] = useState("");

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

  // Handle dropdown changes
  const handleMaterialChange = (e) => {
    const value = e.target.value;
    setMaterialOption(value);
    if (value !== "Others") {
      setMaterial(value);
    } else {
      setMaterial("");
    }
  };

  const handleSizeChange = (e) => {
    const value = e.target.value;
    setSizeOption(value);
    if (value !== "Others") {
      setSize(value);
    } else {
      setSize("");
    }
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    setColorOption(value);
    if (value !== "Others") {
      setColor(value);
    } else {
      setColor("");
    }
  };

  // Handle text input changes
  const handleMaterialInput = (e) => {
    setMaterial(e.target.value);
  };

  const handleSizeInput = (e) => {
    setSize(e.target.value);
  };

  const handleColorInput = (e) => {
    setColor(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
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
      alert("There was an error submitting your quotation.");
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
                color: "#fff",
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
              color: "#fff",
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
                  >
                    <option value="">Select Material</option>
                    <option value="Wool Fabric">Wool Fabric</option>
                    <option value="Cotton Fabric">Cotton Fabric</option>
                    <option value="Leather">Leather</option>
                    <option value="Denim">Denim</option>
                    <option value="Others">Others</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Others..."
                    value={material}
                    onChange={handleMaterialInput}
                    disabled={materialOption !== "Others"}
                    style={{
                      backgroundColor:
                        materialOption !== "Others" ? "#f0f0f0" : "white",
                      cursor:
                        materialOption !== "Others" ? "not-allowed" : "text",
                    }}
                  />
                </div>
              </div>
              <div className="requestInfo-form-group">
                <label>Size</label>
                <div className="requestInfo-input-group">
                  <select value={sizeOption} onChange={handleSizeChange}>
                    <option value="">Select Size</option>
                    <option value="4080 x 1000">4080 x 1000</option>
                    <option value="4080 x 1200">4080 x 1200</option>
                    <option value="4080 x 1400">4080 x 1400</option>
                    <option value="Others">Others</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Others..."
                    value={size}
                    onChange={handleSizeInput}
                    disabled={sizeOption !== "Others"}
                    style={{
                      backgroundColor:
                        sizeOption !== "Others" ? "#f0f0f0" : "white",
                      cursor: sizeOption !== "Others" ? "not-allowed" : "text",
                    }}
                  />
                </div>
              </div>
              <div className="requestInfo-form-group">
                <label>Colour</label>
                <div className="requestInfo-input-group">
                  <select value={colorOption} onChange={handleColorChange}>
                    <option value="">Select Colour</option>
                    <option value="White Grey">White Grey</option>
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                    <option value="Grey">Grey</option>
                    <option value="Others">Others</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Others..."
                    value={color}
                    onChange={handleColorInput}
                    disabled={colorOption !== "Others"}
                    style={{
                      backgroundColor:
                        colorOption !== "Others" ? "#f0f0f0" : "white",
                      cursor: colorOption !== "Others" ? "not-allowed" : "text",
                    }}
                  />
                </div>
              </div>
              <div className="requestInfo-form-group">
                <label>Customization</label>
                <textarea
                  placeholder="Add a note..."
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                ></textarea>
              </div>
              <button
                type="submit"
                className="requestInfo-submit-button"
                disabled={isLoading} // Disable button when loading
              >
                {isLoading ? "Sending..." : "SEND"} {/* Show loading state */}
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
