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
    <Box
      sx={{
        display: "flex",
        gap: 2,
        marginBottom: 2,
        paddingLeft: 5,
        marginTop: 2,
      }}
    >
      <FormControl
        sx={{
          minWidth: 200,
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            fontFamily: "Montserrat",

            "& fieldset": {
              borderColor: "#ddd",
              borderWidth: "1px",
            },
            "&:hover fieldset": {
              borderColor: "#2d2d2d",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2d2d2d",
              borderWidth: "1px",
            },
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              transform: "translateY(-2px)",
            },
          },
          "& .MuiInputLabel-root": {
            fontFamily: "Montserrat, sans-serif",
            color: "#333",
            "&.Mui-focused": {
              color: "#2d2d2d",
            },
          },
          "& .MuiSelect-select": {
            padding: "10px 14px",
            minHeight: "2rem !important",
            display: "flex",
            alignItems: "center",
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
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                "& .MuiMenuItem-root": {
                  fontFamily: "Montserrat, sans-serif",
                  padding: "10px 16px",
                  minHeight: "2rem",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#2d2d2d",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#434343",
                    },
                  },
                },
              },
            },
          }}
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
