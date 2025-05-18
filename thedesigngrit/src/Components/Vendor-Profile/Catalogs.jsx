import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  useMediaQuery,
} from "@mui/material";
import VendorCatalogCard from "./CatalogCard";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function VendorCatalogs({ vendorID }) {
  const [catalogs, setCatalogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;
  const isMobile = useMediaQuery("(max-width:768px)");
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/catalogs/${vendorID}`
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
          fontSize: isMobile ? "18px" : "20px",
          padding: isMobile ? "15px" : "25px",
        }}
      >
        Catalogs
      </Typography>

      <Box
        position="relative"
        overflow="hidden"
        sx={{ padding: isMobile ? "10px 25px 30px" : "10px 50px 50px" }}
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
        ) : isMobile ? (
          // Mobile view with Swiper
          <Box sx={{ position: "relative" }}>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={15}
              slidesPerView={1}
              pagination={{
                clickable: true,
                el: ".swiper-pagination",
                type: "bullets",
              }}
              loop={catalogs.length > 1}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                // Update navigation refs after Swiper initialization
                if (swiper.params.navigation) {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }
              }}
              style={{ paddingBottom: "10px", color: "#2d2d2d" }}
            >
              {catalogs.map((item) => (
                <SwiperSlide key={item._id}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                      isMobile={isMobile}
                    />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom navigation and pagination container */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 0",
                marginTop: "10px",
              }}
            >
              {/* Pagination dots on the left */}
              <Box
                className="swiper-pagination"
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  "& .swiper-pagination-bullet": {
                    backgroundColor: "#2d2d2d",
                    opacity: 0.5,
                    margin: "0 4px",
                  },
                  "& .swiper-pagination-bullet-active": {
                    opacity: 1,
                    backgroundColor: "#2d2d2d",
                  },
                }}
              />

              {/* Navigation buttons on the right */}
              <Box sx={{ display: "flex", gap: "10px" }}>
                <IconButton
                  ref={prevRef}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    width: "35px",
                    height: "35px",
                  }}
                >
                  <ArrowBackIosNewIcon sx={{ fontSize: "16px" }} />
                </IconButton>
                <IconButton
                  ref={nextRef}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    width: "35px",
                    height: "35px",
                  }}
                >
                  <ArrowForwardIosIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ) : (
          // Desktop view with Grid
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
                    isMobile={isMobile}
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
