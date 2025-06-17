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
        const response = await fetch(
          "https://api.thedesigngrit.com/api/brand/"
        );
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
      priceRange: [0, 600000],
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
    <Box
      sx={{
        width: isMobile ? "90vw" : 300,
        p: isMobile ? "80px 0px 80px 42px" : "16px 0px 16px 0px",
        position: "relative",
        paddingRight: isMobile ? 0 : "55px",
      }}
    >
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(false)}
          sx={{ position: "absolute", top: 10, right: "-24px" }}
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
          "&:hover": {
            backgroundColor: "transparent",
            color: "#2d2d2d",
          },
          "&.Mui-expanded": {
            backgroundColor: "transparent",
            color: "#2d2d2d",
          },
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
            "&:hover": {
              backgroundColor: "transparent",
              color: "#fff",
            },
            "&.Mui-expanded": {
              backgroundColor: "transparent",
              color: "#2d2d2d",
            },
            "& .MuiSvgIcon-root": {
              color: "#2d2d2d",
            },
            "&:hover .MuiSvgIcon-root": {
              color: "#fff",
            },
            "&.Mui-expanded .MuiSvgIcon-root": {
              color: "#2d2d2d",
            },
          }}
        >
          <Typography>
            {getFilterLabel("Brands", selectedFilters.brands.length)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            display: "inline-grid",
            height: "253px",
            overflow: "auto",
            width: "96%",
            fontFamily: "Montserrat",
            fontWeight: "normal",
          }}
        >
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
          "&:hover": {
            backgroundColor: "transparent",
            color: "#2d2d2d",
          },
          "&.Mui-expanded": {
            backgroundColor: "transparent",
            color: "#2d2d2d",
          },
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
            "&:hover": {
              backgroundColor: "transparent",
              color: "#fff",
            },
            "&.Mui-expanded": {
              backgroundColor: "transparent",
              color: "#2d2d2d",
            },
            "& .MuiSvgIcon-root": {
              color: "#2d2d2d",
            },
            "&:hover .MuiSvgIcon-root": {
              color: "#fff",
            },
            "&.Mui-expanded .MuiSvgIcon-root": {
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
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2">
            Range:
            {selectedFilters.priceRange[0].toLocaleString()} E£ -{" "}
            {selectedFilters.priceRange[1].toLocaleString()}E£
          </Typography>

          <Slider
            value={selectedFilters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={600000}
            sx={(t) => ({
              color: "rgba(0,0,0,0.87)",
              "& .MuiSlider-track": {
                border: "none",
              },
              "& .MuiSlider-thumb": {
                width: 24,
                height: 24,
                backgroundColor: "#fff",
                "&::before": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                  boxShadow: "none",
                },
              },
              ...t.applyStyles("dark", {
                color: "#fff",
              }),
            })}
          />
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
          "&:hover": {
            backgroundColor: "transparent",
            color: "#2d2d2d",
          },
          "&.Mui-expanded": {
            backgroundColor: "transparent",
            color: "#2d2d2d",
          },
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
            "&:hover": {
              backgroundColor: "transparent",
              color: "#fff",
            },
            "&.Mui-expanded": {
              backgroundColor: "transparent",
              color: "#2d2d2d",
            },
            "& .MuiSvgIcon-root": {
              color: "#2d2d2d",
            },
            "&:hover .MuiSvgIcon-root": {
              color: "#fff",
            },
            "&.Mui-expanded .MuiSvgIcon-root": {
              color: "#2d2d2d",
            },
          }}
        >
          <Typography>
            {getFilterLabel("Colors", selectedFilters.colors.length)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            display: "inline-grid",
            height: "253px",
            overflow: "auto",
            width: "96%",
            fontFamily: "Montserrat",
            fontWeight: "normal",
          }}
        >
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
          "&:hover": {
            backgroundColor: "transparent",
            color: "#2d2d2d",
          },
          "&.Mui-expanded": {
            backgroundColor: "transparent",
            color: "#2d2d2d",
          },
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
            "&:hover": {
              backgroundColor: "transparent",
              color: "#fff",
            },
            "&.Mui-expanded": {
              backgroundColor: "transparent",
              color: "#2d2d2d",
            },
            "& .MuiSvgIcon-root": {
              color: "#2d2d2d",
            },
            "&:hover .MuiSvgIcon-root": {
              color: "#fff",
            },
            "&.Mui-expanded .MuiSvgIcon-root": {
              color: "#2d2d2d",
            },
          }}
        >
          <Typography>
            {getFilterLabel("Tags", selectedFilters.tags.length)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            display: "inline-grid",
            height: "253px",
            overflow: "auto",
            width: "96%",
            fontFamily: "Montserrat",
            fontWeight: "normal",
          }}
        >
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
        sx={{
          mb: 2,
          color: "#2d2d2d",
          backgroundColor: "transparent",
          border: "1px solid #2d2d2d",
          "&:hover": { backgroundColor: "#2d2d2d", color: "#fff" },
        }}
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
