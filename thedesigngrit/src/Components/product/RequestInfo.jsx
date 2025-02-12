import React, { useState, useContext } from "react";
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsDialogOpen(true); // Open the confirmation dialog
  };

  // Handle confirmation
  const handleConfirm = async () => {
    setIsLoading(true); // Start loading spinner

    try {
      const response = await axios.post(
        "https://tdg-db.onrender.com/api/quotation/create",
        {
          userId: userSession.id, // Assuming userSession contains the logged-in user's data
          brandId: productId.brandId._id, // Assuming product contains the brandId
          productId: productId._id, // Assuming product contains the product ID
          material: material,
          size: size,
          color: color,
          customization: customization,
        }
      );

      console.log("Quotation sent successfully:", response.data);
      setIsConfirmed(true); // Set confirmation state after success
      setIsDialogOpen(false); // Open the confirmation dialog
    } catch (error) {
      console.error("Error submitting quotation:", error);
      alert("There was an error submitting your quotation.");
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsDialogOpen(false); // Close the confirmation dialog
  };

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
            <IoIosClose size={30} />
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
                  <img
                    src={`https://tdg-db.onrender.com/uploads/${productId.brandId.brandlogo}`}
                    alt="Istikbal"
                    className="requestInfo-brand-logo"
                  />
                </div>
                <div className="requestInfo-brand-name">
                  <p>Get In Touch</p>
                  <h2>{productId.brandId.brandName}</h2>
                  {/* Display brand name dynamically */}
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
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  >
                    <option>Wool Fabric</option>
                    <option>Cotton Fabric</option>
                    <option>Leather</option>
                    <option>Denim</option>
                    {/* Add more options here */}
                  </select>
                  <input
                    type="text"
                    placeholder="Others..."
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  />
                </div>
              </div>
              <div className="requestInfo-form-group">
                <label>Size</label>
                <div className="requestInfo-input-group">
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  >
                    <option>4080 x 1000</option>
                    <option>4080 x 1200</option>
                    <option>4080 x 1400</option>
                    {/* Add more options here */}
                  </select>
                  <input
                    type="text"
                    placeholder="Others..."
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  />
                </div>
              </div>
              <div className="requestInfo-form-group">
                <label>Colour</label>
                <div className="requestInfo-input-group">
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    <option>White Grey</option>
                    <option>White</option>
                    <option>Black</option>
                    <option>Grey</option>
                    {/* Add more options here */}
                  </select>
                  <input
                    type="text"
                    placeholder="Others..."
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
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
