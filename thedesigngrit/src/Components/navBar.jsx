import React, { useState } from "react";
import { Box, Typography, InputBase, IconButton, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FloatingButton from "./ChatButton";
import ProfilePopup from "./profilePopUp";
import Stickedbutton from "./MoodboardButton";
import { Link } from "react-router-dom";
function Header() {
  const [popupOpen, setPopupOpen] = useState(false);

  const handlePopupToggle = () => {
    setPopupOpen(!popupOpen);
  };

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
          <Link to="/home" style={{ textDecoration: "none", color: "#2d2d2d" }}>
            <Typography className="logo" variant="h4">
              <img src="Assets/TDG_Logo_Black.png" alt="Logo" />
            </Typography>
          </Link>

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
              <FavoriteBorderIcon sx={{ fontSize: "17px" }} />
            </IconButton>
            <IconButton>
              <ShoppingCartIcon sx={{ fontSize: "17px" }} />
            </IconButton>
            <Box>
              <Typography
                sx={{
                  fontSize: "10px",
                }}
              >
                Egypt / EN
              </Typography>
            </Box>
            <Avatar
              className="avatar"
              onClick={handlePopupToggle}
              sx={{ cursor: "pointer" }}
            >
              K
            </Avatar>
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
      <Stickedbutton />
      <ProfilePopup open={popupOpen} onClose={handlePopupToggle} />
    </Box>
  );
}

export default Header;
