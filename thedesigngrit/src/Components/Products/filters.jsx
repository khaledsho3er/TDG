import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Drawer,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

const FilterSection = ({ onFilterChange, products }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    colors: [],
    tags: [],
    priceRange: [349, 61564],
  });

  const [brands, setBrands] = useState([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("https://tdg-db.onrender.com/api/brand/");
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };

  const handlePriceChange = (event, newValue) => {
    setSelectedFilters((prev) => ({
      ...prev,
      priceRange: newValue,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      brands: [],
      colors: [],
      tags: [],
      priceRange: [349, 61564],
    });
  };

  const allColors = [...new Set(products.flatMap((p) => p.colors || []))];
  const allTags = [...new Set(products.flatMap((p) => p.tags || []))];

  return (
    <Box sx={{ width: isMobile ? "100%" : 300, padding: 2 }}>
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(false)}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
      )}
      <Typography variant="h6" fontWeight="bold">
        Filters:
      </Typography>

      {/* Selected Filters */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
        {["brands", "colors", "tags"].flatMap((type) =>
          selectedFilters[type].map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onDelete={() => handleFilterChange(type, filter)}
            />
          ))
        )}
      </Box>
      <Button onClick={clearFilters} size="small" color="error">
        Clear All
      </Button>

      {/* Brand Filter */}
      <Accordion
        disableGutters
        elevation={0}
        square
        sx={{
          "& .MuiAccordionSummary-root": {
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
          "& .MuiAccordionSummary-root.Mui-focusVisible": {
            backgroundColor: "transparent",
          },
          "& .MuiAccordionSummary-root.Mui-expanded": {
            backgroundColor: "transparent",
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Brands ({selectedFilters.brands.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {brands.map((brand) => (
            <FormControlLabel
              key={brand.brandName}
              control={
                <Checkbox
                  checked={selectedFilters.brands.includes(brand.brandName)}
                  onChange={() => handleFilterChange("brands", brand.brandName)}
                />
              }
              label={brand.brandName}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Price Filter */}
      <Accordion
        disableGutters
        elevation={0}
        square
        sx={{
          "& .MuiAccordionSummary-root": {
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
          "& .MuiAccordionSummary-root.Mui-focusVisible": {
            backgroundColor: "transparent",
          },
          "& .MuiAccordionSummary-root.Mui-expanded": {
            backgroundColor: "transparent",
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Price</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={selectedFilters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={349}
            max={61564}
          />
        </AccordionDetails>
      </Accordion>

      {/* Color Filter */}
      <Accordion
        disableGutters
        elevation={0}
        square
        sx={{
          "& .MuiAccordionSummary-root": {
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
          "& .MuiAccordionSummary-root.Mui-focusVisible": {
            backgroundColor: "transparent",
          },
          "& .MuiAccordionSummary-root.Mui-expanded": {
            backgroundColor: "transparent",
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Colors ({selectedFilters.colors.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {allColors.map((color) => (
            <FormControlLabel
              key={color}
              control={
                <Checkbox
                  checked={selectedFilters.colors.includes(color)}
                  onChange={() => handleFilterChange("colors", color)}
                />
              }
              label={color}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Tags Filter */}
      <Accordion
        disableGutters
        elevation={0}
        square
        sx={{
          "& .MuiAccordionSummary-root": {
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
          "& .MuiAccordionSummary-root.Mui-focusVisible": {
            backgroundColor: "transparent",
          },
          "& .MuiAccordionSummary-root.Mui-expanded": {
            backgroundColor: "transparent",
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Tags ({selectedFilters.tags.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {allTags.map((tag) => (
            <FormControlLabel
              key={tag}
              control={
                <Checkbox
                  checked={selectedFilters.tags.includes(tag)}
                  onChange={() => handleFilterChange("tags", tag)}
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
