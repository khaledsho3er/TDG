import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import VendorProductsCard from "./Productscard";

function VendorsProductsGrid({ vendorId }) {
  const [products, setProducts] = useState([]);

  // Fetch products from the JSON file
  useEffect(() => {
    fetch(
      `https://tdg-db.onrender.com/api/products/getproducts/brand/${vendorId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        // Filter products based on vendorId
        const filteredProducts = data.filter(
          (product) => product.vendorId === vendorId
        );
        setProducts(filteredProducts);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [vendorId]); // Re-run fetch when vendorId changes

  return (
    <Box>
      <Box className="Productsgrid-header">
        <Typography
          sx={{
            fontFamily: "Horizon",
            fontWeight: "bold",
            fontSize: "20px",
            padding: "25px",
          }}
        >
          Istikbal's Products
        </Typography>
        <Button variant="contained">View all</Button>
      </Box>
      <Grid container spacing={3} className="vendorProducts-grid">
        {products.map((product) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={2.4}
            key={product.id}
            className="vendorProducts-grid-item"
          >
            <VendorProductsCard
              title={product.title}
              description={product.description}
              price={product.price}
              image={product.mainimage}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default VendorsProductsGrid;
