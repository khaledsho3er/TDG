import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Input,
  FormControl,
  FormHelperText,
  MenuItem,
  InputLabel,
  Select,
  Grid,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
function Signupvendor() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [vendorId, setVendorId] = useState(null);
  const navigate = useNavigate();
  const [touched, setTouched] = useState({
    // Vendor data fields
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    phoneNumber: false,
    // Brand data fields
    brandName: false,
    commercialRegisterNo: false,
    taxNumber: false,
    companyAddress: false,
    brandPhoneNumber: false,
    brandEmail: false,
    // Phase 3 fields
    shippingPolicy: false,
    bankAccountNumber: false,
  });
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
    type: [],
    status: "pending", // Default status
    documents: [], // Array of document paths (e.g., tax documents)
    fees: 0, // Placeholder value
    createdAt: "", // Can be generated on the server side
  });
  const [types, setTypes] = useState([]);

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

  const fetchTypes = async () => {
    try {
      const response = await axios.get(
        "https://tdg-db.onrender.com/api/types/getAll"
      );
      if (response.status === 200) {
        setTypes(response.data); // Assuming response.data is an array of types
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);
  const handleNext = async (e) => {
    e.preventDefault();
    const sanitizedData = sanitizeVendorData();
    console.log("Sanitized Vendor Data:", sanitizedData); // Log sanitized data

    if (currentPhase === 1) {
      try {
        const response = await axios.post(
          "https://tdg-db.onrender.com/api/vendors/signup",
          sanitizedData,
          { headers: { "Content-Type": "application/json" } }
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

      console.log("Brand Data before form submission:", brandData);
      console.log("Selected Types:", brandData.type);

      Object.keys(brandData).forEach((key) => {
        if (Array.isArray(brandData[key])) {
          if (key === "type") {
            // Send type array as a JSON string
            formData.append("type", JSON.stringify(brandData[key]));
            console.log("Appending type array:", brandData[key]);
          } else {
            // Append other arrays normally
            brandData[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          }
        } else {
          formData.append(key, brandData[key]);
        }
      });

      // Log the FormData contents
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

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
            type: [], // Reset selected types
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

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
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
            <TextField
              label="Vendor First Name"
              helperText="Enter your first name"
              name="firstName"
              value={vendorData.firstName}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleBlur("firstName")}
              fullWidth
              margin="normal"
              required
              error={touched.firstName && !vendorData.firstName}
            />
            <TextField
              label="Vendor Last Name"
              helperText="Enter your last name"
              name="lastName"
              value={vendorData.lastName}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleBlur("lastName")}
              fullWidth
              margin="normal"
              required
              error={touched.lastName && !vendorData.lastName}
            />
            <TextField
              label="Vendor Email"
              helperText="Enter a valid business email"
              name="email"
              type="email"
              value={vendorData.email}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleBlur("email")}
              fullWidth
              margin="normal"
              required
              error={touched.email && !vendorData.email}
            />
            <TextField
              label="Vendor Password"
              helperText="Choose a strong password"
              name="password"
              value={vendorData.password}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleBlur("password")}
              fullWidth
              margin="normal"
              type="password"
              required
              error={touched.password && !vendorData.password}
            />
            <TextField
              label="Vendor Phone Number"
              helperText="Enter a valid phone number"
              name="phoneNumber"
              value={vendorData.phoneNumber}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleBlur("phoneNumber")}
              fullWidth
              margin="normal"
              required
              error={touched.phoneNumber && !vendorData.phoneNumber}
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
              helperText="Enter the official brand name"
              name="brandName"
              value={brandData.brandName || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("brandName")}
              fullWidth
              margin="normal"
              required
              error={touched.brandName && !brandData.brandName}
            />
            <TextField
              label="Commercial Register No."
              helperText="Enter the commercial register number"
              name="commercialRegisterNo"
              value={brandData.commercialRegisterNo || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("commercialRegisterNo")}
              fullWidth
              margin="normal"
              required
              error={
                touched.commercialRegisterNo && !brandData.commercialRegisterNo
              }
            />
            <TextField
              label="Tax Number"
              helperText="Enter the tax identification number"
              name="taxNumber"
              value={brandData.taxNumber || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("taxNumber")}
              fullWidth
              margin="normal"
              required
              error={touched.taxNumber && !brandData.taxNumber}
            />
            <TextField
              label="Company Address"
              helperText="Enter the company address"
              name="companyAddress"
              value={brandData.companyAddress || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("companyAddress")}
              fullWidth
              margin="normal"
              required
              error={touched.companyAddress && !brandData.companyAddress}
            />
            <TextField
              label="Phone Number"
              helperText="Enter a valid contact number"
              name="phoneNumber"
              value={brandData.phoneNumber || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("brandPhoneNumber")}
              fullWidth
              margin="normal"
              required
              error={touched.brandPhoneNumber && !brandData.phoneNumber}
            />
            <TextField
              label="Email"
              helperText="Enter the primary business email"
              name="email"
              value={brandData.email || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("brandEmail")}
              fullWidth
              margin="normal"
              required
              error={touched.brandEmail && !brandData.email}
            />
            {/* 🚀 Added Types Selection */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Brand Types</InputLabel>
              <Select
                multiple
                name="type"
                value={brandData.type}
                onChange={(e) => {
                  const selectedValues = e.target.value;
                  if (selectedValues.length <= 3) {
                    setBrandData((prevState) => ({
                      ...prevState,
                      type: selectedValues,
                    }));
                  }
                }}
                renderValue={(selected) =>
                  selected
                    .map((id) => types.find((type) => type._id === id)?.name)
                    .join(", ")
                }
              >
                {types.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    <Checkbox checked={brandData.type.includes(type._id)} />
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {brandData.type.length >= 3
                  ? "You can select up to 3 types only."
                  : "Select up to 3 types"}
              </FormHelperText>
            </FormControl>
            {/* File Upload Section - Fixed UI Issue */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <label htmlFor="brandlogo">Brand Logo</label>
                  <Input
                    id="brandlogo"
                    name="brandlogo"
                    type="file"
                    onChange={(e) => handleFileChange(e, 2)}
                    accept="image/*"
                  />
                  <FormHelperText>
                    Please upload in .png, .jpeg, or .svg format
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <label htmlFor="coverPhoto">Cover Photo</label>
                  <Input
                    id="coverPhoto"
                    name="coverPhoto"
                    type="file"
                    onChange={(e) => handleFileChange(e, 2)}
                    accept="image/*"
                  />
                  <FormHelperText>
                    Upload image with recommended dimensions of 1920x1080px or
                    16:9 aspect ratio
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              label="Brand Description"
              helperText="Enter a brief brand description, around 50-150 words. Ensure it's consistent in style and tone with the brand's voice"
              name="brandDescription"
              value={brandData.brandDescription || ""}
              onChange={(e) => handleInputChange(e, 2)}
              fullWidth
              margin="normal"
            />
          </Box>
        );

      case 3:
        return (
          <Box
            sx={{
              overflow: "auto",
              maxHeight: "calc(100vh - 300px)", // Reduced height to account for header and buttons
              padding: "20px",
              width: "100%",
              "& .MuiTextField-root": {
                marginBottom: 2, // Add consistent spacing between fields
              },
            }}
          >
            <TextField
              label="Shipping Policy"
              helperText="Describe your shipping policy and fees"
              name="shippingPolicy"
              value={brandData.shippingPolicy || ""}
              onChange={(e) => handleInputChange(e, 3)}
              onBlur={() => handleBlur("shippingPolicy")}
              fullWidth
              margin="normal"
              required
              error={touched.shippingPolicy && !brandData.shippingPolicy}
            />
            <TextField
              label="Bank Account Number"
              helperText="Enter your bank details for payment processing"
              name="bankAccountNumber"
              value={brandData.bankAccountNumber || ""}
              onChange={(e) => handleInputChange(e, 3)}
              onBlur={() => handleBlur("bankAccountNumber")}
              fullWidth
              margin="normal"
              required
              error={touched.bankAccountNumber && !brandData.bankAccountNumber}
            />
            <TextField
              label="Website URL"
              helperText="Enter your official website link"
              name="websiteURL"
              value={brandData.websiteURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Instagram URL"
              helperText="Enter your Instagram profile link"
              name="instagramURL"
              value={brandData.instagramURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Facebook URL"
              helperText="Enter your Facebook page link"
              name="facebookURL"
              value={brandData.facebookURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="TikTok URL"
              helperText="Enter your TikTok profile link"
              name="tiktokURL"
              value={brandData.tiktokURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="LinkedIn URL"
              helperText="Enter your LinkedIn profile link"
              name="linkedinURL"
              value={brandData.linkedinURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
            />
          </Box>
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
          backgroundColor: "rgba(108, 124, 89, 0.8)", // Semi-transparent form
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
