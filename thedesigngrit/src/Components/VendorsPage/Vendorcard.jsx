import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
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
          `https://tdg-db.onrender.com/api/products/getproducts/brand/${brandId}`
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
        borderRadius: 4,
        boxShadow: 3,
        overflow: "hidden",
        textAlign: "center",
        border: "1px solid #ddd",
        margin: 2,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
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
          height: 160,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 1,
          padding: 1,
          boxSizing: "border-box",
        }}
      >
        {loading ? (
          <Typography
            variant="body2"
            sx={{ color: "gray", gridColumn: "span 2" }}
          >
            Loading...
          </Typography>
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
          <Typography
            variant="body2"
            sx={{ color: "gray", gridColumn: "span 2" }}
          >
            No products available
          </Typography>
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
