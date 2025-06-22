import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../Components/navBar";
import PageDescription from "../Components/Topheader";
import FilterVSection from "../Components/VendorsPage/Filters";
import VendorsGrid from "../Components/VendorsPage/VendorsGrid";
import TopVButtons from "../Components/VendorsPage/TopButtons";
import Footer from "../Components/Footer";
import { Helmet } from "react-helmet-async";
function Vendorspage() {
  const [selectedCategory, setSelectedCategory] = useState(""); // Manage category filter

  return (
    <Box>
      <Helmet>
        <title>Brands & Local Designers | The Design Grit</title>
        <meta
          name="description"
          content="Explore our curated list of Egyptian brands and designers featured on The Design Grit. Discover quality craftsmanship and unique designs from our vendor partners."
        />
        <link rel="canonical" href="https://thedesigngrit.com/vendors" />
        <meta property="og:title" content="Meet Our Brands | The Design Grit" />
        <meta
          property="og:description"
          content="Discover the heart of TDG—our brands. Explore original Egyptian craftsmanship by trusted local vendors."
        />
        <meta property="og:url" content="https://thedesigngrit.com/vendors" />
      </Helmet>
      <Header />
      <PageDescription
        name={"Brands"}
        description={
          "Explore the heart of TheDesignGrit—our brands. They are the foundation of our mission, each bringing unique artistry and unmatched quality to the platform. By showcasing these creators, we’re building a collective that empowers local talent and delivers authentic Egyptian craftsmanship to your home."
        }
      />
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}
      >
        <TopVButtons />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* Pass the selected category and setter function */}
        <FilterVSection
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <VendorsGrid selectedCategory={selectedCategory} />
      </Box>

      <Footer />
    </Box>
  );
}

export default Vendorspage;
