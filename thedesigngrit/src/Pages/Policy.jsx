import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import NavBar from "../Components/navBar";
import HeroAbout from "../Components/About/heroAbout";
import Footer from "../Components/Footer";

function CustomerPolicy() {
  const [selectedSection, setSelectedSection] = useState(
    "Full Terms of Service Agreement"
  );
  const [policyData, setPolicyData] = useState([]);

  useEffect(() => {
    // Fetch policy data from backend (assuming an API route like "/api/policies")
    const fetchPolicyData = async () => {
      try {
        const response = await fetch(
          "https://tdg-db.onrender.com/api/policies/policies"
        );
        const data = await response.json();
        setPolicyData(data);
      } catch (error) {
        console.error("Error fetching policy data:", error);
      }
    };

    fetchPolicyData();
  }, []);

  if (!policyData.length) return <div>Loading...</div>;

  // Find the selected policy's content dynamically
  const selectedPolicy = policyData.find(
    (policy) => policy.type === selectedSection
  );

  return (
    <Box className="policy-page">
      <NavBar />
      <Box>
        <HeroAbout
          title="Our Customer Policies"
          subtitle="Explore our policies to learn how we ensure a secure and seamless shopping experience at The Design Grit (TDG)."
          image={"Assets/PolicyHero.png"}
        />
      </Box>
      <div className="terms-container">
        {/* Sidebar */}
        <div className="sidebar">
          {policyData.map((policy) => (
            <button
              key={policy.type}
              className={`sidebar-item ${
                selectedSection === policy.type ? "active" : ""
              }`}
              onClick={() => setSelectedSection(policy.type)}
            >
              {policy.type}
            </button>
          ))}
        </div>
        <div className="divider"></div>

        {/* Content Section */}
        <div className="content">
          {selectedPolicy?.subtitles?.map((subtitle, idx) => (
            <div key={idx}>
              <h2>{subtitle.title}</h2>
              <p>{subtitle.content}</p>
              {subtitle.subSubsections?.map((subsub, ssIdx) => (
                <div key={ssIdx}>
                  <h3>{subsub.title}</h3>
                  <p>{subsub.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </Box>
  );
}

export default CustomerPolicy;
