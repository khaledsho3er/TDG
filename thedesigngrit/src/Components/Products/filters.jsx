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

const FilterSection = ({ onFilterChange, products }) => {
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

  return (
    <Box>
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
                  checked={selectedFilters.brands.includes(brand._id)}
                  onChange={() => handleFilterChange("brands", brand._id)}
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
            onChange={(e, newValue) =>
              setSelectedFilters((prev) => ({
                ...prev,
                priceRange: newValue,
              }))
            }
            valueLabelDisplay="auto"
            min={349}
            max={61564}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FilterSection;
