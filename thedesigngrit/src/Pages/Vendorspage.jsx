import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../Components/navBar";
import PageDescription from "../Components/Topheader";
import FilterVSection from "../Components/VendorsPage/Filters";
import VendorsGrid from "../Components/VendorsPage/VendorsGrid";
import TopVButtons from "../Components/VendorsPage/TopButtons";

function Vendorspage() {
  const [selectedCategory, setSelectedCategory] = useState(""); // Manage category filter

  return (
    <Box>
      <Header />
      <PageDescription
        name={"Partners"}
        description={
          "Welcome to our Partners Showcase, where innovation meets collaboration! Discover an exclusive lineup of visionary organisations and influential allies that drive our success. Each partner is a testament to shared ambition and excellence, contributing to a vibrant ecosystem of mutual growth. Dive into dynamic profiles to learn about their groundbreaking work and how our synergies pave the way for transformative impacts. Join us in celebrating these powerful partnerships that empower us to push boundaries and achieve new heights together. Explore, connect, and be inspired by the incredible force of our collective journey!"
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
    </Box>
  );
}

export default Vendorspage;
