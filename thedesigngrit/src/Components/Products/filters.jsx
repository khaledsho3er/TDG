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

const FilterSection = ({ onFilterChange, products = [], currentFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState(currentFilters);
  const [brands, setBrands] = useState([]);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync filters from parent
  useEffect(() => {
    setSelectedFilters(currentFilters);
  }, [currentFilters]);

  // Fetch brands from backend
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("https://tdg-db.onrender.com/api/brand/");
        const data = await response.json();
        setBrands(data);
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };

    fetchBrands();
  }, []);

  // Helper to update filters
  const handleFilterChange = (type, value) => {
    const updated = selectedFilters[type].includes(value)
      ? selectedFilters[type].filter((item) => item !== value)
      : [...selectedFilters[type], value];

    const newFilters = { ...selectedFilters, [type]: updated };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Price change handler
  const handlePriceChange = (_, newRange) => {
    const newFilters = { ...selectedFilters, priceRange: newRange };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const reset = {
      brands: [],
      colors: [],
      tags: [],
      priceRange: [0, 1000000],
    };
    setSelectedFilters(reset);
    onFilterChange(reset);
  };

  // Extract unique colors and tags
  const allColors = Array.from(
    new Set(products.flatMap((p) => p.colors || []))
  );
  const allTags = Array.from(new Set(products.flatMap((p) => p.tags || [])));

  const getFilterLabel = (label, count) =>
    count > 0 ? `${label} (${count})` : label;

  // UI Section for all filters
  const renderFilterContent = () => (
    <Box sx={{ width: isMobile ? "100vw" : 300, p: 2, position: "relative" }}>
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(false)}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
      )}

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Filters
      </Typography>

      {/* Selected filter chips */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {["brands", "colors", "tags"].map((type) =>
          selectedFilters[type]?.map((item) => (
            <Chip
              key={item}
              label={item}
              onDelete={() => handleFilterChange(type, item)}
            />
          ))
        )}
      </Box>

      <Button
        onClick={clearFilters}
        size="small"
        color="#2d2d2d"
        sx={{ mb: 2, "&:hover": { background: "transparent" } }}
      >
        Clear All
      </Button>

      {/* Accordion Filters */}
      <Accordion
        disableGutters
        elevation={0}
        square
        sx={{
          border: "1px solid #2d2d2d",
          borderRadius: "10px",
          backgroundColor: "transparent",
          fontFamily: "Montserrat",

          mb: 2,
          "&:before": { display: "none" }, // removes default divider line
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "transparent",
            borderRadius: "10px",
            "& .MuiAccordionSummary-content": {
              fontFamily: "Montserrat",
              fontWeight: "normal",
              color: "#2d2d2d",
            },
          }}
        >
          <Typography>
            {getFilterLabel("Brands", selectedFilters.brands.length)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {brands.map((brand) => (
            <FormControlLabel
              key={brand._id}
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

      <Accordion
        disableGutters
        elevation={0}
        square
        sx={{
          border: "1px solid #2d2d2d",
          borderRadius: "10px",
          backgroundColor: "transparent",
          fontFamily: "Montserrat",

          mb: 2,
          "&:before": { display: "none" }, // removes default divider line
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "transparent",
            borderRadius: "10px",
            "& .MuiAccordionSummary-content": {
              fontFamily: "Montserrat",
              fontWeight: "normal",
              color: "#2d2d2d",
            },
          }}
        >
          <Typography>Price</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2">
            Range:
            {selectedFilters.priceRange[0].toLocaleString()} -{" "}
            {selectedFilters.priceRange[1].toLocaleString()}
          </Typography>
          <Typography variant="body2">
            ${selectedFilters.priceRange[0].toLocaleString()}
          </Typography>
          <Slider
            value={selectedFilters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={1000000}
          />
          <Typography variant="body2">
            ${selectedFilters.priceRange[1].toLocaleString()}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        disableGutters
        elevation={0}
        square
        sx={{
          border: "1px solid #2d2d2d",
          borderRadius: "10px",
          backgroundColor: "transparent",
          fontFamily: "Montserrat",

          mb: 2,
          "&:before": { display: "none" }, // removes default divider line
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "transparent",
            borderRadius: "10px",
            "& .MuiAccordionSummary-content": {
              fontFamily: "Montserrat",
              fontWeight: "normal",
              color: "#2d2d2d",
            },
          }}
        >
          <Typography>
            {getFilterLabel("Colors", selectedFilters.colors.length)}
          </Typography>
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

      <Accordion
        disableGutters
        elevation={0}
        square
        sx={{
          border: "1px solid #2d2d2d",
          borderRadius: "10px",
          backgroundColor: "transparent",
          fontFamily: "Montserrat",

          mb: 2,
          "&:before": { display: "none" }, // removes default divider line
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "transparent",
            borderRadius: "10px",
            "& .MuiAccordionSummary-content": {
              fontFamily: "Montserrat",
              fontWeight: "normal",
              color: "#2d2d2d",
            },
          }}
        >
          <Typography>
            {getFilterLabel("Tags", selectedFilters.tags.length)}
          </Typography>
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

  // Return: Drawer (mobile) or Sidebar (desktop)
  return isMobile ? (
    <>
      <Button
        onClick={() => setDrawerOpen(true)}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Show Filters
      </Button>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {renderFilterContent()}
      </Drawer>
    </>
  ) : (
    renderFilterContent()
  );
};

export default FilterSection;
