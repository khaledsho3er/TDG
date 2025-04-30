import React from "react";

const PartnersSection = () => {
  const partners = [
    {
      name: "Art House",
      logo: "ArtHouseLogo",
      link: "https://arthouse.com",
    },
    {
      name: "Innovo",
      logo: "InnovoLogo",
      link: "https://innovo.com",
    },
    {
      name: "Burotime",
      logo: "BurotimeLogo",
      link: "https://burotime.com",
    },
    {
      name: "Bloom Paris",
      logo: "BloonLogo",
      link: "https://bloon-paris.com",
    },
    {
      name: "Istikbal",
      logo: "istikbal",
      link: "https://istikbal.com",
    },
    {
      name: "Qabani",
      logo: "kabani",
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
              src={`Assets/PartnersLogos/${partner.logo}-300.webp`}
              srcSet={`
    Assets/PartnersLogos/${partner.logo}-150.webp 150w,
    Assets/PartnersLogos/${partner.logo}-300.webp 300w,
    Assets/PartnersLogos/${partner.logo}-500.webp 500w
  `}
              sizes="(max-width: 768px) 50vw, 150px"
              alt={`${partner.name} logo`}
              loading="lazy"
              width="150"
              height="auto"
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default PartnersSection;
