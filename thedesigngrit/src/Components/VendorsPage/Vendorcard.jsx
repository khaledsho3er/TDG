import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const VendorCard = ({ vendor, onClick }) => {
  const { brandlogo, brandName, _id: brandId } = vendor;
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        const response = await axios.get(
          `https://api.thedesigngrit.com/api/products/getproducts/brand/${brandId}`
        );

        // Only take the first 4 products with mainImage
        const products = response.data
          .slice(0, 4)
          .map(
            (p) =>
              `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${p.mainImage}`
          );
        setProductImages(products);
      } catch (error) {
        console.error("Error fetching brand products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (brandId) {
      fetchBrandProducts();
    }
  }, [brandId]);

  return (
    <Card
      sx={{
        width: 300,
        height: 350,
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        textAlign: "center",
        border: "1px solid #ddd",
        margin: 2,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
      onClick={onClick}
    >
      {/* Vendor Logo */}
      <Box
        sx={{
          height: 70,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          marginTop: "7px",
        }}
      >
        <CardMedia
          component="img"
          image={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${brandlogo}`}
          alt={`${brandName} logo`}
          sx={{ maxHeight: "80%", maxWidth: "80%", objectFit: "contain" }}
        />
      </Box>

      {/* 2x2 Product Grid */}
      <Box
        sx={{
          width: "100%",
          height: 200,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 1,
          padding: 1,
          boxSizing: "border-box",
        }}
      >
        {loading ? (
          <Box
            sx={{
              gridColumn: "span 2",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress
              size={40}
              thickness={4}
              sx={{
                color: "#2d2d2d",
                marginBottom: 1,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontSize: "0.8rem",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Loading products...
            </Typography>
          </Box>
        ) : productImages.length > 0 ? (
          productImages.map((img, index) => (
            <Box
              key={index}
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #ddd",
              }}
            >
              <CardMedia
                component="img"
                image={img}
                alt={`Product ${index + 1}`}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))
        ) : (
          // Simple blurred gradient squares as placeholders
          Array.from({ length: 4 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #ddd",
                background: `linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)`,
                opacity: 0.7,
                filter: "blur(0.5px)",
                animation: "pulse 2s infinite ease-in-out",
                "@keyframes pulse": {
                  "0%": { opacity: 0.7 },
                  "50%": { opacity: 0.5 },
                  "100%": { opacity: 0.7 },
                },
              }}
            />
          ))
        )}
      </Box>

      {/* Vendor Name */}
      <CardContent sx={{ padding: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontFamily: "Horizon",
            color: "#333",
          }}
        >
          {brandName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VendorCard;
