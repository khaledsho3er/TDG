import React, { useState, useEffect } from "react";
import { Box, Typography, InputBase, IconButton, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FloatingButton from "./ChatButton";
import ProfilePopup from "./profilePopUp";
import Stickedbutton from "./MoodboardButton";
import ShoppingCartOverlay from "./Popups/CartOverlay";
import FavoritesOverlay from "./favoriteOverlay"; // Import the FavoritesOverlay component
import Menudrop from "./menuhover/Menudrop";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

function Header() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false); // State for FavoritesOverlay
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [menuData, setMenuData] = useState([]); // State to hold categories data as an array
  const [isMenuHovered, setIsMenuHovered] = useState(false); // Track if menu is hovered
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile] = useState(window.innerWidth < 767);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    // Fetch the categories and their details once when the component loads
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/categories/categories"
        ); // API that returns all categories
        if (!response.ok) {
          throw new Error("Failed to load categories");
        }
        const data = await response.json();
        setMenuData(data); // Save the category data
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the scroll position is greater than a threshold
      setIsSticky(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCartToggle = () => {
    setCartOpen(!cartOpen);
  };

  const handleFavoritesToggle = () => {
    setFavoritesOpen(!favoritesOpen); // Toggle FavoritesOverlay
  };

  const handlePopupToggle = () => {
    setPopupOpen(!popupOpen);
  };

  const handleMouseEnterCategory = (category) => {
    setHoveredCategory(category);
  };

  const handleMouseLeaveCategory = () => {
    if (!isMenuHovered) {
      setHoveredCategory(null); // Only hide the menu if not hovering over the menu itself
    }
  };

  const handleMenuHover = () => {
    setIsMenuHovered(true); // Set to true when hovering over the menu
  };

  const handleMenuLeave = () => {
    setIsMenuHovered(false); // Set to false when not hovering over the menu
    if (!hoveredCategory) {
      setHoveredCategory(null); // Hide menu if not hovering over anything
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
      className={`header-container ${isSticky ? "sticky" : ""}`}
    >
      {/* Top Header */}
      <Box className={`header ${isSticky ? "sticky" : ""}`}>
        <Box className="header-top">
          {/* Logo */}
          <Link to="/home" style={{ textDecoration: "none", color: "#2d2d2d" }}>
            <Typography className="logo" variant="h4">
              <img src="/Assets/TDG_Logo_Black.png" alt="Logo" />
            </Typography>
          </Link>

          {isMobile && (
            <IconButton onClick={toggleMenu}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Dropdown Menu */}
          {menuOpen && (
            <Box className="mobile-menu">
              <Typography className="menu-item">Home</Typography>
              <Typography className="menu-item">Shop</Typography>
              <Typography className="menu-item">About</Typography>
              <Typography className="menu-item">Contact</Typography>
            </Box>
          )}

          {/* Search */}
          <Box className="search-bar">
            <SearchIcon sx={{ color: "#999" }} />
            <InputBase
              placeholder="Search by category, brand, product type or name"
              fullWidth
            />
          </Box>

          {/* Icons */}
          <Box className="icon-container">
            <IconButton onClick={handleFavoritesToggle}>
              <FavoriteBorderIcon sx={{ fontSize: "17px" }} />
            </IconButton>
            <IconButton onClick={handleCartToggle}>
              <ShoppingCartIcon sx={{ fontSize: "17px" }} />
            </IconButton>
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
      <Box
        className="header-bottom"
        onMouseLeave={handleMouseLeaveCategory} // Hide overlay when leaving categories
      >
        {menuData.length === 0 ? (
          <Typography>No categories available</Typography> // Display if no data is available
        ) : (
          menuData.map((category) => (
            <Typography
              key={category._id} // Use the _id as a unique key
              className={`category ${
                hoveredCategory === category.name ? "highlighted" : ""
              }`}
              onMouseEnter={() => handleMouseEnterCategory(category.name)} // Show overlay on hover
            >
              {category.name} {/* Display the category name */}
            </Typography>
          ))
        )}
      </Box>

      {/* Overlay Menu */}
      {hoveredCategory && (
        <Menudrop
          category={hoveredCategory}
          details={menuData.find((item) => item.name === hoveredCategory)}
          onMouseEnter={handleMenuHover} // Keep the menu visible when hovering over it
          onMouseLeave={handleMenuLeave} // Close the menu when not hovering over it
        />
      )}

      {/* Additional Buttons */}
      <FloatingButton />
      <Stickedbutton className="moodboard-btn" />
      <ProfilePopup open={popupOpen} onClose={handlePopupToggle} />
      <ShoppingCartOverlay open={cartOpen} onClose={handleCartToggle} />
      <FavoritesOverlay open={favoritesOpen} onClose={handleFavoritesToggle} />
    </Box>
  );
}

export default Header;
