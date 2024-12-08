import React from "react";
import { Box } from "@mui/material";
import Vendorprofilehero from "../Components/Vendor-Profile/Hero";
import Header from "../Components/navBar";
import VendorProfileheader from "../Components/Vendor-Profile/profileheader";
import VendorCatalogs from "../Components/Vendor-Profile/Catalogs";
import VendorCategoriesgrid from "../Components/Vendor-Profile/Categories";
import VendorsProductsGrid from "../Components/Vendor-Profile/Products";
import Footer from "../Components/Footer";

function VendorProfile() {
  return (
    <Box>
      <Header />
      <Vendorprofilehero />
      <VendorProfileheader />
      <VendorCatalogs />
      <VendorCategoriesgrid />
      <VendorsProductsGrid vendorId={101} />
      <Footer />
    </Box>
  );
}

export default VendorProfile;
