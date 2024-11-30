import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const TopFilter = () => {
  const [forSaleChecked, setForSaleChecked] = useState(false);
  const [bimCadChecked, setBimCadChecked] = useState(false);
  const [sortOption, setSortOption] = useState("Newest");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
      }}
    >
      {/* Toggle Buttons */}
      <Box sx={{ display: "flex", gap: 3, paddingRight: 30 }}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: "10px",
            borderColor: "black",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "black",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "10px",
          }}
          onClick={() => setForSaleChecked(!forSaleChecked)}
        >
          {forSaleChecked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
          For Sale
          <ShoppingCartIcon fontSize="small" />
        </Button>

        <Button
          variant="outlined"
          sx={{
            borderRadius: "10px",
            borderColor: "black",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "black",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "10px",
          }}
          onClick={() => setBimCadChecked(!bimCadChecked)}
        >
          {bimCadChecked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
          BIM/CAD
        </Button>
      </Box>

      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "13px",
          marginBottom: 5, // Add spacing between "Products" and "Sort By"
          paddingLeft: 20,
        }}
      >
        Products: <strong>7,251</strong>
      </Typography>

      {/* Sort By and Select */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexDirection: "row",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "13px",
          }}
        >
          Sort By
        </Typography>
        <FormControl
          size="small"
          sx={{
            minWidth: "auto", // Adjust to fit content
            border: "none", // Remove borders
            "& .MuiOutlinedInput-root": {
              padding: 0, // Adjust padding to make the Select smaller
              fontSize: "13px", // Set font size smaller
              "& fieldset": {
                border: "none", // Remove fieldset border
              },
            },
          }}
        >
          <Select
            labelId="sort-by-label"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            displayEmpty
            sx={{
              fontSize: "0.875rem", // Smaller font size
              color: "black",
              "& .MuiSelect-select": {
                padding: 0, // Adjust padding for inline appearance
              },
            }}
          >
            <MenuItem value="Newest">Newest</MenuItem>
            <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
            <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default TopFilter;
