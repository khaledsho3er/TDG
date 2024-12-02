import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

const VendorCard = ({ vendor }) => {
  const { logo, products, name } = vendor;

  return (
    <Card
      sx={{
        width: 250,
        borderRadius: 4,
        boxShadow: 3,
        overflow: "hidden",
        textAlign: "center",
        border: "1px solid #ddd",
        margin: 2,
      }}
    >
      {/* Vendor Logo */}
      <Box
        sx={{
          height: 70,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <CardMedia
          component="img"
          image={logo}
          alt={`${name} logo`}
          sx={{
            maxHeight: "80%",
            maxWidth: "80%",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Product Images */}
      <Grid container spacing={0.1} sx={{ padding: 1 }}>
        {products.slice(0, 4).map((product, index) => (
          <Grid item xs={6} key={index}>
            <CardMedia
              component="img"
              image={product}
              alt={`Product ${index + 1}`}
              sx={{
                height: 80,
                borderRadius: 2,
                objectFit: "cover",
                border: "1px solid #ddd",
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Vendor Name */}
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontFamily: "Horizon",
            color: "#333",
          }}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VendorCard;
