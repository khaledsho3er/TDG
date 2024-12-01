import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FilterVSection = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const categories = {
    Furniture: [
      "Sofas and armchairs",
      "Tables and chairs",
      "Storage systems and units",
      "Sleeping area and children's rooms",
      "Kids furniture",
    ],
    Bathroom: [
      "Washbasins and bathroom fixtures",
      "Bathroom taps",
      "Bathroom furniture",
      "Laundry and household cleaning",
      "Disabled bathrooms",
    ],
    Office: [
      "Office furniture",
      "Office lighting",
      "Meeting and waiting rooms",
      "Office partitions",
    ],
    Kitchen: [],
    Decor: [],
  };

  const countries = [
    "Italy",
    "Germany",
    "Egypt",
    "Turkey",
    "Spain",
    "Sweden",
    "United States",
    "Poland",
    "Austria",
    "United Kingdom",
  ];

  const toggleSelection = (item, setSelected) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCountries([]);
  };

  return (
    <Box
      sx={{
        width: 300,
        paddingTop: "40px",
        paddingLeft: "50px",
        paddingRight: "16px", // Added padding to the right side
        "@media (max-width: 600px)": { width: "100%", paddingLeft: "20px" }, // Adjust for small screens
        "@media (max-width: 600px)": { paddingRight: "8px" }, // Adjust padding on small screens
      }}
    >
      {/* Display selected filters */}
      <Box mb={2}>
        <Typography
          variant="h6"
          sx={{ fontFamily: "Horizon", fontWeight: "bold" }}
        >
          Filters:
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginY: 1 }}>
          {[...selectedCategories, ...selectedCountries].map(
            (filter, index) => (
              <Chip
                key={index}
                label={filter}
                onDelete={() => {
                  if (selectedCategories.includes(filter)) {
                    setSelectedCategories((prev) =>
                      prev.filter((item) => item !== filter)
                    );
                  } else {
                    setSelectedCountries((prev) =>
                      prev.filter((item) => item !== filter)
                    );
                  }
                }}
              />
            )
          )}
        </Box>
        <Button onClick={clearFilters} size="small" color="error">
          Clear All
        </Button>
      </Box>

      {/* Category Filter */}
      <Box sx={{ border: "2px solid #333", marginBottom: "16px" }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}
            >
              Category
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              maxHeight: 300,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px", // Set width of the scrollbar
                borderRadius: "10px", // Add border radius to the scrollbar
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888", // Set color of the thumb
                borderRadius: "10px", // Rounded corners for thumb
                border: "2px solid #ddd", // Optional border around thumb
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1", // Background color for track
                borderRadius: "10px", // Add border radius to the track
              },
            }}
          >
            {Object.keys(categories).map((mainCategory) => (
              <Accordion key={mainCategory} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{mainCategory}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {categories[mainCategory].map((subCategory) => (
                    <FormControlLabel
                      key={subCategory}
                      control={
                        <Checkbox
                          checked={selectedCategories.includes(subCategory)}
                          onChange={() =>
                            toggleSelection(subCategory, setSelectedCategories)
                          }
                        />
                      }
                      label={subCategory}
                    />
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Country Filter */}
      <Box sx={{ border: "2px solid #333" }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}
            >
              Country
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              maxHeight: 300,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px", // Set width of the scrollbar
                borderRadius: "10px", // Add border radius to the scrollbar
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888", // Set color of the thumb
                borderRadius: "10px", // Rounded corners for thumb
                border: "2px solid #ddd", // Optional border around thumb
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1", // Background color for track
                borderRadius: "10px", // Add border radius to the track
              },
            }}
          >
            {countries.map((country) => (
              <FormControlLabel
                key={country}
                control={
                  <Checkbox
                    checked={selectedCountries.includes(country)}
                    onChange={() =>
                      toggleSelection(country, setSelectedCountries)
                    }
                  />
                }
                label={country}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default FilterVSection;
