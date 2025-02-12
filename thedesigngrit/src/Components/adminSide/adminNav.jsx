import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";

const NavbarAdmin = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [requests, setRequests] = useState([]); // State for partner requests
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data (partner requests)
  const fetchRequests = async () => {
    try {
      const response = await fetch("/json/partnersRequest.json"); // Path to your requests JSON file
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(); // Fetch partner requests on mount
  }, []);

  // Toggle notification overlay visibility
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <nav className="navbar-vendor" style={{ position: "relative" }}>
      {/* Logo */}
      <div className="navbar-logo-vendor">
        <img src="/Assets/TDG_Logo_Black.webp" alt="ProjectLogo" />
      </div>

      {/* Actions */}
      <div className="navbar-actions-vendor">
        {/* Bell Icon */}
        <FaBell
          className="icon-vendor-bar"
          style={{ cursor: "pointer" }}
          onClick={toggleNotifications} // Toggle notifications on click
        />
        <select>
          <option>Admin</option>
          <option>Settings</option>
          <option>Logout</option>
        </select>
      </div>

      {/* Notification Overlay */}
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

          {/* Loading or Error */}
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}

          {/* Notification Items (Requests) */}
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

          {/* Footer */}
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
      )}
    </nav>
  );
};

export default NavbarAdmin;
