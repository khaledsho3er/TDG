import React, { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EditProfile from "./profilePopup/EditProfile";
import ResetPasswordPopup from "./profilePopup/resetPassowrd";
import BillingInfoPopup from "./profilePopup/billingInfo";
import ShippingInfoPopup from "./profilePopup/Shipping";
import OrdersPopUp from "./profilePopup/ordersPopup";

function ProfilePopup({ open, onClose }) {
  // State for selected tab
  const [selectedTab, setSelectedTab] = useState(0);

  // Early return if not open
  if (!open) return null;

  // Tab content for different buttons
  const tabContent = [
    { title: "Edit Profile", content: <EditProfile /> },
    {
      title: "Reset Password",
      content: <ResetPasswordPopup />,
    },
    {
      title: "Billing Information",
      content: <BillingInfoPopup />,
    },
    { title: "Orders", content: <OrdersPopUp /> },
    {
      title: "Shipping Address",
      content: <ShippingInfoPopup />,
    },
  ];

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* Close Button */}
        <button className="popup-close-button" onClick={onClose}>
          &times;
        </button>

        <div style={{ display: "flex", height: "100%", width: "100%" }}>
          {/* Left Side: Profile Form */}
          <div className="popup-left">
            <Box
              className="popup-header"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              {/* Title on the left */}
              <Typography className="popup-title">
                {tabContent[selectedTab]?.title}
              </Typography>

              {/* Avatar on the right */}
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

            {/* Content for selected tab */}
            <div className="popup-form">{tabContent[selectedTab]?.content}</div>
          </div>

          {/* Divider */}
          <div className="popup-divider"></div>

          {/* Right Side: Navigation */}
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
                onClick={() => setSelectedTab(index)} // Update selected tab
              >
                {item.icon}
                <span style={{ marginLeft: "10px" }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePopup;
