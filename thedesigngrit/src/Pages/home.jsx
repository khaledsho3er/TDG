import React from "react";
import NavBar from "../Components/navBar";
import ShopByCategory from "../Components/Category";
import { Box } from "@mui/material";
function Home() {
  return (
    <div className="home">
      <NavBar />
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
          <h2>Explore our new Concepts</h2>
        </Box>
        <Box>
          <ShopByCategory />
        </Box>
      </div>
    </div>
  );
}

export default Home;
