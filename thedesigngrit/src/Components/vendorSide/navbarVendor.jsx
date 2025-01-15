import React, { useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import NotificationOverlayVendor from "./notificationOverlay";
const NavbarVendor = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // State for overlay

  // Toggle the overlay visibility
  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
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
        <select>
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
