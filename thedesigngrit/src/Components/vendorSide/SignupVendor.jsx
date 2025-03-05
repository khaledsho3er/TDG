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
  Grid,
} from "@mui/material";
import axios from "axios";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate, Link } from "react-router-dom";
function Signupvendor() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [vendorId, setVendorId] = useState(null);
  // const [brandId, setBrandId] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [vendorData, setVendorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    employeeNumber: Math.floor(1000 + Math.random() * 9000).toString(),
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
    const validationErrors = validate(
      currentPhase === 1 ? vendorData : brandData
    );
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    const sanitizedData = sanitizeVendorData();
    console.log("Sanitized Vendor Data:", sanitizedData); // Log sanitized data

    if (currentPhase === 1) {
      try {
        const response = await axios.post(
          "https://tdg-db.onrender.com/api/vendors/signup",
          sanitizedData,
          { headers: { "Content-Type": "application/json" } } // Set Content-Type explicitly
        );

        if (response.status === 201) {
          console.log("Vendor data submitted successfully");
          console.log("Vendor ID:", response.data._id);
          setVendorId(response.data._id);
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
          "https://tdg-db.onrender.com/api/brand/brand",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 201) {
          console.log("Brand data submitted successfully");
          console.log("Brand ID:", response.data._id);
          await axios.put(
            `https://tdg-db.onrender.com/api/vendors/${vendorId}`,
            {
              brandId: response.data._id,
            }
          );
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
          navigate("/signin-vendor");
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

  const validate = (values) => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = "Required";
    }
    if (!values.lastName) {
      errors.lastName = "Required";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    if (!values.phoneNumber) {
      errors.phoneNumber = "Required";
    } else if (!/^\d{10}$/i.test(values.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number";
    }

    return errors;
  };

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 1:
        return (
          <>
            <TextField
              label="Vendor First Name"
              name="firstName"
              value={vendorData.firstName}
              onChange={(e) => handleInputChange(e, 1)}
              fullWidth
              margin="normal"
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
            />
            <TextField
              label="Vendor Last Name"
              name="lastName"
              value={vendorData.lastName}
              onChange={(e) => handleInputChange(e, 1)}
              fullWidth
              margin="normal"
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
            />
            <TextField
              label="Vendor Email"
              name="email"
              value={vendorData.email}
              onChange={(e) => handleInputChange(e, 1)}
              fullWidth
              margin="normal"
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
            <TextField
              label="Vendor Password"
              name="password"
              value={vendorData.password}
              onChange={(e) => handleInputChange(e, 1)}
              fullWidth
              margin="normal"
              type="password"
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
            <TextField
              label="Vendor Phone Number"
              name="phoneNumber"
              value={vendorData.phoneNumber}
              onChange={(e) => handleInputChange(e, 1)}
              fullWidth
              margin="normal"
              error={Boolean(errors.phoneNumber)}
              helperText={errors.phoneNumber}
            />
          </>
        );
      case 2:
        return (
          <Box
            sx={{
              overflow: "auto",
              maxHeight: "calc(100vh - 200px)",
              padding: "20px",
            }}
          >
            <TextField
              label="Brand Name"
              name="brandName"
              value={brandData.brandName || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
              error={Boolean(errors.brandName)}
              helperText={errors.brandName}
            />
            <TextField
              label="Commercial Register No."
              name="commercialRegisterNo"
              value={brandData.commercialRegisterNo || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
              error={Boolean(errors.commercialRegisterNo)}
              helperText={errors.commercialRegisterNo}
            />
            <TextField
              label="Tax Number"
              name="taxNumber"
              value={brandData.taxNumber || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
              error={Boolean(errors.taxNumber)}
              helperText={errors.taxNumber}
            />
            <TextField
              label="Company Address"
              name="companyAddress"
              value={brandData.companyAddress || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
              error={Boolean(errors.companyAddress)}
              helperText={errors.companyAddress}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={brandData.phoneNumber || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
              error={Boolean(errors.phoneNumber)}
              helperText={errors.phoneNumber}
            />
            <TextField
              label="Email"
              name="email"
              value={brandData.email || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
              error={Boolean(errors.email)}
              helperText={errors.email}
            />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="brandlogo">Logo</InputLabel>
                  <Input
                    id="brandlogo"
                    name="brandlogo"
                    type="file"
                    onChange={(e) => handleFileChange(e, 2)}
                    accept="image/*"
                  />
                  <FormHelperText>
                    Upload your brand's logo image
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="coverPhoto">Cover Photo</InputLabel>
                  <Input
                    id="coverPhoto"
                    name="coverPhoto"
                    type="file"
                    onChange={(e) => handleFileChange(e, 2)}
                    accept="image/*"
                  />
                  <FormHelperText>
                    Upload your brand's cover photo
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            {/* <FormControl fullWidth margin="normal">
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
            </FormControl> */}

            <TextField
              label="Brand Description"
              name="brandDescription"
              value={brandData.brandDescription || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
              error={Boolean(errors.brandDescription)}
              helperText={errors.brandDescription}
            />
          </Box>
        );
      case 3:
        return (
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              position: "relative",
              minWidth: "0px",
              padding: "0px",
              margin: "14px 0px 0px ",
              border: "0",
              gap: "10px",
              verticalAlign: "top",
              width: "100%",
            }}
          >
            <TextField
              label="Shipping Policy"
              name="shippingPolicy"
              value={brandData.shippingPolicy || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              error={Boolean(errors.shippingPolicy)}
              helperText={errors.shippingPolicy}
            />
            <TextField
              label="Bank Account Number"
              name="bankAccountNumber"
              value={brandData.bankAccountNumber || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              error={Boolean(errors.bankAccountNumber)}
              helperText={errors.bankAccountNumber}
            />
            <TextField
              label="Website URL"
              name="websiteURL"
              value={brandData.websiteURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              error={Boolean(errors.websiteURL)}
              helperText={errors.websiteURL}
            />
            <TextField
              label="Instagram URL"
              name="instagramURL"
              value={brandData.instagramURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              error={Boolean(errors.instagramURL)}
              helperText={errors.instagramURL}
            />
            <TextField
              label="Facebook URL"
              name="facebookURL"
              value={brandData.facebookURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              error={Boolean(errors.facebookURL)}
              helperText={errors.facebookURL}
            />
            <TextField
              label="TikTok URL"
              name="tiktokURL"
              value={brandData.tiktokURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              error={Boolean(errors.tiktokURL)}
              helperText={errors.tiktokURL}
            />
            <TextField
              label="LinkedIn URL"
              name="linkedinURL"
              value={brandData.linkedinURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              error={Boolean(errors.linkedinURL)}
              helperText={errors.linkedinURL}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('/Assets/signin.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backdropFilter: "blur(5px)", // Adds blur to the background
          backgroundColor: "rgba(0, 0, 0, 0.4)", // Adds a semi-transparent dark overlay
          zIndex: 1,
        }}
      ></Box>

      <Box
        sx={{
          width: "80%",
          maxWidth: "600px",
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent form
          padding: 3,
          borderRadius: 2,
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.13)",
          position: "relative",
          zIndex: 2, // Ensures the form is above the blur overlay
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 2 }}>
          Vendor and Brand Registration
        </Typography>
        <form onSubmit={handleNext}>
          {renderPhaseContent()}
          <Button
            type="submit"
            fullWidth
            sx={{
              marginTop: 2,
              color: "white",
              backgroundColor: "#2d2d2d",
              "&:hover": {
                backgroundColor: "#4a4a4a", // New color on hover
              },
            }}
          >
            {currentPhase === 3 ? "Finish" : "Next"}
          </Button>
          <Typography
            variant="subtitle2"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            Already have an account?{" "}
            <Link to="/signin-vendor" style={{ textDecoration: "none" }}>
              Sign in
            </Link>
          </Typography>
        </form>
      </Box>
    </Box>
  );
}

export default Signupvendor;
