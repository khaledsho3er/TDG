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
      <PageDescription />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
