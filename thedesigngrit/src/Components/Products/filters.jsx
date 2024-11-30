import React, { useState } from "react";
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

const FilterSection = () => {
  const [selectedFilters, setSelectedFilters] = useState([
    "Istikbal",
    "Colors",
  ]);
  const [priceRange, setPriceRange] = useState([349, 61564]);

  const brands = [
    "AL Kabani",
    "Art House",
    "Beirut Home",
    "Big House Furniture",
    "Carlos's Furniture",
    "Cousin Mansion",
    "Delta Home",
    "Desolay Furniture",
    "Eliss Home",
    "Istikbal",
  ];

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setPriceRange([349, 61564]);
  };

  return (
    <Box
      sx={{
        width: 300,
        paddingLeft: 3,
      }}
    >
      {/* Selected Filters */}
      <Box mb={2}>
        <Typography
          variant="h6"
          sx={{ fontFamily: "Horizon", fontWeight: "bold" }}
        >
          Filters:
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginY: 1 }}>
          {selectedFilters.map((filter, index) => (
            <Chip
              key={index}
              label={filter}
              onDelete={() =>
                setSelectedFilters((prev) =>
                  prev.filter((item) => item !== filter)
                )
              }
            />
          ))}
        </Box>
        <Button onClick={clearFilters} size="small" color="error">
          Clear All
        </Button>
      </Box>

      {/* Accordion Filters */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Category
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Categories go here.
          </Typography>
        </AccordionDetails>
      </Accordion>

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
                  checked={selectedFilters.includes(brand)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFilters((prev) => [...prev, brand]);
                    } else {
                      setSelectedFilters((prev) =>
                        prev.filter((item) => item !== brand)
                      );
                    }
                  }}
                />
              }
              label={brand}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Shape
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Shapes go here.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Type
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Types go here.
          </Typography>
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
              value={priceRange}
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
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
              />
              <TextField
                label="Max"
                variant="outlined"
                size="small"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
              />
            </Box>
            <Button variant="contained" size="small" sx={{ marginTop: 1 }}>
              Apply
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            BIM / CAD
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            BIM / CAD options go here.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Colors
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontFamily: "Montserrat", fontWeight: "Regular" }}>
            Colors options go here.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FilterSection;
