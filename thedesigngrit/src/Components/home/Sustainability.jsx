import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from "@mui/material";
const SustainabilitySection = () => {
  return (
    <Box className="build-package-section">
      <Card
        sx={{
          background: "#6c7c59",
          display: "flex",
          justifyContent: "center",
          borderRadius: "1.25rem",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          height: "40rem",
        }}
        className="package-card"
      >
        <CardContent
          sx={{
            color: "#eae3e4",
            padding: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h3"
            fontSize="3.5rem"
            fontWeight="600"
            fontFamily={"Horizon"}
            sx={{ paddingTop: "2rem" }}
          >
            What is TDG?
          </Typography>

          <Typography
            variant="body1"
            fontFamily={"Montserrat"}
            fontSize={"1rem"}
            sx={{ marginTop: "-2.5rem" }}
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
            style={{ width: "100%", height: "100%" }}
          />
        </CardMedia>
      </Card>
    </Box>
  );
};

export default SustainabilitySection;
