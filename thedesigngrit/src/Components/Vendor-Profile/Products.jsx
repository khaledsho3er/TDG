import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import VendorProductsCard from "./Productscard";
import { useNavigate } from "react-router-dom";
function VendorsProductsGrid({ vendor }) {
  const navigate = useNavigate();
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
        <Button variant="contained">View all</Button>
      </Box>
      <Grid container spacing={3} className="vendorProducts-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              onClick={() => navigate(`/product/${product._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="reviews-section">
                <VendorProductsCard
                  _id={product._id}
                  title={product.name}
                  description={product.description}
                  price={product.price}
                  mainImage={product.mainImage}
                />
              </div>
            </div>
          ))
        ) : (
          <Typography sx={{ padding: "20px", color: "gray" }}>
            No products found for this vendor.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}

export default VendorsProductsGrid;
