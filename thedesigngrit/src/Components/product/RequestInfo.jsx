import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { IoIosClose } from "react-icons/io";
import ConfirmationDialog from "../confirmationMsg"; // Import ConfirmationDialog

const RequestQuote = ({ onClose }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for the confirmation dialog
  const [isConfirmed, setIsConfirmed] = useState(false); // State for confirmation status

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsDialogOpen(true); // Open the confirmation dialog
  };

  // Handle confirmation
  const handleConfirm = () => {
    setIsConfirmed(true); // Mark as confirmed
    setIsDialogOpen(false); // Close the confirmation dialog
    // You can place the logic for form submission here, like calling an API
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

        {/* Show confirmation dialog if confirmed */}
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
                    src="/Assets/Vendors/Istkbal/istikbal-logo.png"
                    alt="Istikbal"
                    className="requestInfo-brand-logo"
                  />
                </div>
                <div className="requestInfo-brand-name">
                  <p>Get In Touch</p>
                  <h2>ISTIKBAL</h2>
                </div>
              </div>
              <div className="requestInfo-user-info">
                <p>Karim Wahba</p>
                <p>Karimwahba@gmail.com</p>
                <p>Date: 12/12/2022</p>
              </div>
            </div>
            <form className="requestInfo-form" onSubmit={handleSubmit}>
              <div className="requestInfo-form-group">
                <label>Material</label>
                <div className="requestInfo-input-group">
                  <select>
                    <option>Wool Fabric</option>
                    {/* Add more options here */}
                  </select>
                  <input type="text" placeholder="Others..." />
                </div>
              </div>
              <div className="requestInfo-form-group">
                <label>Size</label>
                <div className="requestInfo-input-group">
                  <select>
                    <option>4080 x 1000</option>
                    {/* Add more options here */}
                  </select>
                  <input type="text" placeholder="Others..." />
                </div>
              </div>
              <div className="requestInfo-form-group">
                <label>Colour</label>
                <div className="requestInfo-input-group">
                  <select>
                    <option>White Grey</option>
                    {/* Add more options here */}
                  </select>
                  <input type="text" placeholder="Others..." />
                </div>
              </div>
              <div className="requestInfo-form-group">
                <label>Customization</label>
                <textarea placeholder="Add a note..."></textarea>
              </div>
              <button type="submit" className="requestInfo-submit-button">
                SEND
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
