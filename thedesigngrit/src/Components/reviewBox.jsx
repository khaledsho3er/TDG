import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder"; // For empty stars

const ReviewBox = () => {
  const reviews = [
    { stars: 5, count: 99, percentage: 90 },
    { stars: 4, count: 80, percentage:  80},
    { stars: 3, count: 2, percentage: 50 },
    { stars: 2, count: 1, percentage: 20 },
    { stars: 1, count: 1, percentage: 10 },
  ];

  return (
    <Box
      sx={{
        width: "30%", // Make the box smaller
        padding: "20px",
        border: "0.5px solid #777",
        borderRadius: "10px",
        backgroundColor: "fff",
        display: "flex",
        flexDirection: "row",
        alignItems: "start", // Center the content
        justifyContent: "space-between",
        gap: "20px",
      }}
    >
      {/* Overall Rating */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "1.5rem", // Slightly larger for emphasis
          }}
        >
          4.6
          <StarIcon sx={{ color: "#777", fontSize: "20px" }} />
        </Typography>
        <Typography variant="body2" sx={{ color: "#555", textAlign: "left" , fontSize:"0.8rem"}}>
          Based on 122 reviews
        </Typography>
      </Box>

      {/* Review Breakdown */}
      <Box sx={{ width: "50%"}}>
        {reviews.map((review, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
              justifyContent: "space-between", // Align stars, progress, and count properly
            }}
          >
             {/* Display 5 stars, filled stars based on review rating */}
             <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {[...Array(5)].map((_, i) => (
                i < review.stars ? (
                  <StarIcon key={i} sx={{ color: "#777", fontSize: "18px" }} />
                ) : (
                  <StarBorderIcon key={i} sx={{ color: "#777", fontSize: "18px" }} />
                )
              ))}
            </Box>

            {/* Progress Bar */}
            <LinearProgress
              variant="determinate"
              value={review.percentage}
              sx={{
                flex: 1,
                height: "8px", // Uniform height for the bars
                borderRadius: "5px",
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#777", // Gold color for filled bars
                },
              }}
            />

            {/* Count of reviews */}
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8rem", // Smaller font for the count
                color: "#555",
                marginLeft: "8px",
              }}
            >
              ({review.count})
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReviewBox;
