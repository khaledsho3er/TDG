import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import axios from "axios";

const VendorCard = ({ vendor, onClick }) => {
  const { brandlogo, brandName, _id: brandId } = vendor;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        const response = await axios.get(
          `https://tdg-db.onrender.com/api/products/getproducts/brand/${brandId}`
        );
        // Assuming response.data is an array of products and each has an image URL
        const productImages = response.data.map((p) => p.image); // Adjust if your image field is named differently
        setProducts(productImages);
      } catch (error) {
        console.error("Error fetching products for brand:", brandName, error);
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
      {/* Top: Brand Logo */}
      <Box sx={{ flexGrow: 1 }}>
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

        {/* Product Previews */}
        <Box sx={{ padding: 1 }}>
          {loading ? (
            <Typography variant="body2" sx={{ color: "gray" }}>
              Loading...
            </Typography>
          ) : products.length > 0 ? (
            products.slice(0, 4).map((img, index) => (
              <CardMedia
                component="img"
                key={index}
                image={img}
                alt={`Product ${index + 1}`}
                sx={{
                  height: 100,
                  borderRadius: 2,
                  objectFit: "cover",
                  border: "1px solid #ddd",
                }}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "gray" }}>
              No products available
            </Typography>
          )}
        </Box>
      </Box>

      {/* Bottom: Brand Name */}
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
