import React from "react";

const PartnersSection = () => {
  const partners = [
    {
      name: "Art House",
      logo: "Assets/PartnersLogos/ArtHouseLogo.webp",
      link: "https://arthouse.com",
    },
    {
      name: "Innovo",
      logo: "Assets/PartnersLogos/InnovoLogo.webp",
      link: "https://innovo.com",
    },
    {
      name: "Burotime",
      logo: "Assets/PartnersLogos/BurotimeLogo.webp",
      link: "https://burotime.com",
    },
    {
      name: "Bloom Paris",
      logo: "Assets/PartnersLogos/BloonLogo.webp",
      link: "https://bloon-paris.com",
    },
    {
      name: "Istikbal",
      logo: "Assets/PartnersLogos/istikbal.webp",
      link: "https://istikbal.com",
    },
    {
      name: "Qabani",
      logo: "Assets/PartnersLogos/kabani.webp",
      link: "https://qabani.com",
    },
  ];

  return (
    <section className="partners-section">
      <div className="partners-content">
        <h1 className="partners-heading" style={{ textAlign: "left" }}>
          All Brands
        </h1>

        <p className="partners-description">
          Explore the heart of TheDesignGrit—our brands. They are the foundation
          of our mission, each bringing unique artistry and unmatched quality to
          the platform.By showcasing the secreators, we’re building a collective
          that empowers local talent and delivers authentic Egyptian crafts
          manshipto your home.
        </p>

        <button className="partners-button">Shop all</button>
      </div>

      <div className="partners-logo-grid">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.link}
            className="partner-logo-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={partner.logo}
              alt={`${partner.name} logo`}
              className="partner-logo"
              style={{ width: "100%", height: "100%" }}
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default PartnersSection;
