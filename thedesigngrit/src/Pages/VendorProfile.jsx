import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import VendorProfileHero from "../Components/Vendor-Profile/Hero";
import Header from "../Components/navBar";
import VendorProfileHeader from "../Components/Vendor-Profile/profileheader";
import VendorCatalogs from "../Components/Vendor-Profile/Catalogs";
import VendorCategoriesGrid from "../Components/Vendor-Profile/Categories";
import VendorsProductsGrid from "../Components/Vendor-Profile/Products";
import Footer from "../Components/Footer";

function VendorProfile() {
  const { id } = useParams(); // Get vendor ID from the URL
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/vendors/vendor/${id}`
        );
        const data = await response.json();
        console.log(data); // Log the data to check if it's correct
        setVendor(data);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchVendor();
  }, [id]);

  if (!vendor) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Header />
      <VendorProfileHero vendor={vendor} />
      <VendorProfileHeader vendor={vendor} />
      <VendorCatalogs vendorID={vendor._id} />
      <VendorCategoriesGrid vendor={vendor} />
      <VendorsProductsGrid vendorId={id} />
      <Footer />
    </Box>
  );
}

export default VendorProfile;
