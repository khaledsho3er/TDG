import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const SustainabilitySection = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // Mobile-friendly

  return (
    <Box className="build-package-section">
      <Card
        sx={{
          background: "#6c7c59",
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Stack on mobile
          justifyContent: "center",
          borderRadius: "1.25rem",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          height: { xs: "auto", md: "40rem" }, // Auto height on small screens
        }}
        className="package-card"
      >
        <CardContent
          sx={{
            color: "#eae3e4",
            padding: { xs: "2rem", md: "3rem" }, // Reduce padding on smaller screens
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h3"
            fontSize={isSmallScreen ? "2rem" : "3.5rem"} // Smaller font on mobile
            fontWeight="600"
            fontFamily={"Horizon"}
            sx={{ paddingTop: { xs: "1rem", md: "2rem" } }}
          >
            What is TDG?
          </Typography>

          <Typography
            variant="body1"
            fontFamily={"Montserrat"}
            fontSize={isSmallScreen ? "0.875rem" : "1rem"} // Adjust body text
            sx={{ marginTop: { xs: "-1rem", md: "-2.5rem" } }}
          >
            TheDesignGrit is here to spotlight Egyptian design. We’re giving
            local brands the platform they deserve, connecting their
            craftsmanship with those who value it most. It’s about honoring
            tradition, celebrating innovation, and helping you discover pieces
            that make you feel most at home.
          </Typography>

          <CardActions>
            <button
              className="btn"
              style={{
                color: "black",
                background: "#eae3e4",
                fontWeight: "bold",
                fontSize: isSmallScreen ? "0.875rem" : "1rem", // Button text responsive
                padding: isSmallScreen ? "0.5rem 1rem" : "0.75rem 1.5rem",
              }}
            >
              Find more
            </button>
          </CardActions>
        </CardContent>

        <CardMedia sx={{ flex: 1 }}>
          <img
            src="Assets/susSection.webp"
            alt="Green Bowl Beach, Bali, Indonesia_2AGYRXP 1"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </CardMedia>
      </Card>
    </Box>
  );
};

export default SustainabilitySection;
