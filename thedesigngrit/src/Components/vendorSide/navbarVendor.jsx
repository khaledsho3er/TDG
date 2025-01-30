import React, { useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useVendor } from "../../utils/vendorContext"; // Adjust the import path
import NotificationOverlayVendor from "./notificationOverlay";

const NavbarVendor = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // State for overlay
  const { logout } = useVendor(); // Use logout from context
  const navigate = useNavigate(); // Initialize navigate

  // Toggle the overlay visibility
  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call the backend logout API
      const response = await fetch("http://localhost:5000/api/vendors/logout", {
        method: "POST",
        credentials: "include", // Include credentials for session handling
      });

      if (response.ok) {
        console.log("Logout successful");
        logout(); // Clear vendor context
        navigate("/signin-vendor"); // Redirect to signin page
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="navbar-vendor">
      <div className="navbar-logo-vendor">
        <img src="/Assets/PartnersLogos/ArtHouseLogo.png" alt="Vendor Logo" />
      </div>
      <div className="navbar-actions-vendor">
        <FaSearch className="icon-vendor-bar" />
        <FaBell className="icon-vendor-bar" onClick={toggleOverlay} />{" "}
        {/* Bell icon click handler */}
        <select onChange={(e) => e.target.value === "Logout" && handleLogout()}>
          <option>Manager</option>
          <option>Settings</option>
          <option>Logout</option>
        </select>
      </div>

      {/* Include the Notification Overlay */}
      {isOverlayOpen && <NotificationOverlayVendor onClose={toggleOverlay} />}
    </nav>
  );
};

export default NavbarVendor;
