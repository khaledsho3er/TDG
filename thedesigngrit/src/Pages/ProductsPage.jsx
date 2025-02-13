import React, { useState, useEffect, useMemo } from "react";
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
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("Newest");
  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    tags: [],
    priceRange: [349, 61564],
  });

  // جلب المنتجات
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `https://tdg-db.onrender.com/api/products/subcategory/${subcategoryId}/${subcategoryName}`
        );
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [subcategoryId, subcategoryName]);

  // 🔹 فلترة المنتجات باستخدام useMemo لتحسين الأداء
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesBrand =
          filters.brands.length === 0 || filters.brands.includes(product.brand);
        const matchesColor =
          filters.colors.length === 0 ||
          filters.colors.some((color) => product.colors.includes(color));
        const matchesTag =
          filters.tags.length === 0 ||
          filters.tags.some((tag) => product.tags.includes(tag));
        const matchesPrice =
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1];

        return matchesBrand && matchesColor && matchesTag && matchesPrice;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "Newest":
            return new Date(b.dateAdded) - new Date(a.dateAdded);
          case "Price: Low to High":
            return a.price - b.price;
          case "Price: High to Low":
            return b.price - a.price;
          case "Alphabetical: A-Z":
            return a.name.localeCompare(b.name);
          case "Alphabetical: Z-A":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [products, filters, sortOption]); // 🔥 يتم تحديث المنتجات عند أي تغيير في الفلاتر أو الترتيب

  // 🔹 تحديث الفلاتر
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Box>
      <Header />
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
        <Grid item xs={12} sm={8} md={9}>
          <ProductCards products={filteredProducts} />
        </Grid>
      </Grid>

      <Footer />
    </Box>
  );
}

export default ProductsPage;
