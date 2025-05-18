import React from "react";
import { Box, Button } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterListIcon from "@mui/icons-material/FilterList";

function TopVButtons() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        paddingTop: 2,
        paddingRight: 6,
        gap: 1,
      }}
    >
      <Button
        sx={{
          border: "1px solid #2d2d2d",
          color: "black",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "8px",
          transition: "all 0.3s ease",

          "&:hover": {
            backgroundColor: "#2d2d2d",
            color: "white",
          },
        }}
      >
        <FilterAltIcon sx={{ fontSize: "10px" }} />
        Filter
      </Button>
      <Button
        sx={{
          border: "1px solid black",
          color: "white",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "8px",
          backgroundColor: "#2d2d2d",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "white",
            color: "#2d2d2d",
          },
        }}
      >
        <FilterListIcon sx={{ fontSize: "10px" }} />
        Sort By
      </Button>
    </Box>
  );
}

export default TopVButtons;
