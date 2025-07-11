import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import Header from "../Components/navBar";
import ProductCards from "../Components/Products/Productsgrid";
import FilterSection from "../Components/Products/filters";
import TopFilter from "../Components/Products/TopFilters";
import Footer from "../Components/Footer";
import PageDescription from "../Components/Topheader";

function ProductsPage() {
  const { typeId, typeName } = useParams();
  const [typeDescription, setTypeDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("Newest");
  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    tags: [],
    priceRange: [0, 600000], // Wider range initially
  });
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:768px)");

  // Fetch Type Details
  useEffect(() => {
    const fetchTypeDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://api.thedesigngrit.com/api/types/types/${typeId}`
        );
        setTypeDescription(data.description);
      } catch (error) {
        console.error("Error fetching type details:", error);
      }
    };

    if (typeId) fetchTypeDetails();
  }, [typeId]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        const { data } = await axios.get(
          `https://api.thedesigngrit.com/api/products/types/${typeId}/${typeName}`
        );
        console.log("Raw API response:", data); // Add this line

        const approvedProducts = data.filter(
          (product) =>
            product.status === true && product.brandId.status === "active"
        );

        setProducts(approvedProducts);
        setFilteredProducts(approvedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [typeId, typeName]);

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

  // Handle filter changes from FilterSection
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle CAD filter toggle
  const handleCADFilterChange = (value) => {
    setFilters((prev) => ({ ...prev, hasCAD: value }));
  };

  // Handle Sale Price filter toggle
  const handleSalePriceFilterChange = (value) => {
    setFilters((prev) => ({ ...prev, hasSalePrice: value }));
  };
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <PageDescription name={typeName} description={typeDescription} />

      {/* TopFilter - hidden on mobile, visible on desktop */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "flex-end",
          px: { xs: 2, md: 3 },
          py: 2,
        }}
      >
        <TopFilter
          sortOption={sortOption}
          setSortOption={setSortOption}
          onCADFilterChange={handleCADFilterChange}
          onSalePriceFilterChange={handleSalePriceFilterChange}
          hasCAD={filters.hasCAD}
          hasSalePrice={filters.hasSalePrice}
        />
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          flex: 1,
          px: { xs: 2, md: 3 },
          pb: 4,
        }}
      >
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "100%", md: "300px" },
            flexShrink: 0,
            px: { xs: 0, sm: 0, md: 1 },
          }}
        >
          <FilterSection
            onFilterChange={handleFilterChange}
            products={products}
            currentFilters={filters}
            sortOption={sortOption}
            setSortOption={setSortOption}
            onCADFilterChange={handleCADFilterChange}
            onSalePriceFilterChange={handleSalePriceFilterChange}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          {isLoading ? (
            <Box
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
            </Box>
          ) : filteredProducts.length > 0 ? (
            <ProductCards products={filteredProducts} />
          ) : products.length === 0 ? (
            <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
              No products available.
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
              No products match your filters. Try adjusting your criteria.
            </Typography>
          )}
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}

export default ProductsPage;
