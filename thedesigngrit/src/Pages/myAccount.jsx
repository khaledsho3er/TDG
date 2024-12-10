import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../Components/navBar";
import Profile from "../Components/account/profile";
const MyAccount = () => {
  const [selectedSection, setSelectedSection] = useState("profile");
  const sections = {
    profile: <Profile />,
    orders: "orders",
    wishlist: "wishlist",
    settings: "settings",
    logout: "Logout",
  };
  return (
    <Box>
      <Header />
      <Box>
        <div className="hero-job-container">
          <div className="hero-text">
            <h1 className="hero-title">Hey, Karim wahba</h1>
          </div>
        </div>
        <div className="terms-container">
          {/* Sidebar */}
          <div className="sidebar">
            {Object.keys(sections).map((section) => (
              <button
                key={section}
                className={`sidebar-item ${
                  selectedSection === section ? "active" : ""
                }`}
                onClick={() => setSelectedSection(section)}
              >
                {section}
              </button>
            ))}
          </div>
          <div className="divider"></div>

          {/* Content Section */}
          <div className="content">{sections[selectedSection]}</div>
        </div>
      </Box>
    </Box>
  );
};

export default MyAccount;
