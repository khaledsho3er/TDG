import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import axios from "axios";
import Header from "../Components/navBar";
import PageDicription from "../Components/Topheader";
import ProductCards from "../Components/Products/Productsgrid";
import FilterSection from "../Components/Products/filters";
import TopFilter from "../Components/Products/TopFilters";
import Footer from "../Components/Footer";
import LoadingScreen from "./loadingScreen";
import CircularProgress from "@mui/material/CircularProgress";

function ProductsPage() {
  const { subcategoryId, subcategoryName } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    tags: [],
    priceRange: [349, 61564],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://tdg-db.onrender.com/api/categories/categories"
        );
        setCategories(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `https://tdg-db.onrender.com/api/products/subcategory/${subcategoryId}/${subcategoryName}`
        );

        setProducts(data);
        setFilteredProducts(data);
        console.log("filtered products:", filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [subcategoryId, subcategoryName]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const toggleFavorite = (product) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.id === product.id)) {
      updatedFavorites = favorites.filter((fav) => fav.id !== product.id);
    } else {
      updatedFavorites = [...favorites, product];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    let sortedProducts = [...filteredProducts];
    switch (sortOption) {
      case "Newest":
        sortedProducts.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
        break;
      case "Price: Low to High":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "Alphabetical: A-Z":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Alphabetical: Z-A":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  }, [sortOption, filteredProducts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const filtered = products.filter((product) => {
      const matchesBrand =
        newFilters.brands.length === 0 ||
        newFilters.brands.includes(product.brand);
      const matchesColor =
        newFilters.colors.length === 0 ||
        newFilters.colors.some((color) => product.colors.includes(color));
      const matchesTag =
        newFilters.tags.length === 0 ||
        newFilters.tags.some((tag) => product.tags.includes(tag));
      const matchesPrice =
        product.price >= newFilters.priceRange[0] &&
        product.price <= newFilters.priceRange[1];
      return matchesBrand && matchesColor && matchesTag && matchesPrice;
    });
    setFilteredProducts(filtered);
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
          <ProductCards products={products} onToggleFavorite={toggleFavorite} />
        </Grid>
      </Grid>

      <Footer />
    </Box>
  );
}

export default ProductsPage;
