import React, { useState, useEffect } from "react";
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

const FilterSection = ({ onFilterChange, products, currentFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState(currentFilters);
  const [brands, setBrands] = useState([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync with parent filters
  useEffect(() => {
    setSelectedFilters(currentFilters);
  }, [currentFilters]);

  // Fetch brands
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

  const handleFilterChange = (type, value) => {
    const newFilters = {
      ...selectedFilters,
      [type]: selectedFilters[type].includes(value)
        ? selectedFilters[type].filter((item) => item !== value)
        : [...selectedFilters[type], value],
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (event, newValue) => {
    const newFilters = {
      ...selectedFilters,
      priceRange: newValue,
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      brands: [],
      colors: [],
      tags: [],
      priceRange: [0, 1000000],
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderFilters = () => {
    const allColors = Array.isArray(products)
      ? products.flatMap((p) => (Array.isArray(p.colors) ? p.colors : []))
      : [];
    const allTags = Array.isArray(products)
      ? products.flatMap((p) => (Array.isArray(p.tags) ? p.tags : []))
      : [];

    const getFilterLabel = (label, count) =>
      count > 0 ? `${label} (${count})` : label;

    const FilterBlock = ({ title, children }) => (
      <Box
        sx={{
          border: "1px solid #D3D3D3",
          borderRadius: "10px",
          mb: 2,
          px: 2,
          py: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          {title}
        </Typography>
        {children}
      </Box>
    );

    return (
      <Box sx={{ width: isMobile ? "100%" : 300, p: 2 }}>
        {isMobile && (
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Filters: (
          {[...selectedFilters.brands, ...selectedFilters.tags].length})
        </Typography>

        {/* Selected Filters */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          {["brands", "colors", "tags"].flatMap((type) =>
            selectedFilters[type].map((filter) => (
              <Chip
                key={filter}
                label={filter}
                onDelete={() => handleFilterChange(type, filter)}
              />
            ))
          )}
          <Button onClick={clearFilters} size="small" color="error">
            Clear All
          </Button>
        </Box>

        {/* Categories – Add more blocks like this */}
        <FilterBlock title="Brands">
          <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand._id}
                control={
                  <Checkbox
                    checked={selectedFilters.brands.includes(brand.brandName)}
                    onChange={() =>
                      handleFilterChange("brands", brand.brandName)
                    }
                  />
                }
                label={brand.brandName}
              />
            ))}
          </Box>
        </FilterBlock>

        <FilterBlock title="Price">
          <Slider
            value={selectedFilters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="off"
            min={349}
            max={61564}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <input
              type="number"
              value={selectedFilters.priceRange[0]}
              min={349}
              max={selectedFilters.priceRange[1]}
              onChange={(e) =>
                handlePriceChange(null, [
                  Number(e.target.value),
                  selectedFilters.priceRange[1],
                ])
              }
              style={{
                width: "45%",
                padding: "6px",
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              value={selectedFilters.priceRange[1]}
              min={selectedFilters.priceRange[0]}
              max={61564}
              onChange={(e) =>
                handlePriceChange(null, [
                  selectedFilters.priceRange[0],
                  Number(e.target.value),
                ])
              }
              style={{
                width: "45%",
                padding: "6px",
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
          </Box>
        </FilterBlock>

        <FilterBlock title="Colors">
          <Box sx={{ maxHeight: 120, overflowY: "auto" }}>
            {Array.from(new Set(allColors)).map((color) => (
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
          </Box>
        </FilterBlock>

        <FilterBlock title="Tags">
          <Box sx={{ maxHeight: 120, overflowY: "auto" }}>
            {Array.from(new Set(allTags)).map((tag) => (
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
          </Box>
        </FilterBlock>
      </Box>
    );
  };
};

export default FilterSection;
