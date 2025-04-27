import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import ConfirmationDialog from "../confirmationMsg";

function EditProfile() {
  const [IsPopupVisible, setIsPopupVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(""); // To track whether "Save" or "Cancel" is clicked

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    phoneNumber: "",
    gender: "", // Add gender
    dateOfBirth: "", // Add date of birth
  });

  useEffect(() => {
    // Fetch user data
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.thedesigngrit.com/api/getUser",
          {
            withCredentials: true,
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.response || error);
        alert("Failed to fetch user data.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpdate = async () => {
    console.log(IsPopupVisible);
    setDialogOpen(true); // Open the confirmation dialog
    setIsPopupVisible(true); // Show popup on successful registration
    setDialogAction("save");
  };

  const handleCancelClick = () => {
    setDialogAction("cancel");
    setDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirm = async () => {
    if (dialogAction === "save") {
      try {
        const response = await axios.put(
          "https://api.thedesigngrit.com/api/updateUser",
          userData,
          { withCredentials: true }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error updating user data:", error.response || error);
        alert("Failed to update user data.");
      }
      console.log("Changes saved!");
    } else if (dialogAction === "cancel") {
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
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="popup-form-full-width"
              fullWidth
            />
          </div>

          {/* Last Name Field */}
          <div className="profile-form-field" style={{ width: "48%" }}>
            <label>Last Name</label>
            <input
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="popup-form-full-width"
              fullWidth
            />
          </div>
        </Box>

        {/* Email Field */}
        <div className="profile-form-field">
          <label>Email</label>
          <input
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Email"
            className="popup-form-full-width"
            fullWidth
          />
        </div>

        {/* Phone Number Field */}
        <div className="profile-form-field">
          <label>Phone Number</label>
          <input
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="popup-form-full-width"
            fullWidth
          />
        </div>

        {/* Gender and Date of Birth in a Row */}
        <Box
          className="popup-form-gender-dob"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "10px",
          }}
        >
          {/* Gender Field */}
          <div className="profile-form-field" style={{ width: "48%" }}>
            <label>Gender</label>
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              className="popup-form-full-width"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Date of Birth Field */}
          <div className="profile-form-field" style={{ width: "48%" }}>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={userData.dateOfBirth}
              onChange={handleChange}
              className="popup-form-full-width"
            />
          </div>
        </Box>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="popup-buttons">
        <button className="profile-popUpForm-btn-save" onClick={handleUpdate}>
          Update
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
