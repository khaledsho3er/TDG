import React from "react";
import { Box, Typography, InputBase, IconButton, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FloatingButton from "./ChatButton";
function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderBottom: "1px solid #e0e0e0",
        width: "100%",
      }}
    >
      <Box className="header">
        <Box className="header-top">
          {/* Logo */}
          <Typography className="logo" variant="h4">
            <img src="Assets/TDG_Logo_Black.png" alt="Logo" />
          </Typography>

          {/* Search */}
          <Box className="search-bar">
            <SearchIcon sx={{ color: "#999" }} />
            <InputBase
              placeholder="Search among Product, Category, Brands, Decor, new"
              fullWidth
            />
          </Box>

          {/* Icons */}
          <Box className="icon-container">
            <IconButton>
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton>
              <ShoppingCartIcon />
            </IconButton>
            <Box>
              <Typography
                sx={{
                  fontSize: "15px",
                }}
              >
                Egypt / EN
              </Typography>
            </Box>
            <Avatar className="avatar">K</Avatar>
          </Box>
        </Box>
      </Box>

      {/* Categories */}
      <Box className="header-bottom">
        {[
          "Furniture",
          "Kitchen & Dining",
          "Bath",
          "Lighting",
          "Home Decor",
          "Outdoor",
          "Brand",
        ].map((category) => (
          <Typography key={category} className="category">
            {category}
          </Typography>
        ))}
      </Box>
      <FloatingButton />
    </Box>
  );
}

export default Header;
