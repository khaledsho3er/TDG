import React from "react";

const HeroAbout = ({ title, subtitle, image, variant }) => {
  // Modern hero style for about/partners
  if (variant === "about" || variant === "partners") {
    return (
      <div
        style={{
          width: "100%",
          background: "#6B7B58",
          borderRadius: "0 0 32px 32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 0",
          gap: 0,
          minHeight: 320,
          maxWidth: "1100px",
          margin: "auto",
          padding: "77px",
          borderRadius: "15px",
          marginTop: "25px",
        }}
        className="hero-container hero-about-variant"
      >
        <div
          style={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingLeft: 48,
            paddingRight: 24,
          }}
          className="hero-text"
        >
          <h1
            style={{
              fontFamily: "Horizon",
              fontWeight: "bold",
              fontSize: 44,
              color: "#EFEBE8",
              marginBottom: 16,
              marginTop: 0,
              letterSpacing: 1,
            }}
            className="hero-title"
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: "Montserrat",
              fontSize: 20,
              color: "#EFEBE8",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 600,
            }}
            className="hero-subtitle"
          >
            {subtitle}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: 48,
          }}
          className="hero-section-image"
        >
          <img
            src={image}
            alt={title}
            style={{
              width: "100%",
              maxWidth: 320,
              borderRadius: 24,
              boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
              objectFit: "cover",
            }}
          />
        </div>
        {/* Responsive: stack on mobile */}
        <style>{`
          @media (max-width: 900px) {
            .hero-about-variant {
              flex-direction: column !important;
              padding: 32px 0 !important;
            }
            .hero-about-variant .hero-text {
              padding-left: 24px !important;
              padding-right: 24px !important;
              align-items: center !important;
              text-align: center !important;
            }
            .hero-about-variant .hero-section-image {
              padding-right: 0 !important;
              margin-top: 24px !important;
            }
          }
        `}</style>
      </div>
    );
  }
  // Default fallback
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
