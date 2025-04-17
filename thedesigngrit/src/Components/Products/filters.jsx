import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Slider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function FilterSection({ products, setFilters }) {
  const uniqueBrands = [...new Set(products.map((p) => p.brand))];
  const uniqueColors = [...new Set(products.flatMap((p) => p.colors || []))];
  const uniqueTags = [...new Set(products.flatMap((p) => p.tags || []))];

  const handleCheckboxChange = (type, value) => {
    setFilters((prev) => {
      const isSelected = prev[type].includes(value);
      const updated = isSelected
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updated };
    });
  };

  const handlePriceChange = (event, newValue) => {
    setFilters((prev) => ({ ...prev, priceRange: newValue }));
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Brands</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {uniqueBrands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    onChange={() => handleCheckboxChange("brands", brand)}
                  />
                }
                label={brand}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Colors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {uniqueColors.map((color) => (
              <FormControlLabel
                key={color}
                control={
                  <Checkbox
                    onChange={() => handleCheckboxChange("colors", color)}
                  />
                }
                label={color}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Tags</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {uniqueTags.map((tag) => (
              <FormControlLabel
                key={tag}
                control={
                  <Checkbox
                    onChange={() => handleCheckboxChange("tags", tag)}
                  />
                }
                label={tag}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            step={50}
            onChangeCommitted={handlePriceChange}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default FilterSection;
