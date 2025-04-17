import React from "react";
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Slider,
} from "@mui/material";

function FilterSection({ products, setFilters }) {
  // Extract unique values
  const uniqueBrands = [...new Set(products.map((p) => p.brand))];
  const uniqueColors = [...new Set(products.flatMap((p) => p.colors || []))];
  const uniqueTags = [...new Set(products.flatMap((p) => p.tags || []))];

  const handleBrandChange = (brand) => {
    setFilters((prev) => {
      const isSelected = prev.brands.includes(brand);
      const updated = isSelected
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: updated };
    });
  };

  const handleColorChange = (color) => {
    setFilters((prev) => {
      const isSelected = prev.colors.includes(color);
      const updated = isSelected
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: updated };
    });
  };

  const handleTagChange = (tag) => {
    setFilters((prev) => {
      const isSelected = prev.tags.includes(tag);
      const updated = isSelected
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: updated };
    });
  };

  const handlePriceChange = (event, newValue) => {
    setFilters((prev) => ({ ...prev, priceRange: newValue }));
  };

  return (
    <Box>
      <Typography variant="h6">Brands</Typography>
      <FormGroup>
        {uniqueBrands.map((brand) => (
          <FormControlLabel
            key={brand}
            control={<Checkbox onChange={() => handleBrandChange(brand)} />}
            label={brand}
          />
        ))}
      </FormGroup>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Colors
      </Typography>
      <FormGroup>
        {uniqueColors.map((color) => (
          <FormControlLabel
            key={color}
            control={<Checkbox onChange={() => handleColorChange(color)} />}
            label={color}
          />
        ))}
      </FormGroup>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Tags
      </Typography>
      <FormGroup>
        {uniqueTags.map((tag) => (
          <FormControlLabel
            key={tag}
            control={<Checkbox onChange={() => handleTagChange(tag)} />}
            label={tag}
          />
        ))}
      </FormGroup>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Price Range
      </Typography>
      <Slider
        valueLabelDisplay="auto"
        min={0}
        max={100000}
        step={50}
        onChangeCommitted={handlePriceChange}
      />
    </Box>
  );
}

export default FilterSection;
