import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Vendorprofilehero from "../Components/Vendor-Profile/Hero";
import Header from "../Components/navBar";
import VendorProfileheader from "../Components/Vendor-Profile/profileheader";
import VendorCatalogCard from "../Components/Vendor-Profile/CatalogCard";
import VendorCatalogs from "../Components/Vendor-Profile/Catalogs";
import VendorCategoriesgrid from "../Components/Vendor-Profile/Categories";

function VendorProfile() {
  return (
    <Box>
      <Header />
      <Vendorprofilehero />
      <VendorProfileheader />
      <VendorCatalogs />
      <VendorCategoriesgrid />
    </Box>
  );
}

export default VendorProfile;
