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
    <Box className="">
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
      <Box>
        <HeroAbout
          title="Our Story"
          subtitle="Your vision, our canvas. Join us in celebrating our heritage, innovation and mastery."
          image={"Assets/AboutUs.webp"}
        />
      </Box>
      <Box
        sx={{
          marginTop: "100px",
          marginBottom: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0px",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <p className="Caption-AboutUs">
          At TheDesignGrit, we believe Egyptian craftsmanship deserves a stage
          as bold and timeless as its heritage. Born from a deep respect for
          tradition and a drive to inspire the future, we’re not just a
          marketplace—we’re a movement.{" "}
        </p>{" "}
        <br></br>
        <p className="Caption-AboutUs">
          Our journey began with a realization: Egypt is brimming with unmatched
          talent, yet many local brands lack the visibility and tools to thrive.
          That’s where we step in. TheDesignGrit creates a platform where
          exceptional design meets its audience. We connect skilled brands with
          customers who appreciate quality and a story behind each piece.
        </p>{" "}
        <br></br>
        <p className="Caption-AboutUs">
          We don’t just sell furniture; we build connections. Our platform
          celebrates the diversity of Egyptian design, giving every brand the
          chance to tell its story and every customer the chance to own a piece
          of it. With tools to streamline operations and insights to grow their
          businesses, we empower brands to focus on what they do best—creating
          timeless works of art.
        </p>{" "}
        <br></br>
        <p className="Caption-AboutUs">
          For our customers, we’ve curated a space where design inspiration
          comes to life. Whether it’s finding the perfect statement piece or
          exploring trends that resonate with your style, TheDesignGrit ensures
          your shopping experience is as refined as the products we showcase.
        </p>{" "}
        <br></br>
        <p className="Caption-AboutUs">
          {" "}
          TheDesignGrit isn’t just about furniture—it’s about crafting a legacy.
          Together, we’re redefining what it means to celebrate Egyptian design,
          one masterpiece at a time.
        </p>
        <br></br>
      </Box>
      <Box className="ourMission-Section">
        <Box className="ourMission-Section-image">
          <img src="Assets/aboutUsContent.webp" alt="ImageAbout" />
        </Box>
        <Box className="ourMission-Section-typo">
          <h2>Our Mission</h2>
          <p>
            To unite Egypt’s finest home furnishing brands, streamline
            transactions, and elevate the customer experience with innovation,
            transparency, and exceptional service.
          </p>

          <h2>Our Vision</h2>
          <p>
            To ignite the timeless passion of Egyptian design, uniting artistry
            with innovation and showcasing its mastery to the world.
          </p>
        </Box>
      </Box>
      <Box className="ourStory-Section-typo">
        <hr className="line-between" />
      </Box>
      {/* <Box className="OurTeam-section">
        <Box className="OurTeam-section-typo">
          <h2>Meet Our Team</h2>
        </Box>
        <Box className="ourTeam-Section-image">
          <MeetOurTeam />
        </Box>
      </Box> */}
      <Footer />
    </Box>
  );
}
export default AboutUsPage;
