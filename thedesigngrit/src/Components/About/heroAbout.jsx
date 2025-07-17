import React from "react";

const HeroAbout = ({ title, subtitle, image }) => {
  return (
    <div className="hero-container">
      <div className="hero-text">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
      </div>
      <div className="hero-section-image">
        <img src={image} alt={title} />
      </div>
    </div>
  );
};

export default HeroAbout;
