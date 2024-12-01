import React from "react";
import { Box, Typography, Button } from "@mui/material";
import Vendorprofilehero from "../Components/Vendor-Profile/Hero";
import Header from "../Components/navBar";
import VendorProfileheader from "../Components/Vendor-Profile/profileheader";

function VendorProfile() {
  return (
    <Box>
      <Header />
      <Vendorprofilehero />
      <VendorProfileheader />
    </Box>
  );
}

export default VendorProfile;
