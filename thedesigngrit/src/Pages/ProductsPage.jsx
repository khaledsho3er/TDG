import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Container, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import FilterSection from "./FilterSection";
import ProductCard from "./ProductCard";

const ProductsPage = () => {
  const { subcategoryId, subcategoryName } = useParams(); // Get subcategory from URL
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `https://tdg-db.onrender.com/api/products/subcategory/${subcategoryId}/${subcategoryName}`
        );
        setProducts(data);
        setFilteredProducts(data); // Show all products initially
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [subcategoryId, subcategoryName]);

  const handleFilterChange = (filtered) => {
    setFilteredProducts(filtered);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {subcategoryName} Products
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {/* Filters Section */}
          <Grid item xs={12} md={3}>
            <FilterSection
              onFilterChange={handleFilterChange}
              products={products}
            />
          </Grid>

          {/* Products Grid */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Grid key={product.id} item xs={12} sm={6} md={4}>
                    <ProductCard product={product} />
                  </Grid>
                ))
              ) : (
                <Typography variant="h6" sx={{ mt: 3 }}>
                  No products match the selected filters.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ProductsPage;
