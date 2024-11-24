import React from "react";

const PartnersSection = () => {
  const partners = [
    {
      name: "Art House",
      logo: "Assets/PartnersLogos/ArtHouseLogo.png",
      link: "https://arthouse.com",
    },
    {
      name: "Innovo",
      logo: "Assets/PartnersLogos/InnovoLogo.png",
      link: "https://innovo.com",
    },
    {
      name: "Burotime",
      logo: "Assets/PartnersLogos/BurotimeLogo.png",
      link: "https://burotime.com",
    },
    {
      name: "Bloom Paris",
      logo: "Assets/PartnersLogos/BloonLogo.png",
      link: "https://bloom-paris.com",
    },
    {
      name: "Istikbal",
      logo: "Assets/PartnersLogos/istikbal.png",
      link: "https://istikbal.com",
    },
    {
      name: "Qabani",
      logo: "Assets/PartnersLogos/kabani.png",
      link: "https://qabani.com",
    },
  ];

  return (
    <section className="partners-section">
      <div className="partners-content">
        <h1 className="partners-heading">EXPERIENCE FURNITURE WITH PURPOSE.</h1>

        <p className="partners-description">
          We partner with dedicated designers and brands who are as passionate
          about quality and sustainability as we are. Together, we're
          reimagining furniture with eco-friendly materials and responsible
          craftsmanship to bring style and sustainability into every space."
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
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default PartnersSection;
