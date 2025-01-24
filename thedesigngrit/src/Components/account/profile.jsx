import React, { useState, useEffect } from "react";
import { Box, Avatar, TextField } from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import ConfirmationDialog from "../confirmationMsg";

function Profile({ userData }) {
  // const [popupOpen, setPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Toggle between text and form
  const [formData, setFormData] = useState({});

  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog
  const [dialogAction, setDialogAction] = useState(""); // Action for dialog

  // Sync formData with userData when userData changes or edit mode is toggled
  useEffect(() => {
    if (!isEditing) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        dateOfBirth: userData.dateOfBirth || "",
        gender: userData.gender || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        address1: userData.address1 || "",
      });
    }
  }, [userData, isEditing]);

  // const handlePopupToggle = () => {
  //   setPopupOpen(!popupOpen);
  // };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirm = async () => {
    if (dialogAction === "save") {
      try {
        const response = await axios.put(
          "http://localhost:5000/api/updateUser",
          formData, // Use the updated formData here
          { withCredentials: true }
        );
        console.log(response.data);
        alert("User data updated successfully!");
        setIsEditing(false); // Switch to text display after save
      } catch (error) {
        console.error("Error updating user data:", error.response || error);
        alert("Failed to update user data.");
      }
    } else if (dialogAction === "cancel") {
      console.log("Changes discarded!");
      setIsEditing(false); // Switch to text display after cancel
    }
    setDialogOpen(false); // Close the dialog
  };

  const handleDialogCancel = () => {
    setDialogOpen(false); // Close dialog without action
  };

  const handleSave = () => {
    setDialogAction("save"); // Set action to save
    setDialogOpen(true); // Open the dialog to confirm save
  };

  const handleCancel = () => {
    setDialogAction("cancel"); // Set action to cancel
    setDialogOpen(true); // Open the dialog to confirm cancel
  };

  return (
    <Box className="Profile-side">
      <h1>Personal Information</h1>
      <Box className="profile-info">
        <Box className="profile-info-first">
          <p>Name</p>
          {isEditing ? (
            <div>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          ) : (
            <p>
              {`${userData.firstName} ${userData.lastName}` || "Not Specified"}
            </p>
          )}

          <p>Date of Birth</p>
          {isEditing ? (
            <TextField
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={
                formData.dateOfBirth
                  ? format(new Date(formData.dateOfBirth), "yyyy-MM-dd")
                  : ""
              }
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          ) : (
            <p>
              {userData.dateOfBirth
                ? format(new Date(userData.dateOfBirth), "yyyy-MM-dd")
                : "Not Specified"}
            </p>
          )}

          <p>Gender</p>
          {isEditing ? (
            <TextField
              name="gender"
              label="Gender"
              value={formData.gender}
              onChange={handleChange}
            />
          ) : (
            <p>{userData.gender || "Not Specified"}</p>
          )}
        </Box>
        <Box
          className="popup-avatar-section"
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: "140px",
          }}
        >
          <Avatar
            src="/Assets/founder.jpg"
            alt="User Avatar"
            className="popup-avatar"
          />
          <button
            style={{
              cursor: "pointer",
              backgroundColor: "transparent",
              color: "#2d2d2d",
              textDecoration: "underline",
            }}
            onClick={handleEditToggle}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </Box>
      </Box>
      <Box className="profile-info-second">
        <Box className="profile-info-second-left">
          <p>Email:</p>
          {isEditing ? (
            <TextField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
            />
          ) : (
            <p>{userData.email || "Not Specified"}</p>
          )}
          <p>Phone Number:</p>
          {isEditing ? (
            <TextField
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          ) : (
            <p>{userData.phoneNumber || "Not Specified"}</p>
          )}
        </Box>
        <Box className="profile-info-second-right">
          <p>Address:</p>
          {isEditing ? (
            <TextField
              name="address1"
              label="Address"
              value={formData.address1}
              onChange={handleChange}
            />
          ) : (
            <p>{userData.address1 || "Not Specified"}</p>
          )}
        </Box>
      </Box>
      {isEditing && (
        <Box
          className="popup-buttons"
          sx={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button className="profile-popUpForm-btn-save " onClick={handleSave}>
            Save Changes
          </button>
          <button
            className="profile-popUpForm-btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </Box>
      )}
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
    </Box>
  );
}

export default Profile;
