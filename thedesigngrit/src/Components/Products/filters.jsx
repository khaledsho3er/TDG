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
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

const FilterSection = ({ products, onFilteredProductsChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    colors: [],
    tags: [],
    priceRange: [349, 61564],
  });
  const [brands, setBrands] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const uniqueColors = [...new Set(products.flatMap((p) => p.colors))];
  const uniqueTags = [...new Set(products.flatMap((p) => p.tags))];

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
    const filteredProducts = products.filter((product) => {
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
    onFilteredProductsChange(filteredProducts);
  }, [selectedFilters, products, onFilteredProductsChange]);

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };

  const handlePriceChange = (_, newValue) => {
    setSelectedFilters((prev) => ({ ...prev, priceRange: newValue }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      brands: [],
      colors: [],
      tags: [],
      priceRange: [349, 61564],
    });
  };

  const renderFilters = () => (
    <Box sx={{ width: isMobile ? "100%" : 300, padding: 2 }}>
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(false)}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
      )}
      <Box mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Filters:
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
          {[
            ...selectedFilters.brands,
            ...selectedFilters.colors,
            ...selectedFilters.tags,
          ].map((filter, index) => (
            <Chip
              key={index}
              label={filter}
              onDelete={() => handleFilterChange("brands", filter)}
            />
          ))}
        </Box>
        <Button onClick={clearFilters} size="small" color="error">
          Clear All
        </Button>
      </Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Brands</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {brands.map((brand, index) => (
            <FormControlLabel
              key={index}
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
      <Accordion>
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
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Colors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {uniqueColors.map((color, index) => (
            <FormControlLabel
              key={index}
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
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Tags</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {uniqueTags.map((tag, index) => (
            <FormControlLabel
              key={index}
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
  return (
    <Box>
      {isMobile ? (
        <>
          <IconButton onClick={() => setDrawerOpen(true)}>
            <FilterListIcon />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            {renderFilters()}
          </Drawer>
        </>
      ) : (
        <Box sx={{ width: 300 }}>{renderFilters()}</Box>
      )}
    </Box>
  );
};

export default FilterSection;
