import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import VendorCatalogCard from "./CatalogCard";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function VendorCatalogs({ vendorID }) {
  const [catalogs, setCatalogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCatalogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://tdg-db.onrender.com/api/catalogs/${vendorID}`
        );
        if (!response.ok) throw new Error("Failed to fetch catalogs");
        const data = await response.json();
        setCatalogs(data);
      } catch (error) {
        console.error("Error fetching catalogs:", error);
        setCatalogs([]); // fallback to empty array
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorID) fetchCatalogs();
  }, [vendorID]);

  const visibleItems = catalogs.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

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
        {isLoading ? (
          <Typography sx={{ textAlign: "center", mt: 5 }}>
            Loading catalogs...
          </Typography>
        ) : catalogs.length === 0 ? (
          <Box
            sx={{
              padding: "40px 0",
              textAlign: "center",
              minHeight: "200px",
              border: "1px dashed #ccc",
              borderRadius: "12px",
            }}
          >
            <Typography variant="body1" sx={{ color: "#888" }}>
              No catalogs available at the moment.
            </Typography>
          </Box>
        ) : (
          <>
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

            <Grid container spacing={2}>
              {visibleItems.map((item) => (
                <Grid item xs={12} sm={6} md={2.4} key={item._id}>
                  <VendorCatalogCard
                    title={item.title || "Untitled Catalog"}
                    year={item.year || "N/A"}
                    image={
                      item.image
                        ? `https://pub-8c9ce55fbad6475eb1afe9472bd396e0.r2.dev/${item.image}`
                        : "/placeholder.jpg"
                    }
                    type={item.type || "Unknown Type"}
                    pdf={
                      item.pdf
                        ? `https://pub-8c9ce55fbad6475eb1afe9472bd396e0.r2.dev/${item.pdf}`
                        : "#"
                    }
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
                zIndex: 1,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
}

export default VendorCatalogs;
