import React from "react";
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

function Footer() {
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

          <Box sx={{ position: "relative", width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <TextField
                placeholder="Enter Your Email..."
                variant="standard"
                size="small"
                fullWidth
                InputProps={{ disableUnderline: true }}
                sx={{
                  "& input::placeholder": {
                    fontSize: { xs: "16px", md: "20px" }, // Adjust font size for mobile
                  },
                }}
              />
              <Button
                variant="contained"
                size="small"
                sx={{
                  textTransform: "none",
                  fontSize: "14px",
                  width: 120,
                  height: 30,
                  marginBottom: 1,
                  bgcolor: "#2D2D2D",
                  "&:hover": { bgcolor: "#2D2D2D" },
                }}
              >
                Subscribe
              </Button>
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "1px",
                backgroundColor: "rgba(0, 0, 0, 0.42)",
              }}
            />
          </Box>
          <Box sx={{ mt: 1 }}>
            <FormControlLabel
              control={<Checkbox />}
              label="I agree to receive newsletters and promotional emails."
              sx={{
                color: "#000",
                fontFamily: "Montserrat, sans-serif",
                fontSize: { xs: "12px", md: "14px" }, // Adjust font size for mobile
              }}
            />
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
                  to="/contactus"
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Contact Us</Typography>
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
                to={`/policy?section=Returns & Exchanges Policy`}
                style={{ textDecoration: "none", color: "#2d2d2d" }}
              >
                <Typography>Return & Exchange / Policy</Typography>
              </Link>
              <Link
                to={`/policy?section=Shipping Policy`}
                style={{ textDecoration: "none", color: "#2d2d2d" }}
              >
                <Typography>Shipping Information / Policy</Typography>
              </Link>
              <Link
                to="/trackorder"
                style={{ textDecoration: "none", color: "#2d2d2d" }}
              >
                <Typography>Track Your Order</Typography>
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
                  to={`/policy?section=Privacy Policy`}
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Privacy Policy</Typography>
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
            <Grid item xs={6} sm={4}>
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
              {/* <Link
                to="/products"
                style={{ textDecoration: "none", color: "#2d2d2d" }}
              > */}
              <Typography>Furniture</Typography>

              <Typography>Kitchen & Dining</Typography>
              <Typography>Bath</Typography>
              <Typography>Lighting</Typography>
              <Typography>Home Decor</Typography>
              <Typography>Outdoor</Typography>
              <Typography>Brand</Typography>
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
          gap: { xs: 3, md: 0 }, // Add spacing between components on mobile
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
