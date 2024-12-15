import React from "react";
import { Box, Avatar } from "@mui/material";

function Profile() {
  return (
    <Box className="Profile-side">
      <h1>Personal Information</h1>
      <Box className="profile-info">
        <Box className="profile-info-first">
          <p>Name</p>
          <p>Karim Wahba</p>
          <p>Date of Birth</p>
          <p>Not Specified</p>
          <p>Gender</p>
          <p>Not Specified</p>
        </Box>
        <Box
          className="popup-avatar-section"
          style={{
            justifyContent: "flex-start",
          }}
        >
          <Avatar
            src="/Assets/founder.jpg"
            alt="User Avatar"
            className="popup-avatar"
          />
        </Box>
      </Box>
      <Box className="profile-info-second">
        <Box className="profile-info-second-left">
          <p>Email:</p>
          <p>Karim@gmail.com</p>
          <p>Phone Number:</p>
          <p>0120124651</p>
        </Box>
        <Box className="profile-info-second-right">
          <p>Address:</p>
          <p>New Cairo, Egypt</p>
          <p>Name:</p>
          <p>New Cairo, Egypt</p>
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
