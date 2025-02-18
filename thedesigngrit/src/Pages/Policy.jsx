import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import NavBar from "../Components/navBar";
import HeroAbout from "../Components/About/heroAbout";
import Footer from "../Components/Footer";
import LoadingScreen from "./loadingScreen";

function CustomerPolicy() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSection = decodeURIComponent(
    queryParams.get("section") || "Full Terms of Service Agreement"
  );

  const [selectedSection, setSelectedSection] = useState(initialSection);
  const [policyData, setPolicyData] = useState([]);

  useEffect(() => {
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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sectionFromURL = queryParams.get("section");
    if (sectionFromURL) {
      setSelectedSection(sectionFromURL);
    }
  }, [location.search]);

  if (!policyData.length)
    return (
      <div>
        <LoadingScreen />
      </div>
    );

  const normalize = (str) => str?.trim().toLowerCase();

  const selectedPolicy = policyData.find(
    (policy) => normalize(policy.type) === normalize(selectedSection)
  );

  return (
    <Box className="policy-page">
      <NavBar />
      <Box>
        <HeroAbout
          title="Our Customer Policies"
          subtitle="Explore our policies to learn how we ensure a secure and seamless shopping experience at The Design Grit (TDG)."
          image={"Assets/PolicyHero.webp"}
        />
      </Box>
      <div className="terms-container">
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
