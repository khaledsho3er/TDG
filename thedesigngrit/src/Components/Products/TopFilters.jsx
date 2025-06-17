import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const toggleButtonSx = {
  borderRadius: "10px",
  borderColor: "black",
  padding: "6px 10px",
  display: "flex",
  alignItems: "center",
  gap: 1,
  color: "black",
  fontFamily: "Montserrat, sans-serif",
  fontSize: { xs: "10px", sm: "12px" },
  "&:hover": {
    backgroundColor: "#2d2d2d",
    color: "white",
  },
};

const TopFilter = ({
  sortOption,
  setSortOption,
  onCADFilterChange,
  onSalePriceFilterChange,
}) => {
  const [forSaleChecked, setForSaleChecked] = useState(false);
  const [bimCadChecked, setBimCadChecked] = useState(false);

  const handleForSaleToggle = () => {
    setForSaleChecked((prev) => {
      const newValue = !prev;
      onSalePriceFilterChange(newValue);
      return newValue;
    });
  };

  const handleBimCadToggle = () => {
    setBimCadChecked((prev) => {
      const newValue = !prev;
      onCADFilterChange(newValue);
      return newValue;
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: { xs: 2, sm: 3 },
        padding: { xs: "15px", sm: "20px", md: "25px 70px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-start",
          width: { xs: "100%", sm: "auto", md: "100%", lg: "100%" }, // full width on mobile, auto on desktop
          flexWrap: { xs: "wrap", sm: "nowrap" },
          paddingLeft: { sm: 0, md: 0, lg: 0 }, // remove extra left padding on desktop if any
        }}
      >
        <Button
          sx={toggleButtonSx}
          onClick={handleForSaleToggle}
          variant="outlined"
        >
          {forSaleChecked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
          For Sale
          <ShoppingCartIcon fontSize="small" />
        </Button>

        <Button
          sx={toggleButtonSx}
          onClick={handleBimCadToggle}
          variant="outlined"
        >
          {bimCadChecked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
          BIM/CAD
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: { xs: 12, sm: 13 },
          }}
        >
          Sort By
        </Typography>
        <FormControl
          size="small"
          sx={{
            minWidth: 140,
            "& .MuiOutlinedInput-root": {
              fontSize: 13,
              "& fieldset": { border: "none" },
            },
          }}
        >
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            displayEmpty
            sx={{ fontSize: "0.875rem", color: "black" }}
          >
            <MenuItem value="Newest">Newest</MenuItem>
            <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
            <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
            <MenuItem value="Alphabetical: A-Z">Alphabetical: A-Z</MenuItem>
            <MenuItem value="Alphabetical: Z-A">Alphabetical: Z-A</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default TopFilter;
