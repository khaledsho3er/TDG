import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import VendorProductsCard from "./Productscard";
function VendorsProductsGrid({ vendor }) {
  const [products, setProducts] = useState([]);
  console.log("brand Id in vendor profile", vendor);

  useEffect(() => {
    if (!vendor?._id) return; // Ensure vendor._id is available before fetching

    fetch(
      `https://tdg-db.onrender.com/api/products/getproducts/brand/${vendor._id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Products:", data);
        setProducts(data); // No need to filter if API already returns correct products
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [vendor._id]);

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
          {vendor.brandName} 's Products
        </Typography>
        <Button
          variant="contained"
          sx={{
            ":hover": {
              backgroundColor: "#2d2d2d",
            },
          }}
        >
          View all
        </Button>
      </Box>
      <Grid container spacing={3} className="vendorProducts-grid">
        <VendorProductsCard vendor={vendor} products={products} />
      </Grid>
    </Box>
  );
}

export default VendorsProductsGrid;
