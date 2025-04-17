import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import Header from "../Components/navBar";
import ProductCards from "../Components/Products/Productsgrid";
import FilterSection from "../Components/Products/filters";
import TopFilter from "../Components/Products/TopFilters";
import Footer from "../Components/Footer";
import PageDescription from "../Components/Topheader";

function ProductsPage() {
  const { typeId, typeName } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [typeDescription, setTypeDescription] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    tags: [],
    priceRange: [0, 100000],
  });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchTypeDetails = async () => {
      try {
        const { data } = await axios.get(
          `https://tdg-db.onrender.com/api/types/types/${typeId}`
        );
        setTypeDescription(data.description);
      } catch (error) {
        console.error("Error fetching type details:", error);
      }
    };

    if (typeId) fetchTypeDetails();
  }, [typeId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `https://tdg-db.onrender.com/api/products/types/${typeId}/${typeName}`
        );
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [typeId, typeName]);

  useEffect(() => {
    let filtered = [...products];

    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }
    if (filters.colors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors?.some((color) => filters.colors.includes(color))
      );
    }
    if (filters.tags.length > 0) {
      filtered = filtered.filter((product) =>
        product.tags?.some((tag) => filters.tags.includes(tag))
      );
    }

    filtered = filtered.filter((product) => {
      const price = product.salePrice || product.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    switch (sortOption) {
      case "Newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
  }, [filters, sortOption, products]);

  const handleFavoriteToggle = (product) => {
    setFavorites((prev) =>
      prev.some((fav) => fav._id === product._id)
        ? prev.filter((fav) => fav._id !== product._id)
        : [...prev, product]
    );
  };
  return (
    <Box>
      <Header />
      <PageDescription name={typeName} description={typeDescription} />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TopFilter sortOption={sortOption} setSortOption={setSortOption} />
      </Box>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} sm={4} md={3}>
          <FilterSection products={products} setFilters={setFilters} />
        </Grid>
        <Grid item xs={12} md={9} container spacing={3}>
          {filteredProducts.length > 0 ? (
            <ProductCards
              products={filteredProducts}
              onToggleFavorite={handleFavoriteToggle}
            />
          ) : products.length === 0 ? (
            <Grid item xs={12}>
              <Typography>No products available.</Typography>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography>No products match the selected filters.</Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}

export default ProductsPage;
