import React, { useContext, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from "@mui/icons-material/Logout"; // Add Logout icon
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { UserContext } from "../utils/userContext"; // Import the UserContext
import EditProfile from "./profilePopup/EditProfile";
import ResetPasswordPopup from "./profilePopup/resetPassowrd";
import BillingInfoPopup from "./profilePopup/billingInfo";
import ShippingInfoPopup from "./profilePopup/Shipping";
import OrdersPopUp from "./profilePopup/ordersPopup";

function ProfilePopup({ open, onClose }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const { setUserSession } = useContext(UserContext); // Access context to manage user session
  const navigate = useNavigate(); // For navigation

  if (!open) return null;

  const handleLogout = () => {
    setUserSession(null); // Clear user session from context
    localStorage.removeItem("userSession"); // Remove session from localStorage
    navigate("/login"); // Redirect to the sign-in page
    onClose(); // Close the popup
  };

  const tabContent = [
    { title: "Edit Profile", content: <EditProfile /> },
    { title: "Reset Password", content: <ResetPasswordPopup /> },
    { title: "Billing Information", content: <BillingInfoPopup /> },
    { title: "Orders", content: <OrdersPopUp /> },
    { title: "Shipping Address", content: <ShippingInfoPopup /> },
  ];

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* Close Button */}
        <button className="popup-close-button" onClick={onClose}>
          &times;
        </button>

        <div style={{ display: "flex", height: "100%", width: "100%" }}>
          {/* Left Side */}
          <div className="popup-left">
            <Box
              className="popup-header"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography className="popup-title">
                {tabContent[selectedTab]?.title}
              </Typography>
              <Box
                className="popup-avatar-section"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Avatar
                  src="/Assets/founder.jpg"
                  alt="User Avatar"
                  className="popup-avatar"
                />
              </Box>
            </Box>

            <div className="popup-form">{tabContent[selectedTab]?.content}</div>
          </div>

          {/* Divider */}
          <div className="popup-divider"></div>

          {/* Right Side */}
          <div className="popup-right">
            {[
              { icon: <PersonIcon />, label: "Edit Profile" },
              { icon: <LockIcon />, label: "Reset Password" },
              { icon: <CreditCardIcon />, label: "Billing Information" },
              { icon: <InventoryIcon />, label: "Orders" },
              { icon: <LocalShippingIcon />, label: "Shipping Address" },
            ].map((item, index) => (
              <button
                key={index}
                className={`popup-right-button ${
                  selectedTab === index ? "selected" : ""
                }`}
                onClick={() => setSelectedTab(index)}
              >
                {item.icon}
                <span style={{ marginLeft: "10px" }}>{item.label}</span>
              </button>
            ))}

            {/* Logout Button */}
            <button
              className="popup-right-button logout-button"
              onClick={handleLogout}
              style={{ color: "red" }} // Optional styling for logout
            >
              <LogoutIcon />
              <span style={{ marginLeft: "10px" }}>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePopup;
