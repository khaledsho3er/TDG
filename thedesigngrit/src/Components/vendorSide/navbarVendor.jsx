import React, { useState, useEffect } from "react";
// import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useVendor } from "../../utils/vendorContext"; // Adjust the import path
import NotificationOverlayVendor from "./notificationOverlay";
import ConfirmationDialog from "../confirmationMsg";

const NavbarVendor = ({ setActivePage }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [brandData, setBrandData] = useState(null); // State for brand data
  const { vendor, logout } = useVendor(); // Access vendor and logout from context
  const navigate = useNavigate();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  console.log("Vendor Data:", vendor); // Log vendor data for debugging
  // Fetch brand data based on vendor.brandId
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/brand/${vendor.brandId}`, // Replace with your backend endpoint
          {
            method: "GET",
            credentials: "include", // Include credentials for session handling
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBrandData(data); // Store the fetched brand data
        } else {
          console.error("Failed to fetch brand data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    if (vendor?.brandId) {
      fetchBrandData(); // Call the fetch function if brandId exists
    }
  }, [vendor]);

  // Toggle the overlay visibility
  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  // Handle logout
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
        console.log("Logout successful");
        logout();
        navigate("/signin-vendor");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLogoutConfirm = async () => {
    setLogoutConfirmOpen(false);
    await handleLogout();
  };

  const handleLogoutCancel = () => {
    setLogoutConfirmOpen(false);
  };

  return (
    <nav className="navbar-vendor">
      <div
        className="navbar-logo-vendor"
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <img
          src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${brandData?.brandlogo}`}
          alt="Vendor Logo"
          style={{ width: "50px", height: "50px", borderRadius: "14%" }}
        />
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
          {brandData?.brandName}
        </span>
      </div>
      <div
        className="navbar-actions-vendor"
        style={{ display: "flex", alignItems: "center", gap: "16px" }}
      >
        <span style={{ fontSize: "16px" }}>
          Welcome, {vendor?.firstName || "Vendor"}
        </span>
        {/* <FaBell className="icon-vendor-bar" onClick={toggleOverlay} /> */}
        <select
          onChange={(e) => {
            if (e.target.value === "Logout") setLogoutConfirmOpen(true);
          }}
        >
          <option>Profile</option>
          <option>Logout</option>
        </select>
        {isOverlayOpen && (
          <NotificationOverlayVendor
            onClose={toggleOverlay}
            setActivePage={setActivePage}
          />
        )}
      </div>
      <ConfirmationDialog
        open={logoutConfirmOpen}
        title="Confirm Logout"
        content="Are you sure you want to logout?"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </nav>
  );
};

export default NavbarVendor;
