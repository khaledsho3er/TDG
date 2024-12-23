import React, { useState } from "react";
import { Box } from "@mui/material";
import ConfirmationDialog from "../confirmationMsg";

function EditProfile() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(""); // To track whether "Save" or "Cancel" is clicked

  const handleSaveClick = () => {
    setDialogAction("save");
    setDialogOpen(true); // Open the confirmation dialog
  };

  const handleCancelClick = () => {
    setDialogAction("cancel");
    setDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirm = () => {
    if (dialogAction === "save") {
      // Handle save logic
      console.log("Changes saved!");
    } else if (dialogAction === "cancel") {
      // Handle cancel logic
      console.log("Changes discarded!");
    }
    setDialogOpen(false); // Close the dialog
  };

  const handleDialogCancel = () => {
    setDialogOpen(false); // Close the dialog without taking action
  };
  return (
    <div>
      {/* Profile Form */}
      <div className="popup-form">
        <Box
          className="popup-form-firstrow"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {/* First Name Field */}
          <div className="profile-form-field" style={{ width: "48%" }}>
            <label>First Name</label>
            <input
              label="First Name"
              placeholder="Karim"
              variant="outlined"
              className="popup-form-full-width"
              fullWidth
            />
          </div>

          {/* Last Name Field */}
          <div className="profile-form-field" style={{ width: "48%" }}>
            <label>Last Name</label>
            <input
              label="Last Name"
              placeholder="Wahba"
              variant="outlined"
              className="popup-form-full-width"
              fullWidth
            />
          </div>
        </Box>

        {/* Email Field */}
        <div className="profile-form-field">
          <label>Email</label>
          <input
            label="Email"
            placeholder="Karim@gmail.com"
            variant="outlined"
            fullWidth
            className="popup-form-full-width"
          />
        </div>

        {/* Address Field
        <div className="profile-form-field">
          <label>Address</label>
          <input
            label="Address"
            placeholder="New Cairo, Egypt"
            variant="outlined"
            fullWidth
            className="popup-form-full-width"
          />
        </div> */}

        {/* Phone Number Field */}
        <div className="profile-form-field">
          <label>Phone Number</label>
          <input
            label="Phone Number"
            placeholder="+20 1020180911"
            fullWidth
            className="popup-form-full-width"
          />
        </div>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="popup-buttons">
        <button
          className="profile-popUpForm-btn-save"
          onClick={handleSaveClick}
        >
          Save
        </button>
        <button
          className="profile-popUpForm-btn-cancel"
          onClick={handleCancelClick}
        >
          Cancel
        </button>
      </div>
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title={dialogAction === "save" ? "Confirm Changes" : "Confirm Cancel"}
        content={
          dialogAction === "save"
            ? "Are you sure you want to save the changes?"
            : "Are you sure you want to cancel and discard the changes?"
        }
        onConfirm={handleConfirm}
        onCancel={handleDialogCancel}
      />
    </div>
  );
}

export default EditProfile;
