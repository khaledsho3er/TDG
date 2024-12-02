import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import VendorCategoryCard from "./CategoryCard";

const VendorCategoriesgrid = () => {
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
    <Box sx={{ padding: 2 }}>
      <Typography
        sx={{
          fontFamily: "Horizon",
          fontWeight: "bold",
          fontSize: "20px",
          padding: "16px 0",
        }}
      >
        Categories Istikbal
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.id}>
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
