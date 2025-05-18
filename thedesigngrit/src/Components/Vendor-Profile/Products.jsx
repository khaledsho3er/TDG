import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, useMediaQuery } from "@mui/material";
import VendorProductsCard from "./Productscard";
function VendorsProductsGrid({ vendor }) {
  const [products, setProducts] = useState([]);
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    if (!vendor?._id) return;

    fetch(
      `https://api.thedesigngrit.com/api/products/getproducts/brand/${vendor._id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Products:", data);
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [vendor._id]);

  return (
    <Box sx={{ padding: isMobile ? "10px" : "20px" }}>
      <Box
        className="Productsgrid-header"
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: isMobile ? "10px" : "0",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Horizon",
            fontWeight: "bold",
            fontSize: isMobile ? "18px" : "20px",
            padding: isMobile ? "15px 0" : "25px",
          }}
        >
          {vendor.brandName}'s Products
        </Typography>
        {/* <Button
          variant="contained"
          sx={{
            padding: "8px 16px",
            whiteSpace: "nowrap",
            fontSize: isMobile ? "12px" : "14px",
            ":hover": {
              backgroundColor: "#2d2d2d",
              color: "#fff",
            },
          }}
        >
          View all
        </Button> */}
      </Box>
      <Grid
        container
        spacing={isMobile ? 2 : 3}
        className="vendorProducts-grid"
        sx={{
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <VendorProductsCard vendor={vendor} products={products} />
      </Grid>
    </Box>
  );
}

export default VendorsProductsGrid;
