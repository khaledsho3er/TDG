import React from "react";
import { Box, Typography } from "@mui/material";

const VendorCategoryCard = ({ name, description, image }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "300px",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      <Box
        component="img"
        src={image}
        alt={name}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px",
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontFamily: "Horizon",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {name}
        </Typography>
      </Box>
    </Box>
  );
};

export default VendorCategoryCard;
