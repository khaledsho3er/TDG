import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  Link,
  Grid,
} from "@mui/material";
import { Facebook, Instagram } from "@mui/icons-material";

function Footer() {
  return (
    <Box sx={{ bgcolor: "#f7f2f2", py: 7, px: 10 }}>
      <Grid container spacing={10}>
        {/* Logo and Newsletter Section */}
        <Grid item xs={3} md={5}>
          <Typography className="logo-Footer" variant="h4" sx={{ mb: 2 }}>
            <img src="Assets/TDG_Logo_Black.png" alt="Logo" />
          </Typography>

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
              <Typography>About Us</Typography>
              <Typography>Contact Us</Typography>
              <Typography>Careers</Typography>

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
                <Typography>Join Us</Typography>
                <Typography>Support</Typography>
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
              <Typography>FAQs</Typography>
              <Typography>Return & Exchange / Policy</Typography>
              <Typography>Shipping Information / Policy</Typography>
              <Typography>Track Your Order</Typography>

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
                <Typography>Privacy Policy</Typography>
                <Typography>Terms of Use</Typography>
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
              <Typography>Furniture</Typography>
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
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            alignItems: "center",
            borderTop: "1px solid black",
            width: "100%",
            padding: 2,
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
          <Box sx={{ alignItems: "center", paddingRight: 55, paddingTop: 5 }}>
            <Typography
              variant="body2"
              sx={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Info@TheDesignGrit.com
            </Typography>
          </Box>

          <Box></Box>
        </Box>
      </Grid>
    </Box>
  );
}

export default Footer;
