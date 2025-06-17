import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Grid, useMediaQuery } from "@mui/material";
import VendorCatalogCard from "./CatalogCard";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/catalogs/${vendorID}`
        );
        if (!response.ok) throw new Error("Failed to fetch catalogs");
        const data = await response.json();
        setCatalogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching catalogs:", error);
        setCatalogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (vendorID) fetchCatalogs();
  }, [vendorID]);

  const visibleItems = Array.isArray(catalogs)
    ? catalogs.slice(currentIndex, currentIndex + itemsPerPage)
    : [];

  // const handleNext = () => {
  //   if (currentIndex + itemsPerPage < catalogs.length) {
  //     setCurrentIndex(currentIndex + itemsPerPage);
  //   }
  // };

  // const handlePrev = () => {
  //   if (currentIndex > 0) {
  //     setCurrentIndex(currentIndex - itemsPerPage);
  //   }
  // };

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "24px",
        maxWidth: "1700px",
        margin: "0 auto",
        mt: { xs: 2, md: 4 },
        mb: { xs: 2, md: 4 },
        px: { xs: 2, md: 6 },
        py: { xs: 2, md: 4 },
      }}
    >
      <Typography
        sx={{
          fontFamily: "Horizon",
          fontWeight: "bold",
          fontSize: isMobile ? "18px" : "32px",
          padding: isMobile ? "15px" : "25px",
        }}
      >
        Catalogs
      </Typography>

      <Box
        position="relative"
        overflow="hidden"
        sx={{ padding: isMobile ? "10px 25px 30px" : "10px 116px 50px" }}
      >
        {isLoading ? (
          <Typography sx={{ textAlign: "center", mt: 5 }}>
            Loading catalogs...
          </Typography>
        ) : Array.isArray(catalogs) && catalogs.length === 0 ? (
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
              loop={Array.isArray(catalogs) && catalogs.length > 1}
              navigation={false}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
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
          </Box>
        ) : (
          // Desktop view with Grid
          Array.isArray(catalogs) &&
          catalogs.length > 0 && (
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
          )
        )}
      </Box>
    </Box>
  );
}

export default VendorCatalogs;
