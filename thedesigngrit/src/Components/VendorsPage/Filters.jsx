import React, { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FilterVSection = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.thedesigngrit.com/api/categories/categories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Box sx={{ display: "flex", gap: 2, marginBottom: 2, paddingLeft: 5 }}>
      <FormControl
        sx={{
          minWidth: 200,
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "gray" }, // Default border color
            "&:hover fieldset": { borderColor: "black" }, // On hover
            "&.Mui-focused fieldset": { borderColor: "green" }, // On focus
          },
        }}
        variant="outlined"
      >
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          label="Category"
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterVSection;
