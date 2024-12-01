import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Header from "../Components/navBar";
import PageDescription from "../Components/Topheader";
import FilterVSection from "../Components/VendorsPage/Filters";
import VendorsGrid from "../Components/VendorsPage/VendorsGrid";
import TopVButtons from "../Components/VendorsPage/TopButtons";

function Vendorspage() {
  return (
    <Box>
      <Header />
      <PageDescription />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TopVButtons />
      </Box>
      <Box sx={{ display: "flex" }}>
        <FilterVSection />
        <VendorsGrid />
      </Box>
    </Box>
  );
}

export default Vendorspage;
