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
import TopFilter from "./TopFilters";

const FilterSection = ({
  onFilterChange,
  products = [],
  currentFilters,
  sortOption,
  setSortOption,
  onCADFilterChange,
  onSalePriceFilterChange,
}) => {
  const [selectedFilters, setSelectedFilters] = useState(currentFilters);
  const [brands, setBrands] = useState([]);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setSelectedFilters(currentFilters);
  }, [currentFilters]);

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

  const handleFilterChange = (type, value) => {
    const updated = selectedFilters[type].includes(value)
      ? selectedFilters[type].filter((item) => item !== value)
      : [...selectedFilters[type], value];

    const newFilters = { ...selectedFilters, [type]: updated };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (_, newRange) => {
    const newFilters = { ...selectedFilters, priceRange: newRange };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

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

  const allColors = Array.from(
    new Set(products.flatMap((p) => p.colors || []))
  );
  const allTags = Array.from(new Set(products.flatMap((p) => p.tags || [])));

  const getFilterLabel = (label, count) =>
    count > 0 ? `${label} (${count})` : label;

  const renderAccordion = (label, type, items) => (
    <Accordion disableGutters elevation={0} square sx={accordionStyle}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyle}>
        <Typography>
          {getFilterLabel(label, selectedFilters[type].length)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={detailsStyle}>
        {items.map((item) => (
          <FormControlLabel
            key={item._id || item}
            control={
              <Checkbox
                checked={selectedFilters[type].includes(item.brandName || item)}
                onChange={() =>
                  handleFilterChange(type, item.brandName || item)
                }
              />
            }
            label={item.brandName || item}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );

  const renderFilterContent = () => (
    <Box
      sx={{
        width: isMobile ? "90vw" : { xs: "90vw", sm: 300, md: 280, lg: 300 },
        p: {
          xs: "80px 16px 80px 16px",
          sm: "60px 24px 60px 24px",
          md: "24px",
        },
        position: "relative",
        // paddingRight: isMobile ? 0 : "0px",
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

      {isMobile && (
        <TopFilter
          sortOption={sortOption}
          setSortOption={setSortOption}
          onCADFilterChange={onCADFilterChange}
          onSalePriceFilterChange={onSalePriceFilterChange}
          isMobile={true}
          hasCAD={currentFilters.hasCAD}
          hasSalePrice={currentFilters.hasSalePrice}
        />
      )}

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

      {renderAccordion("Brands", "brands", brands)}

      <Accordion disableGutters elevation={0} square sx={accordionStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summaryStyle}>
          <Typography>Price</Typography>
        </AccordionSummary>
        <AccordionDetails sx={priceDetailsStyle}>
          <Typography variant="body2">
            Range: {selectedFilters.priceRange[0].toLocaleString()} E£ -{" "}
            {selectedFilters.priceRange[1].toLocaleString()}E£
          </Typography>
          <Slider
            value={selectedFilters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={600000}
            sx={sliderStyle}
          />
        </AccordionDetails>
      </Accordion>

      {renderAccordion("Colors", "colors", allColors)}
      {renderAccordion("Tags", "tags", allTags)}
    </Box>
  );

  return isMobile ? (
    <>
      <Button
        onClick={() => setDrawerOpen(true)}
        variant="outlined"
        sx={drawerButtonStyle}
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

const accordionStyle = {
  border: "1px solid #2d2d2d",
  borderRadius: "10px",
  backgroundColor: "transparent",
  fontFamily: "Montserrat",
  mb: 2,
  "&:before": { display: "none" },
  "&:hover": {
    backgroundColor: "transparent",
    color: "#2d2d2d",
  },
  "&.Mui-expanded": {
    backgroundColor: "transparent",
    color: "#2d2d2d",
  },
};

const summaryStyle = {
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
};

const detailsStyle = {
  display: "inline-grid",
  maxHeight: 300,
  overflowY: "auto",

  overflow: "auto",
  width: "100%",
  fontFamily: "Montserrat",
  fontWeight: "normal",
};

const priceDetailsStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "column",
  gap: 1,
};

const sliderStyle = (t) => ({
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
});

const drawerButtonStyle = {
  mb: 2,
  mt: 2,
  color: "#2d2d2d",
  backgroundColor: "transparent",
  border: "1px solid #2d2d2d",
  "&:hover": { backgroundColor: "#2d2d2d", color: "#fff" },
};

export default FilterSection;
