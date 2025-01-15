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
          border: "1px solid black",
          color: "black",
          fontFamily: "Montserrat, sans-serif",
          fontSize: "8px",
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
          backgroundColor: "#434343",
        }}
      >
        <FilterListIcon sx={{ fontSize: "10px" }} />
        Sort By
      </Button>
    </Box>
  );
}

export default TopVButtons;
