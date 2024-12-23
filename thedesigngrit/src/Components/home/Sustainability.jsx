import React from "react";

const SustainabilitySection = () => {
  return (
    <section className="sustainability-section">
      {/* Image Container */}
      <div className="sustainability-image-container">
        <img
          src="Assets/susSection.png"
          alt="Books and coffee cup on wooden table next to grey chair"
          className="sustainability-image"
        />
      </div>

      {/* Content Container */}
      <div className="sustainability-content-container">
        <div className="sustainability-content-wrapper">
          <span className="sustainability-label">Sustainability</span>

          <h2 className="sustainability-heading">What is TDG ?</h2>

          <p className="sustainability-description">
            TheDesignGrit is here to spotlight Egyptian design. We’re giving
            local brands the platform they deserve, connecting their
            craftsmanship with those who value it most. It’s about honoring
            tradition, celebrating innovation, and helping you discover pieces
            that make you feel most at home.
          </p>

          <button className="sustainability-button">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
