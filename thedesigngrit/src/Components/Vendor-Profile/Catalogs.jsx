import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import VendorCatalogCard from "./CatalogCard"; // Card Component
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function VendorCatalogs({ vendorID }) {
  const [catalogs, setCatalogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5; // Updated to display 5 cards per row

  // Fetch catalogs from the backend
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch(
          `https://tdg-db.onrender.com/api/catalogs/${vendorID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch catalogs");
        }
        const data = await response.json();
        setCatalogs(data);
      } catch (error) {
        console.error("Error fetching catalogs:", error);
      }
    };

    if (vendorID) {
      fetchCatalogs();
    }
  }, [vendorID]);

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
        Catalogs
      </Typography>
      <Box
        position="relative"
        overflow="hidden"
        sx={{ padding: "10px 50px 50px" }}
      >
        <IconButton
          onClick={handlePrev}
          disabled={currentIndex === 0}
          sx={{
            position: "absolute",
            left: "50px",
            top: "95%",
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
            <Grid item xs={12} sm={6} md={2.4} key={item._id}>
              {/* Pass data to the card component */}
              <VendorCatalogCard
                title={item.name}
                year={item.year}
                image={`https://pub-8c9ce55fbad6475eb1afe9472bd396e0.r2.dev/${item.image}`}
                type={item.type}
                pdf={`https://pub-8c9ce55fbad6475eb1afe9472bd396e0.r2.dev/${item.pdf}`}
              />
            </Grid>
          ))}
        </Grid>

        <IconButton
          onClick={handleNext}
          disabled={currentIndex + itemsPerPage >= catalogs.length}
          sx={{
            position: "absolute",
            right: "50px",
            top: "95%",
            transform: "translateY(-50%)",
            justifyContent: "space-between",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ArrowForwardIosIcon sx={{ backgroundColor: "none" }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default VendorCatalogs;
