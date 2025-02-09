import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FilterSection = ({ onFilterChange, products }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    colors: [],
    tags: [],
    priceRange: [349, 61564],
  });
  const [brands, setBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  // Extract colors and tags dynamically from products
  const uniqueColors = [...new Set(products.flatMap((p) => p.colors))];
  const uniqueTags = [...new Set(products.flatMap((p) => p.tags))];
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/brand/");
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const handlePriceChange = (event, newValue) => {
    setSelectedFilters((prev) => ({
      ...prev,
      priceRange: newValue,
    }));
    onFilterChange({
      ...selectedFilters,
      priceRange: newValue,
    });
  };

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => {
      const newFilters = {
        ...prev,
        [type]: prev[type].includes(value)
          ? prev[type].filter((item) => item !== value)
          : [...prev[type], value],
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      brands: [],
      colors: [],
      tags: [],
      priceRange: [349, 61564],
    });
    onFilterChange({
      brands: [],
      colors: [],
      tags: [],
      priceRange: [349, 61564],
    });
  };
  // Apply Filters
  useEffect(() => {
    let filtered = [...products];

    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors.some((color) => selectedColors.includes(color))
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((product) =>
        product.tags.some((tag) => selectedTags.includes(tag))
      );
    }
  }, [selectedColors, selectedTags, products, ,]);

  return (
    <Box sx={{ width: 300, paddingLeft: 3 }}>
      {/* Selected Filters */}
      <Box mb={2}>
        <Typography
          variant="h6"
          sx={{ fontFamily: "Horizon", fontWeight: "bold" }}
        >
          Filters:
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginY: 1 }}>
          {selectedFilters.brands.map((filter, index) => (
            <Chip
              key={index}
              label={filter}
              onDelete={() => handleFilterChange("brands", filter)}
            />
          ))}
          {selectedFilters.colors.map((filter, index) => (
            <Chip
              key={index}
              label={filter}
              onDelete={() => handleFilterChange("colors", filter)}
            />
          ))}
          {selectedFilters.tags.map((filter, index) => (
            <Chip
              key={index}
              label={filter}
              onDelete={() => handleFilterChange("tags", filter)}
            />
          ))}
        </Box>
        <Button
          onClick={clearFilters}
          size="small"
          color="error"
          sx={{
            border: "1px solid #2d2d2d",
            "&:hover": {
              backgroundColor: "#2d2d2d",
            },
          }}
        >
          Clear All
        </Button>
      </Box>

      {/* Brands Filter */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Brands
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {brands.map((brand, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedFilters.brands.includes(brand.brandName)}
                  onChange={(e) =>
                    handleFilterChange("brands", brand.brandName)
                  }
                />
              }
              label={brand.brandName}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Price Range Slider */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Price
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: "100%" }}>
            <Slider
              value={selectedFilters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={349}
              max={61564}
              sx={{ color: "primary.main" }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <TextField
                label="Min"
                variant="outlined"
                size="small"
                value={selectedFilters.priceRange[0]}
                onChange={(e) =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    priceRange: [Number(e.target.value), prev.priceRange[1]],
                  }))
                }
              />
              <TextField
                label="Max"
                variant="outlined"
                size="small"
                value={selectedFilters.priceRange[1]}
                onChange={(e) =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], Number(e.target.value)],
                  }))
                }
              />
            </Box>
            <Button variant="contained" size="small" sx={{ marginTop: 1 }}>
              Apply
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Colors */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Colors
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {uniqueColors.map((color, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedColors.includes(color)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedColors((prev) => [...prev, color]);
                    else
                      setSelectedColors((prev) =>
                        prev.filter((c) => c !== color)
                      );
                  }}
                />
              }
              label={color}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Tags */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Tags
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {uniqueTags.map((tag, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedTags.includes(tag)}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedTags((prev) => [...prev, tag]);
                    else
                      setSelectedTags((prev) => prev.filter((t) => t !== tag));
                  }}
                />
              }
              label={tag}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FilterSection;
