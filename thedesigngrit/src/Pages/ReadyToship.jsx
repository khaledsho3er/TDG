import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import Header from "../Components/navBar";
import ProductCards from "../Components/Products/Productsgrid";
import FilterSection from "../Components/Products/filters";
import TopFilter from "../Components/Products/TopFilters";
import Footer from "../Components/Footer";
import PageDescription from "../Components/Topheader";

function ReadyToShip() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("Newest");
  const [filters] = useState({
    brands: [],
    colors: [],
    tags: [],
    priceRange: [349, 61564],
  });

  // 🟢 Fetch ready-to-ship products
  useEffect(() => {
    const fetchReadyToShipProducts = async () => {
      try {
        const { data } = await axios.get(
          "https://tdg-db.onrender.com/api/products/products/readytoship"
        );
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching ready-to-ship products:", error);
      }
    };

    fetchReadyToShipProducts();
  }, []);

  // 🟢 Apply filters and sorting
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...products];

      if (filters.brands.length > 0) {
        filtered = filtered.filter((product) =>
          filters.brands.includes(product.brandId)
        );
      }

      if (filters.colors.length > 0) {
        filtered = filtered.filter((product) =>
          product.colors.some((color) => filters.colors.includes(color))
        );
      }

      if (filters.tags.length > 0) {
        filtered = filtered.filter((product) =>
          product.tags.some((tag) => filters.tags.includes(tag))
        );
      }

      filtered = filtered.filter(
        (product) =>
          (product.salePrice || product.price) >= filters.priceRange[0] &&
          (product.salePrice || product.price) <= filters.priceRange[1]
      );

      switch (sortOption) {
        case "Newest":
          filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "Price: Low to High":
          filtered.sort(
            (a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)
          );
          break;
        case "Price: High to Low":
          filtered.sort(
            (a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)
          );
          break;
        case "Alphabetical: A-Z":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "Alphabetical: Z-A":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [filters, sortOption, products]);

  const handleFilterChange = (selectedFilters) => {
    const filtered = products.filter((product) => {
      return (
        (!selectedFilters.color ||
          product.colors.includes(selectedFilters.color)) &&
        (!selectedFilters.size || product.sizes.includes(selectedFilters.size))
      );
    });

    setFilteredProducts(filtered);
  };

  return (
    <Box>
      <Header />
      <PageDescription
        name="Ready to Ship"
        description="Discover products that are in stock and ready to ship immediately!"
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TopFilter sortOption={sortOption} setSortOption={setSortOption} />
      </Box>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} sm={4} md={3}>
          <FilterSection
            onFilterChange={handleFilterChange}
            products={products}
          />
        </Grid>
        <Grid item xs={12} md={9} container spacing={3}>
          {filteredProducts.length > 0 ? (
            <ProductCards products={filteredProducts} />
          ) : (
            <Grid item xs={12}>
              <Typography>No ready-to-ship products available.</Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}

export default ReadyToShip;
