import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import VendorCategoryCard from "./CategoryCard";

const VendorCategoriesgrid = ({ vendorId, vendorname }) => {
  const [categories, setCategories] = useState([]);

  // Fetch data from the JSON file
  useEffect(() => {
    fetch("/json/vendorcategories.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <Box className="vendorcategories-grid-container">
      <Typography variant="h1" className="vendorcategories-title">
        {vendorname}'s Categories
      </Typography>
      <Grid container spacing={3} className="vendorcategories-grid">
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={2.4} key={category.id}>
            <VendorCategoryCard
              title={category.title}
              description={category.description}
              price={category.price}
              image={category.image}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VendorCategoriesgrid;
