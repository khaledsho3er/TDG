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
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import FloatingButton from "./ChatButton";
import ProfilePopup from "./profilePopUp";
// import Stickedbutton from "./MoodboardButton";
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
import LoadingScreen from "../Pages/loadingScreen";

function Header() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categoriesVisible, setCategoriesVisible] = useState(false); // State to toggle categories visibility
  const [menuData, setMenuData] = useState([]);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for the avatar menu
  const { cartItems } = useCart();
  const [anchorEls, setAnchorEls] = useState(null); // State for the avatar menu
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
  const [loading, setLoading] = useState(true);

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://tdg-db.onrender.com/api/categories/categories"
        );
        if (!response.ok) {
          throw new Error("Failed to load categories");
        }
        const data = await response.json();
        setMenuData(data.slice(0, 6)); // Slice the first 6 categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 10000);
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
        `https://tdg-db.onrender.com/api/products/search-suggestions?query=${query}`
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
      `/product/${suggestion._id}` // Navigate to product page
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
        const response = await axios.get(
          `https://tdg-db.onrender.com/api/getUserById/${userSession._id}`,
          {
            withCredentials: true,
          }
        );
        console.log("userSession in Header:", userSession);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error.response || error);
      } finally {
        setLoading(false);
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

  const handleResize = () => {
    setIsMobile(window.innerWidth < 767);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleShopClick = () => {
    setCategoriesVisible(!categoriesVisible); // Toggle visibility of categories
  };

  const handleShopClose = () => {
    setAnchorEls(null);
  };
  if (loading) {
    return <LoadingScreen />;
  }
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
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Link to="/home">
            <img
              src="/Assets/TDG_Logo_Black.webp"
              alt="Logo"
              width={69}
              height={69} // Adjust based on actual aspect ratio
              priority // Ensures it loads as early as possible
              className="menu-logo"
              loading="lazy"
              style={{ width: "69px", padding: "12px" }}
            />
          </Link>
          <Box sx={{ display: "flex", gap: "1rem", flexDirection: "row" }}>
            <IconButton onClick={handleFavoritesToggle}>
              <FavoriteBorderIcon fontSize="20px" />
            </IconButton>
            <IconButton onClick={handleCartToggle}>
              <Badge badgeContent={totalCartItems} color="error">
                <ShoppingCartIcon fontSize="20px" />
              </Badge>
            </IconButton>
            <IconButton onClick={toggleMenu}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      )}
      {/* Top Header */}
      <Box className={`header ${isSticky ? "sticky" : ""}`}>
        <Box className="header-top">
          {/* Logo */}
          <Link to="/home" style={{ textDecoration: "none", color: "#2d2d2d" }}>
            <Typography className="logo" variant="h4">
              <img src="/Assets/TDG_Logo_Black.webp" alt="Logo" />
            </Typography>
          </Link>

          {/* Full-Screen Mobile Menu */}
          {/* Full-Screen Mobile Menu */}
          {menuOpen && (
            <>
              {/* Backdrop */}
              <Box
                className={`backdrop ${menuOpen ? "open" : ""}`}
                onClick={toggleMenu}
              />
              <Box
                className={`full-page-menu ${menuOpen ? "open" : ""}`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  fontFamily: "Montserrat",
                  "& .menu-content": {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                  },
                  "& .menu-categories": {
                    display: categoriesVisible ? "flex" : "none", // Show or hide categories based on state
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginTop: "1rem",
                    "@media (max-width: 767px)": {
                      alignItems: "center",
                    },
                  },
                }}
              >
                <Box className="menu-header">
                  <Link to="/home">
                    <img
                      src="/Assets/TDG_Logo_Black.webp"
                      alt="Logo"
                      className="menu-logo"
                      style={{ width: "69px", padding: "12px" }}
                    />
                  </Link>
                  <IconButton onClick={toggleMenu} className="close-button">
                    <CloseIcon fontSize="large" />
                  </IconButton>
                </Box>

                <Box className="menu-content">
                  <Typography
                    onClick={() => navigate("/home")}
                    className="menu-item"
                  >
                    Home
                  </Typography>
                  <Typography
                    className="menu-item"
                    aria-controls={anchorEls ? "shop-menu" : undefined}
                    aria-haspopup="true"
                    onClick={handleShopClick} // Toggle categories visibility on click
                  >
                    Shop
                  </Typography>

                  {/* Categories */}
                  <Box
                    className={`menu-categories ${
                      categoriesVisible ? "open" : ""
                    }`}
                  >
                    {menuData.length > 0 ? (
                      menuData.map((category) => (
                        <Typography
                          key={category._id}
                          className="menu-category-item"
                          onClick={() => {
                            navigate(`/category/${category._id}/subcategories`);
                            handleShopClose();
                          }}
                        >
                          {category.name}
                        </Typography>
                      ))
                    ) : (
                      <Typography>No Categories Available</Typography>
                    )}
                  </Box>

                  <Typography
                    onClick={() => navigate("/about")}
                    className="menu-item"
                  >
                    About
                  </Typography>
                  <Typography
                    onClick={() => navigate("/contactus")}
                    className="menu-item"
                  >
                    Contact
                  </Typography>
                  {userSession ? (
                    <Typography
                      onClick={() => navigate("/myaccount")}
                      className="menu-item"
                    >
                      Account
                    </Typography>
                  ) : (
                    <></>
                  )}

                  {userSession ? (
                    <Typography onClick={handleLogout} className="menu-item">
                      Logout
                    </Typography>
                  ) : (
                    <Typography
                      onClick={handleLoginClick}
                      className="menu-item"
                    >
                      Login
                    </Typography>
                  )}
                </Box>
              </Box>
            </>
          )}

          {/* Dropdown Menu for Shop */}
          <Menu
            id="shop-menu"
            anchorEls={anchorEls}
            open={Boolean(anchorEls)}
            onClose={handleShopClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {menuData.length > 0 ? (
              menuData.map((category) => (
                <MenuItem
                  key={category._id}
                  onClick={() => {
                    navigate(`/shop/${category.slug}`);
                    handleShopClose();
                  }}
                >
                  {category.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Categories Available</MenuItem>
            )}
          </Menu>
          {/* Search */}
          <Box className="search-bar">
            <SearchIcon sx={{ color: "#999", cursor: "pointer" }} />
            <InputBase
              placeholder="Search by category, brand, product type, or name"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              // onKeyDown={(e) =>
              //   e.key === "Enter" && navigate(`/search?query=${searchQuery}`)
              // }
            />

            {/* Suggestion Dropdown */}
            {Array.isArray(suggestions) && suggestions.length > 0 && (
              <Box className="suggestions-dropdown">
                {suggestions.map((suggestion) => (
                  <Box
                    key={suggestion._id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {/* Product Image */}
                    {suggestion.mainImage && (
                      <img
                        src={`https://tdg-db.onrender.com/uploads/${suggestion.mainImage}`}
                        alt={suggestion.name}
                        className="suggestion-image"
                      />
                    )}

                    {/* Name & Category */}
                    <Box className="suggestion-text">
                      <Typography className="suggestion-name">
                        {suggestion.name}
                      </Typography>
                      {suggestion.category && (
                        <Typography className="suggestion-category">
                          {suggestion.category.name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
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

      {/* <FloatingButton />
      <Stickedbutton className="moodboard-btn" /> */}
      <ProfilePopup open={popupOpen} onClose={handlePopupToggle} />
      <ShoppingCartOverlay open={cartOpen} onClose={handleCartToggle} />
      <FavoritesOverlay open={favoritesOpen} onClose={handleFavoritesToggle} />
    </Box>
  );
}

export default Header;
