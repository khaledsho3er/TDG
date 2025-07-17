import React from "react";
import NavBar from "../Components/navBar";
import HeroAbout from "../Components/About/heroAbout";
import MeetOurTeam from "../Components/About/ourTeam";
import { Box } from "@mui/material";
import Footer from "../Components/Footer";
import LoadingScreen from "./loadingScreen";
import { Helmet } from "react-helmet-async";

function AboutUsPage() {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setTimeout(() => setLoading(false), 4000);
  }, []);
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Box sx={{ background: "#F8F7F3", minHeight: "100vh" }}>
      <Helmet>
        <title>About Us | TheDesignGrit</title>
        <meta
          name="description"
          content="Learn about TheDesignGrit's mission to showcase Egyptian craftsmanship, empower local brands, and redefine the future of furniture design in Egypt."
        />
        <meta
          name="keywords"
          content="About TheDesignGrit, Egyptian design, local brands, furniture mission, team, heritage"
        />
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://thedesigngrit.com/about" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="About Us | TheDesignGrit" />
        <meta
          property="og:description"
          content="Discover our story, mission, and vision at TheDesignGrit. We empower Egyptian designers and connect customers with timeless furniture."
        />
        <meta
          property="og:image"
          content="https://thedesigngrit.com/Assets/AboutUs.webp"
        />
        <meta property="og:url" content="https://thedesigngrit.com/about" />
        <meta property="og:type" content="website" />
      </Helmet>
      <NavBar />
      {/* Hero Section */}

      {/* Story Section */}
      <Box
        sx={{
          maxWidth: "1100px",
          margin: "40px auto 0",
          borderRadius: "24px",
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
          Our Story
        </h2>
        <Box
          sx={{
            color: "#444",
            fontFamily: "Montserrat",
            fontSize: 16,
            lineHeight: 2.5,
          }}
        >
          <p>
            At TheDesignGrit, we believe Egyptian craftsmanship deserves a stage
            as bold and timeless as its heritage. Born from a deep respect for
            tradition and a drive to inspire the future, we’re not just a
            marketplace—we’re a movement.
          </p>
          <p>
            Our journey began with a realization: Egypt is brimming with
            unmatched talent, yet many local brands lack the visibility and
            tools to thrive. That’s where we step in. TheDesignGrit creates a
            platform where exceptional design meets its audience. We connect
            skilled brands with customers who appreciate quality and a story
            behind each piece.
          </p>
          <p>
            We don’t just sell furniture; we build connections. Our platform
            celebrates the diversity of Egyptian design, giving every brand the
            chance to tell its story and every customer the chance to own a
            piece of it. With tools to streamline operations and insights to
            grow their businesses, we empower brands to focus on what they do
            best—creating timeless works of art.
          </p>
          <p>
            For our customers, we’ve curated a space where design inspiration
            comes to life. Whether it’s finding the perfect statement piece or
            exploring trends that resonate with your style, TheDesignGrit
            ensures your shopping experience is as refined as the products we
            showcase.
          </p>
          <p>
            TheDesignGrit isn’t just about furniture—it’s about crafting a
            legacy. Together, we’re redefining what it means to celebrate
            Egyptian design, one masterpiece at a time.
          </p>
        </Box>
      </Box>
      {/* Mission & Vision Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          maxWidth: "1100px",
          margin: "60px auto 60px",
          background: "#F3F1EA",
          borderRadius: "24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 5 },
        }}
        className="ourMission-Section"
      >
        <Box
          className="ourMission-Section-image"
          sx={{
            flex: 1,
            minWidth: 220,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="Assets/aboutUsContent.webp"
            alt="ImageAbout"
            style={{
              borderRadius: "16px",
              width: "100%",
              maxWidth: 320,
              objectFit: "cover",
            }}
          />
        </Box>
        <Box className="ourMission-Section-typo" sx={{ flex: 2 }}>
          <h2
            style={{
              fontFamily: "Horizon",
              fontWeight: "bold",
              fontSize: 24,
              marginBottom: 12,
            }}
          >
            Our Mission
          </h2>
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 16,
              color: "#444",
              marginBottom: 24,
            }}
          >
            To unite Egypt’s finest home furnishing brands, streamline
            transactions, and elevate the customer experience with innovation,
            transparency, and exceptional service.
          </p>
          <h2
            style={{
              fontFamily: "Horizon",
              fontWeight: "bold",
              fontSize: 24,
              marginBottom: 12,
            }}
          >
            Our Vision
          </h2>
          <p
            style={{
              fontFamily: "Montserrat",
              fontSize: 16,
              color: "#444",
            }}
          >
            To ignite the timeless passion of Egyptian design, uniting artistry
            with innovation and showcasing its mastery to the world.
          </p>
        </Box>
      </Box>
      {/* Team Section */}
      {/* <Box
        sx={{
          maxWidth: "900px",
          margin: "60px auto",
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
            textAlign: "center",
          }}
        >
          Meet Our Team
        </h2>
        <MeetOurTeam />
      </Box> */}
      <Footer />
    </Box>
  );
}
export default AboutUsPage;
