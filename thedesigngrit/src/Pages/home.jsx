import React, { useState, useEffect } from "react";
import Header from "../Components/navBar";
import ShopByCategory from "../Components/home/Category";
import ExploreConcepts from "../Components/home/concept";
import SustainabilitySection from "../Components/home/Sustainability";
import { Box } from "@mui/material";
import PartnersSection from "../Components/home/partners";
import ProductSlider from "../Components/home/bestSeller";
import Footer from "../Components/Footer";
function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      imgSrc: "/Assets/homehero/Herohome1.png",
      title: "Effortless Discovery",
      text: "Explore Egypt’s top furniture and décor brands in one place. Browse, compare, and customize your selections—we’ll handle the rest.",
    },
    {
      id: 2,
      imgSrc: "/Assets/homehero/Herohome2.png",
      title: "Need to see it in person?",
      text: "Plan your visit effortlessly with our View in Store option. Prepare your payment andaddress for a seamless experience, then see it up close.",
    },
    {
      id: 3,
      imgSrc: "/Assets/homehero/Herohome3.png",
      title: "Design your Vision",
      text: "Use our moodboards to craft your aesthetic",
      text2: "Explore products in stunning detail with downloadable 3D files",
    },
  ];

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 10000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [slides.length]);

  return (
    <div className="home">
      <Header />
      <div className="hero-home-section">
        <div
          className="hero-slider"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div className="hero-slide" key={index}>
              <img
                className="hero-image"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
              <div className="hero-text-overlay">
                <h1>{slide.title}</h1>
                <p>{slide.text}</p>
                <p>{slide.text2}</p>
                <button className="btn-hero-section">Learn More</button>
              </div>
            </div>
          ))}
        </div>
        <div className="slider-navigation">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`slider-dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => handleSlideChange(index)}
            ></div>
          ))}
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

      {/*Footer*/}
      <Box>
        <Footer />
      </Box>
    </div>
  );
}

export default Home;
