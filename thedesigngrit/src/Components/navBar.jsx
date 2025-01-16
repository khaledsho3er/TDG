import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Avatar,
  Button,
} from "@mui/material";
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
import { useNavigate } from "react-router-dom";

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

  // Add logged-in state and user data
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

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

  // Simulate login state (Replace with real authentication logic)
  useEffect(() => {
    const loggedIn = false; // Change to true to simulate logged-in state
    const name = "John Doe"; // Replace with actual user name
    setIsLoggedIn(loggedIn);
    setUserName(name);
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
    setIsMenuHovered(true);
  };

  const handleMenuLeave = () => {
    setIsMenuHovered(false);
    if (!hoveredCategory) {
      setHoveredCategory(null);
    }
  };

  const handleSignUpClick = () => {
    console.log("Sign up clicked!");
    navigate("/login");
    // Add your signup navigation logic here
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
      <Box className={`header ${isSticky ? "sticky" : ""}`}>
        <Box className="header-top">
          <Link to="/home" style={{ textDecoration: "none", color: "#2d2d2d" }}>
            <Typography className="logo" variant="h4">
              <img src="/Assets/TDG_Logo_Black.png" alt="Logo" />
            </Typography>
          </Link>

          {isMobile && (
            <IconButton onClick={() => setMenuOpen(!menuOpen)}>
              <MenuIcon />
            </IconButton>
          )}

          {menuOpen && (
            <Box className="mobile-menu">
              <Typography className="menu-item">Home</Typography>
              <Typography className="menu-item">Shop</Typography>
              <Typography className="menu-item">About</Typography>
              <Typography className="menu-item">Contact</Typography>
            </Box>
          )}

          <Box className="search-bar">
            <SearchIcon sx={{ color: "#999" }} />
            <InputBase
              placeholder="Search by category, brand, product type or name"
              fullWidth
            />
          </Box>

          <Box className="icon-container">
            <IconButton onClick={handleFavoritesToggle}>
              <FavoriteBorderIcon fontSize="20px" />
            </IconButton>
            <IconButton onClick={handleCartToggle}>
              <ShoppingCartIcon fontSize="20px" />
            </IconButton>

            {isLoggedIn ? (
              <Avatar
                className="avatar"
                onClick={handlePopupToggle}
                sx={{ cursor: "pointer" }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            ) : (
              <button
                variant="contained"
                onClick={handleSignUpClick}
                className="Signup-btn-navbar"
              >
                Login
              </button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Categories Section */}
      <Box className="header-bottom" onMouseLeave={handleMouseLeaveCategory}>
        {menuData.length === 0 ? (
          <Typography>No categories available</Typography>
        ) : (
          menuData.map((category) => (
            <Typography
              key={category._id}
              className={`category ${
                hoveredCategory === category.name ? "highlighted" : ""
              }`}
              onMouseEnter={() => handleMouseEnterCategory(category.name)}
            >
              {category.name}
            </Typography>
          ))
        )}
      </Box>

      {hoveredCategory && (
        <Menudrop
          category={hoveredCategory}
          details={menuData.find((item) => item.name === hoveredCategory)}
          onMouseEnter={handleMenuHover}
          onMouseLeave={handleMenuLeave}
        />
      )}

      <FloatingButton />
      <Stickedbutton className="moodboard-btn" />
      <ProfilePopup open={popupOpen} onClose={handlePopupToggle} />
      <ShoppingCartOverlay open={cartOpen} onClose={handleCartToggle} />
      <FavoritesOverlay open={favoritesOpen} onClose={handleFavoritesToggle} />
    </Box>
  );
}

export default Header;
