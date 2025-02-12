import React from "react";
import Header from "../Components/navBar";
import HeroAbout from "../Components/About/heroAbout";
import { Box } from "@mui/material";
import ValuesGrid from "../Components/careers/valueCards";
import CareerOpportunities from "../Components/careers/jobBorder";
import Footer from "../Components/Footer";
function careersPage() {
  return (
    <Box className="careersPage">
      <Header />
      <Box>
        <HeroAbout title="Join TDG" image={"Assets/careers.webp"} />
      </Box>
      <Box>
        <p className="Caption-careers">
          At TheDesignGrit, we’re building more than a marketplace—we’re
          building a legacy. Join a passionate team dedicated to redefining
          Egyptian design on the global stage. Together, we combine tradition
          with innovation to make a lasting impact.
        </p>
        <Box className="ourCoreValues-section-box">
          <h2 className="ourCoreValues-section">Our Core Values</h2>
          <ValuesGrid />
        </Box>
        <Box className="ourCoreValues-section-box">
          <h2 className="ourCoreValues-section">
            Explore New Career Opportunities
          </h2>
          <CareerOpportunities />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default careersPage;
