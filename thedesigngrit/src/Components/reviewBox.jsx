import React from "react";
import { Box, Typography, LinearProgress, useMediaQuery } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const ReviewBox = ({ reviewsData }) => {
  const isMobile = useMediaQuery("(max-width:768px)");

  const totalCount = reviewsData.reduce((sum, r) => sum + r.count, 0);
  const averageRating = (
    reviewsData.reduce((sum, r) => sum + r.stars * r.count, 0) / totalCount
  ).toFixed(1);

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : "30%",
        padding: "20px",
        border: "0.5px solid #777",
        borderRadius: "10px",
        backgroundColor: "fff",
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
        justifyContent: "space-between",
        gap: "20px",
        marginBottom: "20px",
      }}
    >
      {/* Average Rating */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "1.5rem",
          }}
        >
          {averageRating}
          <StarIcon sx={{ color: "#777", fontSize: "20px" }} />
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#555", textAlign: "left", fontSize: "0.8rem" }}
        >
          Based on {totalCount} reviews
        </Typography>
      </Box>

      {/* Breakdown */}
      <Box sx={{ width: "50%" }}>
        {reviewsData.map((review, index) => {
          const percentage = ((review.count / totalCount) * 100).toFixed(0);

          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
                {[...Array(5)].map((_, i) =>
                  i < review.stars ? (
                    <StarIcon
                      key={i}
                      sx={{ color: "#777", fontSize: "18px" }}
                    />
                  ) : (
                    <StarBorderIcon
                      key={i}
                      sx={{ color: "#777", fontSize: "18px" }}
                    />
                  )
                )}
              </Box>

              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  flex: 1,
                  height: "8px",
                  borderRadius: "5px",
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#777",
                  },
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8rem",
                  color: "#555",
                  marginLeft: "8px",
                }}
              >
                ({review.count})
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ReviewBox;
