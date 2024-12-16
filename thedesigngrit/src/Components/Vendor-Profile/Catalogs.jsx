import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import VendorCatalogCard from "./CatalogCard"; // Card Component
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function VendorCatalogs() {
  const [catalogs, setCatalogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5; // Updated to display 5 cards per row

  // Fetch JSON data from public folder
  useEffect(() => {
    fetch("/json/Vendorscatalog.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => setCatalogs(data))
      .catch((error) => console.error("Error fetching catalogs:", error));
  }, []);

  // Determine which items to display
  const visibleItems = catalogs.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  // Handlers for navigation
  const handleNext = () => {
    if (currentIndex + itemsPerPage < catalogs.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "Horizon",
          fontWeight: "bold",
          fontSize: "20px",
          padding: "25px",
        }}
      >
        Istikbal's Catalogs
      </Typography>
      <Box
        position="relative"
        overflow="hidden"
        sx={{ padding: "10px 50px 50px" }}
      >
        Left Arrow
        <IconButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          sx={{
            position: "absolute",
            left: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        {/* Cards Grid */}
        <Grid container spacing={2}>
          {visibleItems.map((item) => (
            <Grid item xs={12} sm={6} md={2.4} key={item.id}>
              {/* 5 cards per row means 20% width each (100/5 = 20%) */}
              <VendorCatalogCard
                title={item.title}
                year={item.year}
                image={item.image}
                type={item.type}
              />
            </Grid>
          ))}
        </Grid>
        Right Arrow
        <IconButton
          onClick={handleNext}
          disabled={currentIndex + itemsPerPage >= catalogs.length}
          sx={{
            position: "absolute",
            right: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default VendorCatalogs;
