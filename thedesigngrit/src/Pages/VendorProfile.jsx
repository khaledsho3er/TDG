import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import VendorProfileHero from "../Components/Vendor-Profile/Hero";
import Header from "../Components/navBar";
import VendorProfileHeader from "../Components/Vendor-Profile/profileheader";
import VendorCatalogs from "../Components/Vendor-Profile/Catalogs";
import VendorCategoriesGrid from "../Components/Vendor-Profile/Categories";
import VendorsProductsGrid from "../Components/Vendor-Profile/Products";
import Footer from "../Components/Footer";
import LoadingScreen from "./loadingScreen";

function VendorProfile() {
  const { id } = useParams(); // Get vendor ID from the URL
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/brand/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setVendor(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        setError("Failed to load vendor data. Please try again later.");
        setVendor(null);
      }
    };

    fetchVendor();
  }, [id]);

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" color="error">
          {error}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          There was an issue fetching the vendor's details.
        </Typography>
      </Box>
    );
  }

  if (!vendor) {
    return <LoadingScreen />;
  }

  return (
    <Box>
      <Header />
      <VendorProfileHero vendor={vendor} />
      <VendorProfileHeader vendor={vendor} />
      <VendorCatalogs vendorID={vendor._id} />
      <VendorCategoriesGrid vendor={vendor} />
      <VendorsProductsGrid vendor={vendor} />
      <Footer />
    </Box>
  );
}

export default VendorProfile;
