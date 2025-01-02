import React from "react";
import Header from "../Components/navBar";
import HeroAbout from "../Components/About/heroAbout";
import { Box } from "@mui/material";
import ValuesGrid from "../Components/careers/valueCards";
import CareerOpportunities from "../Components/careers/jobBorder";
import Footer from "../Components/Footer";
function careersPage() {
  return (
    // Add a return statement to render the JSX
    <Box className="careersPage">
      <Header />
      <Box>
        <HeroAbout title="Join TDG" image={"Assets/careers.jpg"} />
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
        {/* <Box className="Inside-TDG-section">
          <h2 className="ourCoreValues-section">Inside TDG</h2>
          <p className="Captions-Inside-TDG">
            Working at TheDesignGrit means being part of a dynamic,
            collaborative environment where creativity and determination drive
            success. You’ll have the opportunity to grow, innovate, and make a
            meaningful impact in an industry rich with history and potential.
          </p>
          <Box className="insideTDG-content-benefits">
            <Box className="insideTDG-benefits">
              <h4>Benefits</h4>
              <p>
                Enjoy a comprehensive suite of benefits designed to support your
                well-being, growth, and work-life balance
              </p>
            </Box>
            <Box className="insideTDG-benefits-img">
              <img src="Assets/inside1.png" alt="benefits" />
            </Box>
          </Box>
          <Box className="insideTDG-content-environment">
            <Box className="insideTDG-environment-img">
              <img src="Assets/inside2.jpeg" alt="environment" />
            </Box>
            <Box className="insideTDG-environment">
              <h4>
                collaborative
                <br /> environment
              </h4>
              <p>
                Be part of a team where ideas flow freely, creativity thrives,
                and collaboration drives success.
              </p>
            </Box>
          </Box>
          <Box className="insideTDG-content-benefits">
            <Box className="insideTDG-benefits">
              <h4>opportunity to grow</h4>
              <p>
                Unlock your potential with opportunities to learn, innovate, and
                shape your career in meaningful ways.
              </p>
            </Box>
            <Box className="insideTDG-benefits-img">
              <img src="Assets/inside3.jpeg" alt="benefits" />
            </Box>
          </Box>
        </Box> */}
      </Box>
      <Footer />
    </Box>
  );
}

export default careersPage;
