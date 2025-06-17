import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import Header from "../Components/navBar";
import ProductCards from "../Components/Products/Productsgrid";
import FilterSection from "../Components/Products/filters";
import TopFilter from "../Components/Products/TopFilters";
import Footer from "../Components/Footer";
import PageDescription from "../Components/Topheader";

function OnSale() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("Newest");
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    tags: [],
    priceRange: [0, 600000], // Wider range initially
  });
  // 🟢 Fetch products
  useEffect(() => {
    const fetchReadyToShipProducts = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          "https://api.thedesigngrit.com/api/products/getproducts/"
        );
        // Filter products that have salePrice
        const onSaleProducts = data.filter(
          (product) =>
            product.salePrice &&
            product.status === true &&
            product.promotionApproved === true
        );
        setProducts(onSaleProducts);
        setFilteredProducts(onSaleProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReadyToShipProducts();
  }, []);

  // 🟢 Apply filters and sorting
  // Apply filters and sorting
  useEffect(() => {
    const applyFiltersAndSorting = () => {
      let filtered = [...products];
      console.log("Initial products:", products); // Add this
      products.forEach((product, index) => {
        console.log(`Product ${index}:`, {
          name: product.name,
          brand: product.brandId.brandName,
          colors: product.colors,
          tags: product.tags,
          price: product.price,
          salePrice: product.salePrice,
          createdAt: product.createdAt,
        });
      });
      if (filters.hasCAD) {
        filtered = filtered.filter((product) => product.cadFile);
      }

      // Sale Price filter
      if (filters.hasSalePrice) {
        filtered = filtered.filter((product) => product.salePrice);
      }
      // Brand filter
      if (filters.brands.length > 0) {
        filtered = filtered.filter(
          (product) =>
            product.brandId &&
            product.brandId.brandName &&
            filters.brands.includes(product.brandId.brandName)
        );
      }

      // Color filter
      if (filters.colors.length > 0) {
        filtered = filtered.filter((product) =>
          product.colors?.some((color) => filters.colors.includes(color))
        );
      }

      // Tags filter
      if (filters.tags.length > 0) {
        filtered = filtered.filter((product) =>
          product.tags?.some((tag) => filters.tags.includes(tag))
        );
      }

      // Price filter
      filtered = filtered.filter((product) => {
        const price = product.salePrice || product.price;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });

      // Sorting
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
      console.log("Filtered products:", filtered); // Add this

      setFilteredProducts(filtered);
    };

    applyFiltersAndSorting();
  }, [products, filters, sortOption]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCADFilterChange = (value) => {
    setFilters((prev) => ({ ...prev, hasCAD: value }));
  };

  // Handle Sale Price filter toggle
  const handleSalePriceFilterChange = (value) => {
    setFilters((prev) => ({ ...prev, hasSalePrice: value }));
  };
  return (
    <Box>
      <Header />
      <PageDescription
        name="On Sale Products"
        description="Discover products that are in Sale and hurry up!"
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TopFilter
          sortOption={sortOption}
          setSortOption={setSortOption}
          onCADFilterChange={handleCADFilterChange}
          onSalePriceFilterChange={handleSalePriceFilterChange}
        />{" "}
      </Box>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid
          item
          xs={12}
          sm={4}
          md={3}
          sx={{ paddingRight: "150px !important" }}
        >
          <FilterSection
            onFilterChange={handleFilterChange}
            products={products}
            currentFilters={filters}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={9}
          container
          spacing={3}
          sx={{ paddingRight: "150px !important" }}
        >
          {isLoading ? (
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
              }}
            >
              <CircularProgress
                size={60}
                thickness={4}
                sx={{ color: "#6b7b58" }}
              />
            </Grid>
          ) : filteredProducts.length > 0 ? (
            <ProductCards products={filteredProducts} />
          ) : (
            <Grid item xs={12}>
              <Typography>No products have sale at the moment.</Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}

export default OnSale;
