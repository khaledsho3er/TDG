import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVendor } from "../../utils/vendorContext";
import NotificationOverlayVendor from "./notificationOverlay";
import { FaBars, FaTimes } from "react-icons/fa";

const NavbarVendor = ({ setActivePage }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Hamburger toggle
  const [brandData, setBrandData] = useState(null);
  const { vendor, logout } = useVendor();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/brand/${vendor.brandId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setBrandData(data);
        } else {
          console.error("Failed to fetch brand data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    if (vendor?.brandId) {
      fetchBrandData();
    }
  }, [vendor]);

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://api.thedesigngrit.com/api/vendors/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        logout();
        navigate("/signin-vendor");
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
        <img
          src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${brandData?.brandlogo}`}
          alt="Vendor Logo"
        />
      </div>

      {/* Hamburger icon for small screens */}
      <div
        className="hamburger-icon"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Menu */}
      <div className={`navbar-actions-vendor ${isMenuOpen ? "open" : ""}`}>
        <select onChange={(e) => e.target.value === "Logout" && handleLogout()}>
          <option>Profile</option>
          <option>Logout</option>
        </select>

        {/* Uncomment when notification is needed */}
        {/* <FaBell className="icon-vendor-bar" onClick={toggleOverlay} /> */}

        {isOverlayOpen && (
          <NotificationOverlayVendor
            onClose={toggleOverlay}
            setActivePage={setActivePage}
          />
        )}
      </div>
    </nav>
  );
};

export default NavbarVendor;
