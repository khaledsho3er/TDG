import React, { useState, useEffect, useContext } from "react";
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
import FavoritesOverlay from "./favoriteOverlay";
import Menudrop from "./menuhover/Menudrop";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
// Context for managing user session
import { UserContext } from "../utils/userContext";
import axios from "axios";

function Header() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { userSession } = useContext(UserContext); // Access user session from context
  const navigate = useNavigate(); // Hook for navigation
  const [isMobile, setIsMobile] = useState(window.innerWidth < 767);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/categories/categories"
        );
        if (!response.ok) {
          throw new Error("Failed to load categories");
        }
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767); // Update state on window resize
    };

    window.addEventListener("resize", handleResize); // Add resize event listener
    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    // Fetch user data
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getUser", {
          withCredentials: true,
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.response || error);
        alert("Failed to fetch user data.");
      }
    };

    fetchData();
  }, []);

  const handleCartToggle = () => {
    setCartOpen(!cartOpen);
  };

  const handleFavoritesToggle = () => {
    setFavoritesOpen(!favoritesOpen);
  };

  const handlePopupToggle = () => {
    setPopupOpen(!popupOpen);
  };

  const handleMouseEnterCategory = (category) => {
    setHoveredCategory(category);
  };

  const handleMouseLeaveCategory = () => {
    if (!isMenuHovered) {
      setHoveredCategory(null);
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLoginClick = () => {
    navigate("/login"); // Redirect to login page
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
              <FavoriteBorderIcon fontSize="20px" />
            </IconButton>
            <IconButton onClick={handleCartToggle}>
              <ShoppingCartIcon fontSize="20px" />
            </IconButton>
            {userSession ? (
              <Avatar
                className="avatar"
                onClick={handlePopupToggle}
                sx={{ cursor: "pointer" }}
              >
                {userData.firstName
                  ? userData.firstName[0].toUpperCase()
                  : "TDG"}
              </Avatar>
            ) : (
              <button
                variant="contained"
                onClick={handleLoginClick}
                className="Signup-btn-navbar"
              >
                Login
              </button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Categories */}
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
