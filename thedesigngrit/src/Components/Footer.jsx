import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { Facebook, Instagram } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import { Link } from "react-router-dom";
import GreetingModal from "./successMsgs/greeting";

function Footer() {
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.thedesigngrit.com/api/categories/categories"
        );
        if (!response.ok) {
          throw new Error("Failed to load categories");
        }
        const data = await response.json();
        setCategories(data.slice(0, 6)); // Taking the first 6 categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleSubscribe = async () => {
    if (!email) {
      setError("Please enter an email.");
      return;
    }
    if (!isChecked) {
      setError("You must agree to receive newsletters.");
      return;
    }

    try {
      const response = await fetch(
        "https://api.thedesigngrit.com/api/newsletter/subscribe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      console.log(`Subscription response status: ${response.status}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setEmail(email);
      setIsChecked(false);
      setEmail("");
      setError("");
      setShowModal(true); // Show modal after successful subscription
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <Box
      sx={{
        bgcolor: "#f7f2f2",
        padding: { xs: 2, md: 5 },
        paddingBottom: 1,
        marginTop: 2,
        paddingTop: { xs: 3, md: 5 },
        width: "100%",
        minWidth: "99.4vw",
        boxSizing: "border-box",
        position: "relative",
        left: 0,
        right: 0,
      }}
    >
      {/* Main Footer Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Stack on mobile, row on desktop
          justifyContent: "space-between",
          gap: { xs: 4, md: 2 }, // Add spacing between sections
          alignItems: { xs: "flex-start", md: "center" }, // Align left on mobile
        }}
      >
        {/* Newsletter Section */}
        <Box sx={{ flex: 1, minWidth: { xs: "100%", md: "300px" } }}>
          <Link to="/home" style={{ textDecoration: "none", color: "#2d2d2d" }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              <img src="/Assets/TDG_Logo_Black.webp" alt="Logo" />
            </Typography>
          </Link>

          <Box>
            {/* Input & Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email..."
                  variant="standard"
                  size="small"
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      "&:after": {
                        borderBottom: "2px solid #2d2d2d",
                      },
                    },
                  }}
                  sx={{
                    "& input::placeholder": {
                      fontSize: { xs: "16px", md: "20px" }, // Adjust font size for mobile
                    },
                  }}
                />
                <hr
                  style={{
                    width: "100%",
                    height: "2px",
                    color: "#2d2d2d",
                    backgroundColor: "#2d2d2d",
                  }}
                />
              </Box>
              <Button
                variant="contained"
                size="small"
                onClick={handleSubscribe}
                sx={{
                  color: "white",
                  padding: "5px 25px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "4px",
                  fontFamily: "Montserrat",
                  letterSpacing: "0.5px",
                  "&:hover": { backgroundColor: "#2D2D2D" },
                }}
              >
                Subscribe
              </Button>
            </Box>

            {/* Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
              }
              label="I agree to receive newsletters."
            />

            {/* Error Message */}
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            {/* Greeting Modal */}
            {showModal && (
              <GreetingModal
                email={email}
                onClose={() => setShowModal(false)}
              />
            )}
          </Box>
        </Box>

        {/* Footer Links Section */}
        <Box sx={{ flex: 2, minWidth: { xs: "100%", md: "300px" } }}>
          <Grid container spacing={4} sx={{ pl: { xs: 0, md: 4 } }}>
            {/* Company + Partners Section */}
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#6B7B58",
                    mb: 2,
                    fontSize: 12,
                    fontFamily: "Horizon, Bold",
                  }}
                >
                  COMPANY
                </Typography>
                <Link
                  to="/about"
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>About Us</Typography>
                </Link>
                <Link
                  to="/careers"
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Careers</Typography>
                </Link>
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#6B7B58",
                      mb: 2,
                      fontSize: 12,
                      fontFamily: "Horizon, Bold",
                    }}
                  >
                    PARTNERS
                  </Typography>
                  <Link
                    to="/partners"
                    style={{ textDecoration: "none", color: "#2d2d2d" }}
                  >
                    <Typography>Join Us</Typography>
                  </Link>

                  <Link
                    to="/signin-vendor"
                    style={{ textDecoration: "none", color: "#2d2d2d" }}
                  >
                    <Typography>Partners Portal</Typography>
                  </Link>
                </Box>
              </Box>
            </Grid>

            {/* Customer Service + Policies Section */}
            <Grid item xs={6} sm={5}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#6B7B58",
                  mb: 2,
                  fontSize: 12,
                  fontFamily: "Horizon, Bold",
                }}
              >
                CUSTOMER SERVICE
              </Typography>
              <Link
                to="/faqs"
                style={{ textDecoration: "none", color: "#2d2d2d" }}
              >
                <Typography>FAQs</Typography>
              </Link>
              <Link
                to="/contactus"
                style={{ textDecoration: "none", color: "#2d2d2d" }}
              >
                <Typography>Contact Us</Typography>
              </Link>
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#6B7B58",
                    mb: 2,
                    fontSize: 12,
                    fontFamily: "Horizon, Bold",
                  }}
                >
                  POLICIES & TERMS
                </Typography>
                <Link
                  to={`/policy?section=Cookie Policy`}
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Cookie</Typography>
                </Link>
                <Link
                  to={`/policy?section=Privacy Policy`}
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Privacy</Typography>
                </Link>
                <Link
                  to={`/policy?section=${encodeURIComponent(
                    "Returns & Exchanges Policy"
                  )}`}
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Return & Exchange</Typography>
                </Link>
                <Link
                  to={`/policy?section=Payment Policy`}
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Payment</Typography>
                </Link>

                <Link
                  to={`/policy?section=Shipping Policy`}
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Shipping Information</Typography>
                </Link>
                <Link
                  to={`/policy?section=Security Policy`}
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Security </Typography>
                </Link>
                <Link
                  to={`/policy?section=Compliance Policy`}
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Compliance</Typography>
                </Link>

                <Link
                  to={`/policy?section=Full Terms of Service Agreement`}
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Terms of Use</Typography>
                </Link>
              </Box>
            </Grid>

            {/* Pages Section */}
            <Grid
              item
              xs={6}
              sm={4}
              sx={{
                mt: { xs: -160, md: 0 }, // Apply negative margin top on mobile only
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#6B7B58",
                  mb: 2,
                  fontSize: 12,
                  fontFamily: "Horizon, Bold",
                }}
              >
                PAGES
              </Typography>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category._id}/subcategories`}
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>{category.name}</Typography>
                </Link>
              ))}
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Footer Bottom */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Stack on mobile, row on desktop
          justifyContent: "space-between",
          mt: { xs: 4, md: 6 },
          alignItems: { xs: "flex-start", md: "center" }, // Align left on mobile
          borderTop: "1px solid black",
          width: "100%",
          pt: 2,
          gap: { xs: 3, md: 0 }, // Add spacing between components on mobile;
        }}
      >
        {/* Social Media + Location */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Facebook fontSize="small" />
            <Instagram fontSize="small" />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: { xs: "12px", md: "14px" },
              }}
            >
              Cairo, Egypt
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: { xs: "12px", md: "14px" },
              mt: 1,
            }}
          >
            © 2024 TheDesignGrit. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: { xs: "10px", md: "10px" },
              mt: 1,
            }}
          >
            Powered By
            <strong>Young Software House </strong>{" "}
          </Typography>
        </Box>

        {/* Email */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: { xs: "12px", md: "14px" },
            }}
          >
            Info@TheDesignGrit.com
          </Typography>
        </Box>

        {/* Payment Icons + Security */}
        <Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {["amex", "mastercard", "meeza", "visa"].map((icon) => (
              <img
                key={icon}
                src={`/Assets/icons/${icon}.svg`}
                alt={icon}
                style={{ width: "30px", height: "40px" }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <LockIcon fontSize="small" />
            <Typography
              variant="body2"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: { xs: "12px", md: "14px" },
                ml: 1,
              }}
            >
              Buy safe, Be secure
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            {["Cookie Policy", "Privacy", "Terms & Conditions"].map((text) => (
              <Typography
                key={text}
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: { xs: "10px", md: "12px" },
                }}
              >
                {text}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
