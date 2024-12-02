import React from "react";
import { Box } from "@mui/material";
import Header from "../Components/navBar";
import PageDicription from "../Components/Topheader";
import ProductCard from "../Components/Products/productcard";
import ProductCards from "../Components/Products/Productsgrid";
import FilterSection from "../Components/Products/filters";
import TopFilter from "../Components/Products/TopFilters";
import Footer from "../Components/Footer";
function ProductsPage() {
  return (
    <Box>
      <Header />
      <PageDicription />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TopFilter />
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box>
          <FilterSection />
        </Box>
        <Box>
          <ProductCards />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default ProductsPage;
