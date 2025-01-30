import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Input,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import axios from "axios";

function Signupvendor1() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [vendorId, setVendorId] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [vendorData, setVendorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    employeeNumber: "10021",
    password: "",
    phoneNumber: "",
    tier: "3",
  });
  const [brandData, setBrandData] = useState({
    brandName: "",
    commercialRegisterNo: "",
    taxNumber: "",
    companyAddress: "",
    phoneNumber: "",
    email: "",
    bankAccountNumber: "",
    websiteURL: "",
    instagramURL: "",
    facebookURL: "",
    tiktokURL: "",
    linkedinURL: "",
    shippingPolicy: "",
    brandlogo: "", // Single logo path
    digitalCopiesLogo: [], // Array of logo paths
    coverPhoto: "", // Single cover photo path
    catalogues: [], // Array of catalogue paths
    brandDescription: "",
    status: "pending", // Default status
    documents: [], // Array of document paths (e.g., tax documents)
    fees: 0, // Placeholder value
    createdAt: "", // Can be generated on the server side
  });

  const sanitizeVendorData = () => {
    const allowedKeys = [
      "firstName",
      "lastName",
      "email",
      "employeeNumber",
      "password",
      "phoneNumber",
      "tier",
    ];
    return Object.keys(vendorData)
      .filter((key) => allowedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = vendorData[key];
        return obj;
      }, {});
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const sanitizedData = sanitizeVendorData();
    console.log("Sanitized Vendor Data:", sanitizedData); // Log sanitized data

    if (currentPhase === 1) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/vendors/signup",
          sanitizedData,
          { headers: { "Content-Type": "application/json" } } // Set Content-Type explicitly
        );

        if (response.status === 201) {
          console.log("Vendor data submitted successfully");
          console.log("Vendor ID:", response.data._id);
          setVendorId(response.data._id)
          setCurrentPhase(2);
        } else {
          console.log("Failed to submit vendor data");
        }
      } catch (error) {
        console.error(
          "Error submitting vendor data:",
          error.response?.data || error.message
        );
      }
    } else if (currentPhase === 2) {
      setCurrentPhase(3);
    } else if (currentPhase === 3) {
      const formData = new FormData();

      Object.keys(brandData).forEach((key) => {
        if (Array.isArray(brandData[key])) {
          // Handle arrays (e.g., catalogues, documents)
          brandData[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, brandData[key]);
        }
      });

      try {
        const response = await axios.post(
          "http://localhost:5000/api/brand/brand",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 201) {
          console.log("Brand data submitted successfully");
          console.log("Brand ID:", response.data._id);
          await axios.put(`http://localhost:5000/api/vendors/${vendorId}`, {
            brandId: response.data._id,
          });
          alert("Signup completed!");
          // Reset brand data to default state
          setCurrentPhase(1);
          setVendorData({
            firstName: "",
            lastName: "",
            email: "",
            employeeNumber: "001",
            password: "",
            phoneNumber: "",
            tier: "3",
          });
          setBrandData({
            brandName: "",
            commercialRegisterNo: "",
            taxNumber: "",
            companyAddress: "",
            phoneNumber: "",
            email: "",
            bankAccountNumber: "",
            websiteURL: "",
            instagramURL: "",
            facebookURL: "",
            tiktokURL: "",
            linkedinURL: "",
            shippingPolicy: "",
            brandlogo: "",
            digitalCopiesLogo: [],
            coverPhoto: "",
            catalogues: [],
            brandDescription: "",
            status: "pending",
            documents: [],
            fees: 0,
            createdAt: "",
          });
        } else {
          console.error("Failed to submit brand data");
        }
      } catch (error) {
        console.error(
          "Error submitting brand data:",
          error.response?.data || error.message
        );
      }
    }
  };

  const handleInputChange = (event, phase) => {
    const { name, value } = event.target;

    if (phase === 1) {
      setVendorData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setBrandData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (event, phase) => {
    const { name, files } = event.target;

    if (phase === 2) {
      if (name === "brandlogo") {
        setBrandData((prevState) => ({
          ...prevState,
          [name]: files[0], // Only takes the first logo file
        }));
      } else if (name === "coverPhoto") {
        setBrandData((prevState) => ({
          ...prevState,
          [name]: files[0], // Only takes the first cover photo file
        }));
      } else if (name === "catalogues") {
        const pdfFiles = Array.from(files).filter(
          (file) => file.type === "application/pdf"
        );
        setBrandData((prevState) => ({
          ...prevState,
          [name]: pdfFiles, // Only accepts PDF files
        }));
      } else if (name === "documents") {
        setBrandData((prevState) => ({
          ...prevState,
          [name]: Array.from(files), // Takes multiple files (documents)
        }));
      }
    }
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 1:
        return (
          <>
            <Typography variant="h5" gutterBottom>
              Vendor Signup
            </Typography>
            <TextField
              label="Vendor First Name"
              name="firstName"
              value={vendorData.firstName}
              onChange={(e) => handleInputChange(e, 1)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Vendor Last Name"
              name="lastName"
              value={vendorData.lastName}
              onChange={(e) => handleInputChange(e, 1)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Vendor Email"
              name="email"
              value={vendorData.email}
              onChange={(e) => handleInputChange(e, 1)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Vendor Password"
              name="password"
              value={vendorData.password}
              onChange={(e) => handleInputChange(e, 1)}
              fullWidth
              margin="normal"
              type="password"
            />
            <TextField
              label="Vendor Phone Number"
              name="phoneNumber"
              value={vendorData.phoneNumber}
              onChange={(e) => handleInputChange(e, 1)}
              fullWidth
              margin="normal"
            />
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h5" gutterBottom>
              Brand Profile
            </Typography>
            <TextField
              label="Brand Name"
              name="brandName"
              value={brandData.brandName || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Commercial Register No."
              name="commercialRegisterNo"
              value={brandData.commercialRegisterNo || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Tax Number"
              name="taxNumber"
              value={brandData.taxNumber || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Company Address"
              name="companyAddress"
              value={brandData.companyAddress || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={brandData.phoneNumber || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={brandData.email || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="brandlogo">Logo</InputLabel>
              <Input
                id="brandlogo"
                name="brandlogo"
                type="file"
                onChange={(e) => handleFileChange(e, 2)}
                accept="image/*"
              />
              <FormHelperText>Upload your brand's logo image</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="coverPhoto">Cover Photo</InputLabel>
              <Input
                id="coverPhoto"
                name="coverPhoto"
                type="file"
                onChange={(e) => handleFileChange(e, 2)}
                accept="image/*"
              />
              <FormHelperText>Upload your brand's cover photo</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="catalogues">Catalog (PDF)</InputLabel>
              <Input
                id="catalogues"
                name="catalogues"
                type="file"
                onChange={(e) => handleFileChange(e, 2)}
                accept="application/pdf"
                multiple
              />
              <FormHelperText>
                Upload your product catalog (PDF format)
              </FormHelperText>
            </FormControl>

            <TextField
              label="Brand Description"
              name="brandDescription"
              value={brandData.brandDescription || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
            />
          </>
        );
      case 3:
        return (
          <>
            <Typography variant="h5" gutterBottom>
              Additional Brand Information
            </Typography>
            <TextField
              label="Shipping Policy"
              name="shippingPolicy"
              value={brandData.shippingPolicy || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Bank Account Number"
              name="bankAccountNumber"
              value={brandData.bankAccountNumber || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Website URL"
              name="websiteURL"
              value={brandData.websiteURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Instagram URL"
              name="instagramURL"
              value={brandData.instagramURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Facebook URL"
              name="facebookURL"
              value={brandData.facebookURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Tiktok URL"
              name="tiktokURL"
              value={brandData.tiktokURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="LinkedIn URL"
              name="linkedinURL"
              value={brandData.linkedinURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Fees"
              name="fees"
              value={brandData.fees || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              type="number"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 400,
        margin: "auto",
      }}
    >
      {renderPhaseContent()}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 2,
        }}
      >
        {currentPhase > 1 && (
          <Button
            variant="outlined"
            onClick={() => setCurrentPhase(currentPhase - 1)}
          >
            Back
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={handleNext}>
          {currentPhase === 3 ? "Submit" : "Next"}
        </Button>
      </Box>
    </Box>
  );
}

export default Signupvendor1;
