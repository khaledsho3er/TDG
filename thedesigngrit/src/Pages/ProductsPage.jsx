import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import axios from "axios";
import Header from "../Components/navBar";
import ProductCards from "../Components/Products/Productsgrid";
import FilterSection from "../Components/Products/filters";
import TopFilter from "../Components/Products/TopFilters";
import Footer from "../Components/Footer";

function ProductsPage() {
  const { subcategoryId, subcategoryName } = useParams();
  const [products, setProducts] = useState([]); // جميع المنتجات
  const [filteredProducts, setFilteredProducts] = useState([]); // المنتجات بعد الفلترة
  const [sortOption, setSortOption] = useState("Newest");
  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    tags: [],
    priceRange: [349, 61564],
  });

  // 🟢 جلب المنتجات من الـ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `https://tdg-db.onrender.com/api/products/subcategory/${subcategoryId}/${subcategoryName}`
        );
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [subcategoryId, subcategoryName]);

  // 🟢 تطبيق الفلاتر عند التحديث
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

  return (
    <Box>
      <Header />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TopFilter sortOption={sortOption} setSortOption={setSortOption} />
      </Box>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} sm={4} md={3}>
          <FilterSection onFilterChange={setFilters} products={products} />
        </Grid>
        <Grid item xs={12} sm={8} md={9}>
          <ProductCards products={filteredProducts} />
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}

export default ProductsPage;
