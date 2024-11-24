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

          <h2 className="sustainability-heading">
            Everything we make,
            <br />
            we can unmake.
          </h2>

          <p className="sustainability-description">
            Because we're committed to the circular economy. This means products
            and materials keep circulating in supply chains, for as long as
            possible.
          </p>

          <button className="sustainability-button">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
