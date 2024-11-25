import React from "react";
import NavBar from "../Components/navBar";
import HeroAbout from "../Components/About/heroAbout";
import PartnerApplicationForm from "../Components/partnerApplication";
import { Box } from "@mui/material";
function PartnersApplication() {
  return (
    <Box className="Partner-Page">
      <NavBar />
      <Box>
        <HeroAbout
          title="Our Partners"
          subtitle="Join our network of trusted vendors and partners driving innovation and excellence in the world of furniture"
          image={"Assets/Partners.jpg"}
        />
      </Box>
      <Box className="partner-Caption">
        <p>
          At TheDesignGrit, we’re not just a platform—we’re a partner in your
          success. By joining TDG, you gain access to a marketplace designed to
          amplify your brand’s visibility, streamline operations, and connect
          you with an audience that values quality and craftsmanship.
        </p>
        <p>
          Be part of a platform that celebrates the mastery of
          <strong> Egyptian design and crafts </strong>a future where your brand
          thrives.
        </p>
      </Box>
      <Box className="partners-second-section">
        <h2 className="">Why Partner with TDG?</h2>
        <ul>
          <li>
            <strong> Expand Your Reach:</strong> Showcase your products to a
            growing audience passionate about Egyptian design.
          </li>
          <li>
            <strong> Maintain Control: </strong>Manage your brand, customer
            experience, and deliveries on your own terms.
          </li>
          <li>
            <strong> AI-Driven Insights: </strong>Understand customer behavior
            with powerful analytics tools that empower smarter business
            decisions.
          </li>
          <li>
            <strong> Seamless Operations: </strong>Simplify inventory
            management, transactions, and quotations with our integrated
            platform.
          </li>
          <li>
            <strong> Collaborative Marketing: </strong>Benefit from joint
            campaigns and targeted email marketing to boost visibility and
            sales.
          </li>
        </ul>
      </Box>
      <PartnerApplicationForm />
    </Box>
  );
}
export default PartnersApplication;
