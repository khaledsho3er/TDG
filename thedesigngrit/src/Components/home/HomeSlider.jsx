import React from "react";
import Slider from "react-slick";

function HomeSlider() {
  const sliderSettings = {
    dots: true, // Enable dots for navigation
    infinite: true,
    speed: 1000, // Transition speed (ms)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Auto-slide functionality
    autoplaySpeed: 5000, // Time between slides (ms)
    arrows: true, // Hide next/prev buttons
  };

  const slides = [
    {
      image: "Assets/Herohome.png",
      title: "Effortless Discovery",
      description:
        "Explore Egypt’s top furniture and décor brands in one place. Browse, compare, and customize your selections—we’ll handle the rest.",
    },
    {
      image: "Assets/Herohome.png",
      title: "Innovative Designs",
      description:
        "Discover new trends and timeless pieces from renowned designers across Egypt.",
    },
    {
      image: "Assets/Herohome.png",
      title: "Your Dream Space",
      description:
        "From ideas to execution, create a space that truly feels like home.",
    },
  ];

  return (
    <div className="home">
      <Slider {...sliderSettings}>
        {slides.map((slide, index) => (
          <div key={index} className="hero-slide">
            <div className="hero-home-section">
              <img className="hero-image" src={slide.image} alt={slide.title} />
              <div className="hero-text-overlay">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <button className="btn-hero-section">Learn More</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HomeSlider;
