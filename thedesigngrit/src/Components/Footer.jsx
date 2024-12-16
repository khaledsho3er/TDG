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
import { Link } from "react-router-dom"; // Import Link for navigation

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "#f7f2f2",
        py: 0,
        px: 10,
        marginTop: 2,
        paddingTop: 5,
      }}
    >
      <Grid container spacing={10}>
        {/* Logo and Newsletter Section */}
        <Grid item xs={3} md={5}>
          <Link to="/home" style={{ textDecoration: "none", color: "#2d2d2d" }}>
            <Typography className="logo-Footer" variant="h4" sx={{ mb: 2 }}>
              <img src="/Assets/TDG_Logo_Black.png" alt="Logo" />
            </Typography>
          </Link>

          <Box
            className="subscribe-container"
            sx={{
              position: "relative",
              width: "100%",
            }}
          >
            {/* Email Input and Subscribe Button */}
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
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  "& input::placeholder": {
                    fontSize: "20px",
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
                  "&:hover": {
                    bgcolor: "#2D2D2D",
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>

            {/* Line Underneath */}
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
                fontSize: 2,
              }}
            />
          </Box>
        </Grid>

        {/* Footer Links Section */}
        <Grid className="Textcontainer">
          <Grid container spacing={10} sx={{ pl: { xs: 0, md: 4 } }}>
            {/* Company + Partners Section */}
            <Grid item xs={6} sm={3}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#6B7B58",
                  mb: 2,
                  fontSize: 12,
                  fontFamily: "Horizon,Bold",
                }}
              >
                COMPANY
              </Typography>
              <Link
                to="/aboutus"
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
                    fontFamily: "Horizon,Bold",
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
                  to="/contactus"
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Support</Typography>
                </Link>
              </Box>
            </Grid>

            {/* Customer Service + Policies Section */}
            <Grid item xs={8} sm={5}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#6B7B58",
                  mb: 2,
                  fontSize: 12,
                  fontFamily: "Horizon,Bold",
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
                to="/policy"
                style={{ textDecoration: "none", color: "#2d2d2d" }}
              >
                <Typography>Return & Exchange / Policy</Typography>
              </Link>
              <Link
                to="/policy"
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
                    fontFamily: "Horizon,Bold",
                  }}
                >
                  POLICIES & TERMS
                </Typography>
                <Link
                  to="/policy"
                  style={{ textDecoration: "none", color: "#2d2d2d" }}
                >
                  <Typography>Privacy Policy</Typography>
                </Link>
                <Link
                  to="/policy"
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
                  fontFamily: "Horizon,Bold",
                }}
              >
                PAGES
              </Typography>
              <Link to="/products" style={{ textDecoration: "none" }}>
                <Typography>Furniture</Typography>
              </Link>
              <Typography>Kitchen & Dining</Typography>
              <Typography>Bath</Typography>
              <Typography>Lighting</Typography>
              <Typography>Home Decor</Typography>
              <Typography>Outdoor</Typography>
              <Typography>Brand</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* Footer Bottom */}
      <Grid item xs={10}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            alignItems: "center",
            borderTop: "1px solid black",
            width: "100%",
          }}
        >
          <Box>
            <Facebook fontSize="small" />
            <Instagram fontSize="small" sx={{ ml: 1 }} />
            <Typography
              variant="body2"
              sx={{
                display: "inline",
                ml: 1,
                fontFamily: "Montserrat, sans-serif", // Montserrat Medium font
              }}
            >
              Cairo, Egypt
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "Montserrat, sans-serif" }}
            >
              © 2024 TheDesignGrit. All rights reserved.
            </Typography>
          </Box>
          <Box sx={{ alignItems: "center", paddingRight: 15, paddingTop: 4 }}>
            <Typography
              variant="body2"
              sx={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Info@TheDesignGrit.com
            </Typography>
          </Box>

          <Box sx={{ paddingTop: 3 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography>
                <img src="/Assets\icons\amex.png" alt="Logo" />
              </Typography>
              <Typography>
                <img src="/Assets\icons\mastercard.png" alt="Logo" />
              </Typography>
              <Typography>
                <img src="/Assets\icons\meeza.png" alt="Logo" />
              </Typography>
              <Typography>
                <img src="/Assets\icons\visa.png" alt="Logo" />
              </Typography>
              <Typography>
                <img src="/Assets\icons\mada 1.png" alt="Logo" />
              </Typography>
            </Box>
            <Box sx={{ display: "flex", paddingTop: 0.5 }}>
              <LockIcon fontSize="small" />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  paddingTop: 0.5,
                  fontSize: 12,
                }}
              >
                Buy safe, Be secure
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, paddingTop: 1 }}>
              <Typography
                sx={{ fontFamily: "Montserrat, sans-serif", fontSize: 10 }}
              >
                Cookie Policy
              </Typography>
              <Typography
                sx={{ fontFamily: "Montserrat, sans-serif", fontSize: 10 }}
              >
                Privacy
              </Typography>
              <Typography
                sx={{ fontFamily: "Montserrat, sans-serif", fontSize: 10 }}
              >
                Terms & Conditions
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}

export default Footer;
