import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ProductCard from "./productcard";

const ProductPage = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/json/product.json"); // Replace with your API endpoint
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Grid
      container
      spacing={0.5} // Reduce the gap between cards
      sx={{
        display: "flex",
        justifyContent: "flex-start", // Ensure the second row starts from the left
        paddingLeft: "30px",
        paddingTop: "200",
      }}
    >
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          {/* Each item takes up 4 columns on medium screens (3 items per row) */}
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductPage;
