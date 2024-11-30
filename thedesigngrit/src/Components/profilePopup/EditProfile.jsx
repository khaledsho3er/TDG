import React from "react";
import { Box } from "@mui/material";

function EditProfile() {
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

        {/* Address Field */}
        <div className="profile-form-field">
          <label>Address</label>
          <input
            label="Address"
            placeholder="New Cairo, Egypt"
            variant="outlined"
            fullWidth
            className="popup-form-full-width"
          />
        </div>

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
        <button className="profile-popUpForm-btn-save">Save</button>
        <button className="profile-popUpForm-btn-cancel">Cancel</button>
      </div>
    </div>
  );
}

export default EditProfile;
