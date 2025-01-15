import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
// import UpdateSentPopup from "../successMsgs/successUpdate";
import ConfirmationDialog from "../confirmationMsg";

function EditProfile() {
  const [setIsPopupVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(""); // To track whether "Save" or "Cancel" is clicked

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    phoneNumber: "",
  });

  useEffect(() => {
    // Fetch user data
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getUser", {
          withCredentials: true,
        });
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
    // try {
    //   const response = await axios.put(
    //     "http://localhost:5000/api/updateUser",
    //     userData,
    //     { withCredentials: true }
    //   );

    // } catch (error) {
    //   console.error("Error updating user data:", error.response || error);
    //   alert("Failed to update user data.");
    // }

    setDialogOpen(true); // Open the confirmation dialog
    setIsPopupVisible(true); // Show popup on successful registration
    setDialogAction("save");
  };
  // const closePopup = () => {
  //   setIsPopupVisible(false); // Close the popup
  //   navigate("/"); // Navigate to login page after closing popup
  // };
  const handleCancelClick = () => {
    setDialogAction("cancel");
    setDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirm = async () => {
    if (dialogAction === "save") {
      try {
        const response = await axios.put(
          "http://localhost:5000/api/updateUser",
          userData,
          { withCredentials: true }
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error updating user data:", error.response || error);
        alert("Failed to update user data.");
      }
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
      </div>

      {/* Save and Cancel Buttons */}
      <div className="popup-buttons">
        {/*<UpdateSentPopup show={isPopupVisible} closePopup={closePopup} />*/}

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
      <></>
    </div>
  );
}

export default EditProfile;
