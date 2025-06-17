import React from "react";
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

const TopFilter = ({
  sortOption,
  setSortOption,
  onCADFilterChange,
  onSalePriceFilterChange,
}) => {
  const [forSaleChecked, setForSaleChecked] = React.useState(false);
  const [bimCadChecked, setBimCadChecked] = React.useState(false);

  // Update the button handlers
  const handleForSaleToggle = () => {
    const newValue = !forSaleChecked;
    setForSaleChecked(newValue);
    onSalePriceFilterChange(newValue);
  };

  const handleBimCadToggle = () => {
    const newValue = !bimCadChecked;
    setBimCadChecked(newValue);
    onCADFilterChange(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        padding: { xs: "15px", sm: "20px", md: "25px 25px 25px 265px" },
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 2, sm: 3 },
        alignItems: { xs: "flex-end", sm: "flex-end", md: "center" },
      }}
    >
      {/* Toggle Buttons */}
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-start",
            paddingLeft: {
              xs: "20px",
              sm: "50px",
              md: "100px",
              lg: "300px",
              xl: "200px",
            },
          }}
        >
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
              fontSize: { xs: "10px", sm: "12px" },
              "&:hover": {
                backgroundColor: "#2d2d2d",
                color: "white",
              },
            }}
            onClick={handleForSaleToggle}
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
              fontSize: { xs: "10px", sm: "12px" },
              "&:hover": {
                backgroundColor: "#2d2d2d",
                color: "white",
              },
            }}
            onClick={handleBimCadToggle}
          >
            {bimCadChecked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
            BIM/CAD
          </Button>
        </Box>
      </Box>
      {/* Sort By and Select */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "flex-end",
          flexDirection: { xs: "row", sm: "row" },
        }}
      >
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: { xs: "12px", sm: "13px" },
          }}
        >
          Sort By
        </Typography>
        <FormControl
          size="small"
          sx={{
            minWidth: "auto",
            "& .MuiOutlinedInput-root": {
              fontSize: "13px",
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
