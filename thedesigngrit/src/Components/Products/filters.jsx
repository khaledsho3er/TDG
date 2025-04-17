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
      priceRange: [0, 100000000],
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
          {selectedFilters.brands.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onDelete={() => handleFilterChange("brands", filter)}
            />
          ))}
          {selectedFilters.colors.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onDelete={() => handleFilterChange("colors", filter)}
            />
          ))}
          {selectedFilters.tags.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onDelete={() => handleFilterChange("tags", filter)}
            />
          ))}
        </Box>

        <Button onClick={clearFilters} size="small" color="error">
          Clear All
        </Button>

        {/* Brand Filter */}
        <Accordion disableGutters elevation={0} square>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {getFilterLabel("Brands", selectedFilters.brands.length)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand._id} // Use brand._id as key since it's unique
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
          </AccordionDetails>
        </Accordion>

        {/* Price Filter */}
        <Accordion disableGutters elevation={0} square>
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
        <Accordion disableGutters elevation={0} square>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {getFilterLabel("Colors", selectedFilters.colors.length)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>

        {/* Tags Filter */}
        <Accordion disableGutters elevation={0} square>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {getFilterLabel("Tags", selectedFilters.tags.length)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  return isMobile ? (
    <>
      <Button onClick={() => setDrawerOpen(true)}>Show Filters</Button>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {renderFilters()}
      </Drawer>
    </>
  ) : (
    renderFilters()
  );
};

export default FilterSection;
