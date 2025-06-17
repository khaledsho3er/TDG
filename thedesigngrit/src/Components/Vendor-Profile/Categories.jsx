import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, useMediaQuery, IconButton } from "@mui/material";
import VendorCategoryCard from "./CategoryCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const VendorCategoriesgrid = ({ vendor }) => {
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const swiperRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const isTablet = useMediaQuery("(max-width:1024px)");

  useEffect(() => {
    fetch(`https://api.thedesigngrit.com/api/brand/${vendor._id}/types`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => setTypes(data))
      .catch((error) => console.error("Error fetching types:", error))
      .finally(() => setIsLoading(false));
  }, [vendor._id]);

  const getSlidesPerView = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Horizon",
            fontWeight: "bold",
            fontSize: isMobile ? "18px" : "32px",
            padding: isMobile ? "15px 0" : "25px",
          }}
        >
          {vendor.brandName}'s Types
        </Typography>

        {types.length > 3 && !isMobile && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={handlePrev}
              sx={{
                bgcolor: "#f5f5f5",
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                bgcolor: "#f5f5f5",
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        )}
      </Box>

      {isLoading ? (
        <Typography sx={{ p: 2, color: "gray" }}>Loading...</Typography>
      ) : types.length === 0 ? (
        <Box
          sx={{
            padding: "40px 0",
            textAlign: "center",
            minHeight: "200px",
            border: "1px dashed #ccc",
            borderRadius: "12px",
            width: "100%",
            margin: "0 auto",
            marginTop: "20px",
          }}
        >
          <Typography variant="body1" sx={{ color: "#888" }}>
            No Types available at the moment.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ position: "relative", padding: "32px 71px" }}>
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={getSlidesPerView()}
            pagination={isMobile ? { clickable: true } : false}
            loop={types.length > getSlidesPerView()}
            navigation={false}
            className="vendor-types-swiper"
            style={{ padding: "10px 0 30px 0" }}
          >
            {types.map((type) => (
              <SwiperSlide key={type._id}>
                <VendorCategoryCard
                  id={type._id}
                  name={type.name}
                  description={type.description}
                  image={type.image}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </Box>
  );
};

export default VendorCategoriesgrid;
