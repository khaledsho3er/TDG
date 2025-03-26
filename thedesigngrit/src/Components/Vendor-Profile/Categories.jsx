import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import VendorCategoryCard from "./CategoryCard";

const VendorCategoriesgrid = ({ vendor }) => {
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetch(`https://tdg-db.onrender.com/api/types/${vendor._id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => setTypes(data))
      .catch((error) => console.error("Error fetching types:", error));
  }, [vendor._id]);

  return (
    <Box className="vendorcategories-grid-container">
      <Typography variant="h1" className="vendorcategories-title">
        {vendor.brandName}'s Types
      </Typography>
      <Grid container spacing={3} className="vendorcategories-grid">
        {types.slice(0, 3).map((type) => (
          <Grid item xs={12} sm={6} md={4} key={type._id}>
            <VendorCategoryCard
              name={type.name}
              description={type.description}
              image={type.image}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VendorCategoriesgrid;
