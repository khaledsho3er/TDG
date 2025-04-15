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

  // Inside the component
  const applyFilters = useCallback(() => {
    let filtered = products.filter((product) => {
      const matchesBrand =
        selectedFilters.brands.length === 0 ||
        selectedFilters.brands.includes(product.brand);

      const matchesColor =
        selectedFilters.colors.length === 0 ||
        product.colors.some((color) => selectedFilters.colors.includes(color));

      const matchesTag =
        selectedFilters.tags.length === 0 ||
        product.tags.some((tag) => selectedFilters.tags.includes(tag));

      const matchesPrice =
        product.price >= selectedFilters.priceRange[0] &&
        product.price <= selectedFilters.priceRange[1];

      return matchesBrand && matchesColor && matchesTag && matchesPrice;
    });

    onFilterChange(filtered);
  }, [products, selectedFilters, onFilterChange]); // Add dependencies

  useEffect(() => {
    applyFilters();
  }, [selectedFilters, applyFilters]); // No more ESLint warning ✅

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

  const renderFilters = () => {
    const allColors = Array.isArray(products)
      ? products.flatMap((p) => (Array.isArray(p.colors) ? p.colors : []))
      : [];
    const allTags = Array.isArray(products)
      ? products.flatMap((p) => (Array.isArray(p.tags) ? p.tags : []))
      : [];

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
            <Typography>Brands</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand.brandName}
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
            <Typography>Colors</Typography>
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
            <Typography>Tags</Typography>
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
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      {renderFilters()}
    </Drawer>
  ) : (
    <Box sx={{ width: 300 }}>{renderFilters()}</Box>
  );
};

export default FilterSection;
