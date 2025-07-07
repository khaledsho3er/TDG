import React, { useState, useEffect } from "react";
import { Button } from "@mui/material"; // Import Button from Material-UI
import { useAdmin } from "../../utils/adminContext";
import { useNavigate } from "react-router-dom"; // Import useHistory for navigation

const NavbarAdmin = () => {
  const { logout } = useAdmin(); // Access admin data and logout function from context
  const navigate = useNavigate(); // Get history for navigation

  // Handle logout
  const handleLogout = () => {
    logout(); // Call logout function from context
    navigate("/admin-login"); // Redirect to login page
  };

  // Handle select change (Logout)
  const handleSelectChange = (event) => {
    if (event.target.value === "Logout") {
      handleLogout(); // Call handleLogout when "Logout" is selected
    }
  };

  return (
    <nav
      className="navbar-vendor"
      style={{ position: "relative", boxShadow: "0px 0px 0px 0px" }}
    >
      {/* Logo */}
      <div
        className="navbar-logo-vendor"
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <img src="/Assets/TDG_Logo_Black.webp" alt="ProjectLogo" />
        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
          The Design Grit
        </span>
      </div>

      {/* Actions */}
      <div className="navbar-actions-vendor">
        {/* Bell Icon */}
        {/* <select onChange={handleSelectChange}>
          <option>Admin</option>
          <option>Logout</option>
        </select> */}
        <Button
          variant="text"
          onClick={handleLogout}
          style={{
            color: "#6B7755",
            fontSize: "12px",
            fontWeight: "normal",
            fontFamily: "montserrat",
            backgroundColor: "transparent",
            border: "1px solid #6B7755",
            padding: "5px 10px",
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: "transparent",
              color: "#6B7755",
            },
          }}
        >
          Logout
        </Button>
      </div>

      {/* Notification Overlay
      {showNotifications && (
        <div
          className="notifications-overlay"
          style={{
            position: "absolute",
            top: "60px",
            right: "10px",
            width: "320px",
            backgroundColor: "#fff",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            padding: "15px",
            zIndex: 1000,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Notifications</h3>
            <button
              onClick={toggleNotifications}
              style={{
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✕
            </button>
          </div>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #ddd",
                  padding: "10px 0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "30px",
                      backgroundColor: "#fff",
                      marginRight: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <img
                      src={request.brandLogo}
                      alt={`${request.brand} Logo`}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        margin: "0",
                        fontWeight: "bold",
                        fontFamily: "montserrat",
                      }}
                    >
                      {request.brand}
                    </p>
                    <p
                      style={{
                        margin: "0",
                        color: "#666",
                        fontSize: "14px",
                        fontFamily: "montserrat",
                        width: "200px",
                      }}
                    >
                      {request.requestorName} · {request.email}
                    </p>
                  </div>
                </div>
                <button
                  style={{
                    backgroundColor: "#6B7755",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p>No new requests</p>
          )}

          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <button
              style={{
                backgroundColor: "#6B7755",
                color: "#fff",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              View All Notifications
            </button>
          </div>
        </div>
      )} */}
    </nav>
  );
};

export default NavbarAdmin;
