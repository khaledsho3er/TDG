import React from "react";
import NavBar from "../Components/navBar";
import HeroAbout from "../Components/About/heroAbout";
import PartnerApplicationForm from "../Components/partnerApplication";
import { Box } from "@mui/material";
import Footer from "../Components/Footer";
function PartnersApplication() {
  // Partner logos data (reuse from home/partners.jsx)
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
    <Box
      sx={{ background: "#F8F7F3", minHeight: "100vh" }}
      className="Partner-Page"
    >
      <NavBar />
      {/* Hero Section */}
      <Box>
        <HeroAbout
          title="Our Partners"
          subtitle="Join our network of trusted vendors and partners driving innovation and excellence in the world of furniture"
          image={"Assets/partners.webp"}
          variant="partners"
        />
      </Box>
      {/* Intro Section */}
      <Box
        sx={{
          maxWidth: "900px",
          margin: "40px auto 0",
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
        }}
      >
        <h2
          style={{
            fontFamily: "Horizon",
            fontWeight: "bold",
            fontSize: 28,
            marginBottom: 16,
          }}
        >
          Become a Partner
        </h2>
        <Box
          sx={{
            color: "#444",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 16,
            lineHeight: 1.7,
          }}
        >
          <p>
            At TheDesignGrit, we’re not just a platform—we’re a partner in your
            success. By joining TDG, you gain access to a marketplace designed
            to amplify your brand’s visibility, streamline operations, and
            connect you with an audience that values quality and craftsmanship.
          </p>
          <p>
            Be part of a platform that celebrates the mastery of{" "}
            <strong>Egyptian design and crafts</strong> a future where your
            brand thrives.
          </p>
        </Box>
      </Box>
      {/* Benefits Section */}
      <Box
        sx={{
          maxWidth: "900px",
          margin: "40px auto 0",
          background: "#F3F1EA",
          borderRadius: "24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
        }}
        className="partners-second-section"
      >
        <h2
          style={{
            fontFamily: "Horizon",
            fontWeight: "bold",
            fontSize: 24,
            marginBottom: 16,
          }}
        >
          Why Partner with TDG?
        </h2>
        <ul
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 16,
            color: "#444",
            paddingLeft: 24,
          }}
        >
          <li>
            <strong>Expand Your Reach:</strong> Showcase your products to a
            growing audience passionate about Egyptian design.
          </li>
          <li>
            <strong>Maintain Control:</strong> Manage your brand, customer
            experience, and deliveries on your own terms.
          </li>
          <li>
            <strong>AI-Driven Insights:</strong> Understand customer behavior
            with powerful analytics tools that empower smarter business
            decisions.
          </li>
          <li>
            <strong>Seamless Operations:</strong> Simplify inventory management,
            transactions, and quotations with our integrated platform.
          </li>
          <li>
            <strong>Collaborative Marketing:</strong> Benefit from joint
            campaigns and targeted email marketing to boost visibility and
            sales.
          </li>
        </ul>
      </Box>
      {/* Partner Logos Section */}
      <Box
        sx={{
          maxWidth: "1100px",
          margin: "40px auto 0",
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
        }}
      >
        <h2
          style={{
            fontFamily: "Horizon",
            fontWeight: "bold",
            fontSize: 24,
            marginBottom: 16,
          }}
        >
          Our Brands
        </h2>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", margin: 12 }}
            >
              <img
                src={`Assets/PartnersLogos/${partner.logo}-300.webp`}
                srcSet={`Assets/PartnersLogos/${partner.logo}-150.webp 150w, Assets/PartnersLogos/${partner.logo}-300.webp 300w, Assets/PartnersLogos/${partner.logo}-500.webp 500w`}
                sizes="(max-width: 768px) 50vw, 150px"
                alt={`${partner.name} logo`}
                loading="lazy"
                width="150"
                style={{
                  borderRadius: 12,
                  background: "#F8F7F3",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              />
            </a>
          ))}
        </Box>
      </Box>
      {/* Application Form Section */}
      <Box
        sx={{
          maxWidth: "900px",
          margin: "40px auto 60px",
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
        }}
      >
        <h2
          style={{
            fontFamily: "Horizon",
            fontWeight: "bold",
            fontSize: 24,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Become a Partner
        </h2>
        <PartnerApplicationForm />
      </Box>
      <Footer />
    </Box>
  );
}
export default PartnersApplication;
