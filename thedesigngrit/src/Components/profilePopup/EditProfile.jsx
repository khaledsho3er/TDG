import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import UpdateSentPopup from "../successMsgs/successUpdate";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate();

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
    try {
      const response = await axios.put(
        "http://localhost:5000/api/updateUser",
        userData,
        { withCredentials: true }
      );
      alert("Profile updated successfully!");
      setIsPopupVisible(true); // Show popup on successful registration
    } catch (error) {
      console.error("Error updating user data:", error.response || error);
      alert("Failed to update user data.");
    }
  };
  const closePopup = () => {
    setIsPopupVisible(false); // Close the popup
    navigate("/"); // Navigate to login page after closing popup
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

        {/* Address Field */}
        <div className="profile-form-field">
          <label>Address</label>
          <input
            name="address1"
            value={userData.address1}
            onChange={handleChange}
            placeholder="Address"
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
        <button onClick={handleUpdate} className="profile-popUpForm-btn-save">
          Save
        </button>
        <button className="profile-popUpForm-btn-cancel">Cancel</button>
      </div>
      <UpdateSentPopup show={isPopupVisible} closePopup={closePopup} />
    </div>
  );
}

export default EditProfile;
