import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
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
import { IoLogOutOutline } from "react-icons/io5";

import { UserContext } from "../utils/userContext";
import axios from "axios";
import { useCart } from "../Context/cartcontext";
import Badge from "@mui/material/Badge";

function Header() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for the avatar menu
  const { cartItems } = useCart();
  const { userSession, logout } = useContext(UserContext); // Access both userSession and setUserSession
  const navigate = useNavigate(); // Hook for navigation
  const [isMobile, setIsMobile] = useState(window.innerWidth < 767);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    phoneNumber: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]); // Clear suggestions if input is empty
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/search-suggestions?query=${query}`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name); // Set search input to selected suggestion
    setSuggestions([]); // Hide suggestions
    navigate(
      `/search?query=${suggestion.name}&category=${
        suggestion.category?.name || ""
      }`
    );
  };

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
        console.log("userSession in Header:", userSession);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.response || error);
      }
    };

    fetchData();
  }, [userSession]);

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
    setHoveredCategory(category._id);
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
  // Menu Toggle Handler
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); // Call logout from context
    navigate("/home"); // Redirect to home or login page
  };

  const handleMyAccount = () => {
    navigate("/myaccount"); // Navigate to MyAccount page
    handleMenuClose(); // Close the menu after clicking
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
            <SearchIcon
              sx={{ color: "#999", cursor: "pointer" }}
              onClick={() => navigate(`/search?query=${searchQuery}`)}
            />
            <InputBase
              placeholder="Search by category, brand, product type, or name"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) =>
                e.key === "Enter" && navigate(`/search?query=${searchQuery}`)
              }
            />

            {/* Suggestion Dropdown */}
            {Array.isArray(suggestions) && suggestions.length > 0 && (
              <Box className="suggestions-box">
                {suggestions.map((suggestion) => (
                  <Typography
                    key={suggestion._id} // Use _id instead of index for better performance
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}{" "}
                    {suggestion.category || suggestion.brand || suggestion.type
                      ? `(${
                          suggestion.category ||
                          suggestion.brand ||
                          suggestion.type
                        })`
                      : ""}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>

          {/* Icons */}
          <Box className="icon-container">
            {userSession ? (
              <>
                <IconButton onClick={handleFavoritesToggle}>
                  <FavoriteBorderIcon fontSize="20px" />
                </IconButton>
                <IconButton onClick={handleCartToggle}>
                  <Badge badgeContent={totalCartItems} color="error">
                    <ShoppingCartIcon fontSize="20px" />
                  </Badge>
                </IconButton>
                <Avatar
                  className="avatar"
                  onClick={handleAvatarClick}
                  sx={{ cursor: "pointer" }}
                >
                  {userData?.firstName?.charAt(0)?.toUpperCase() || "TDG"}
                </Avatar>

                {/* Avatar Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <MenuItem onClick={handleMyAccount}>My Account</MenuItem>
                  <MenuItem onClick={handleLogout}>
                    {" "}
                    <IoLogOutOutline style={{ marginRight: "10px" }} /> Logout
                  </MenuItem>
                </Menu>
              </>
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
                hoveredCategory === category._id ? "highlighted" : ""
              }`}
              onMouseEnter={() => handleMouseEnterCategory(category)}
            >
              {category.name}
            </Typography>
          ))
        )}
      </Box>

      {hoveredCategory && (
        <Menudrop
          category={menuData.find((item) => item._id === hoveredCategory)}
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
