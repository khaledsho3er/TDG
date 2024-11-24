import React from "react";
import Header from "../Components/navBar";
import ShopByCategory from "../Components/home/Category";
import ExploreConcepts from "../Components/home/concept";
import SustainabilitySection from "../Components/home/Sustainability";
import { Box } from "@mui/material";
import PartnersSection from "../Components/home/partners";
import ProductSlider from "../Components/home/bestSeller";
function Home() {
  return (
    <div className="home">
      <Header />
      <div className="hero-home-section">
        <img
          className="hero-image"
          src="Assets/Herohome.png"
          alt="Hero Section"
        />
        <div className="hero-text-overlay">
          <h1>
            Effortless <br></br>Discovery
          </h1>
          <p>
            Explore Egypt’s top furniture and décor brands in one place. Browse,
            compare, and customize your selections—we’ll handle the rest.
          </p>
          <button className="btn-hero-section">Learn More</button>
        </div>
      </div>
      <div className="concept-section">
        <Box className="concept-title">
          <ExploreConcepts />
        </Box>
      </div>

      {/*Category section*/}
      <Box>
        <ShopByCategory />
      </Box>

      {/*best seller products section*/}
      <Box>
        <ProductSlider />
      </Box>

      {/*Sustainability section*/}
      <Box>
        <SustainabilitySection />
      </Box>

      {/*Vendor section*/}
      <Box>
        <PartnersSection />
      </Box>
    </div>
  );
}

export default Home;
