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
import Toast from "../toast";

function Signupvendor() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [vendorId, setVendorId] = useState(null);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // "success" or "error"
  const [errors, setErrors] = useState({
    // Vendor data fields
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    // Brand data fields
    brandName: "",
    commercialRegisterNo: "",
    taxNumber: "",
    companyAddress: "",
    brandPhoneNumber: "",
    brandEmail: "",
    // Phase 3 fields
    shippingPolicy: "",
    bankAccountNumber: "",
  });
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
        "https://api.thedesigngrit.com/api/types/getAll"
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

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          error = "This field is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters long";
        }
        break;
      case "phoneNumber":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^\+?[\d\s-]{10,}$/.test(value)) {
          error = "Please enter a valid phone number";
        }
        break;
      case "brandName":
      case "commercialRegisterNo":
      case "taxNumber":
      case "companyAddress":
      case "brandPhoneNumber":
      case "brandEmail":
      case "shippingPolicy":
      case "bankAccountNumber":
        if (!value.trim()) {
          error = "This field is required";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    const value = fieldName.includes("brand")
      ? brandData[fieldName.replace("brand", "").toLowerCase()]
      : vendorData[fieldName];

    const error = validateField(fieldName, value);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleInputChange = (event, phase) => {
    const { name, value } = event.target;

    if (phase === 1) {
      setVendorData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      // Clear error when user starts typing
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    } else {
      setBrandData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      // Clear error when user starts typing
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
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

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleNext = async (e) => {
    e.preventDefault();
    const sanitizedData = sanitizeVendorData();

    // Validate all fields in the current phase
    let hasErrors = false;
    const currentFields =
      currentPhase === 1
        ? Object.keys(vendorData)
        : currentPhase === 2
        ? Object.keys(brandData)
        : ["shippingPolicy", "bankAccountNumber"];

    currentFields.forEach((field) => {
      const value =
        currentPhase === 1
          ? vendorData[field]
          : currentPhase === 2
          ? brandData[field]
          : brandData[field];

      const error = validateField(field, value);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
        hasErrors = true;
      }
    });

    if (hasErrors) {
      showToastMessage("Please fix the errors before proceeding", "error");
      return;
    }

    if (currentPhase === 1) {
      try {
        const response = await axios.post(
          "https://api.thedesigngrit.com/api/vendors/signup",
          sanitizedData,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 201) {
          setVendorId(response.data._id);
          setCurrentPhase(2);
          showToastMessage("Vendor account created successfully!");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to create vendor account";
        showToastMessage(errorMessage, "error");
      }
    } else if (currentPhase === 2) {
      setCurrentPhase(3);
    } else if (currentPhase === 3) {
      const formData = new FormData();

      Object.keys(brandData).forEach((key) => {
        if (Array.isArray(brandData[key])) {
          if (key === "type") {
            formData.append("type", JSON.stringify(brandData[key]));
          } else {
            brandData[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          }
        } else {
          formData.append(key, brandData[key]);
        }
      });

      try {
        const response = await axios.post(
          "https://api.thedesigngrit.com/api/brand/brand",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 201) {
          await axios.put(
            `https://api.thedesigngrit.com/api/vendors/${vendorId}`,
            {
              brandId: response.data._id,
            }
          );
          showToastMessage("Signup completed successfully!");
          // Reset form data
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
            type: [],
            status: "pending",
            documents: [],
            fees: 0,
            createdAt: "",
          });
          // Navigate after a short delay to show the success message
          setTimeout(() => {
            navigate("/signin-vendor");
          }, 2000);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to create brand account";
        showToastMessage(errorMessage, "error");
      }
    }
  };
  const whiteTextFieldStyles = {
    "& .MuiInputBase-input": {
      color: "white", // Text color
    },
    "& .MuiInputLabel-root": {
      color: "white", // Label color
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white", // Outline color
      },
      "&:hover fieldset": {
        borderColor: "white", // Outline color on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "white", // Outline color when focused
      },
      "&.Mui-focused": {
        color: "white", // Text color when focused
        borderColor: "white", // Outline color when focused
      },
    },
    "& .MuiFormHelperText-root": {
      color: "white", // Helper text color
    },
  };
  const renderPhaseContent = () => {
    switch (currentPhase) {
      case 1:
        return (
          <>
            <TextField
              label="Vendor First Name"
              helperText={
                touched.firstName ? errors.firstName : "Enter your first name"
              }
              name="firstName"
              value={vendorData.firstName}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleBlur("firstName")}
              fullWidth
              margin="normal"
              required
              error={touched.firstName && !!errors.firstName}
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Vendor Last Name"
              helperText={
                touched.lastName ? errors.lastName : "Enter your last name"
              }
              name="lastName"
              value={vendorData.lastName}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleBlur("lastName")}
              fullWidth
              margin="normal"
              required
              error={touched.lastName && !!errors.lastName}
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Vendor Email"
              helperText={
                touched.email ? errors.email : "Enter a valid business email"
              }
              name="email"
              type="email"
              value={vendorData.email}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleBlur("email")}
              fullWidth
              margin="normal"
              required
              error={touched.email && !!errors.email}
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Vendor Password"
              helperText={
                touched.password ? errors.password : "Choose a strong password"
              }
              name="password"
              value={vendorData.password}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleBlur("password")}
              fullWidth
              margin="normal"
              type="password"
              required
              error={touched.password && !!errors.password}
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Vendor Phone Number"
              helperText={
                touched.phoneNumber
                  ? errors.phoneNumber
                  : "Enter a valid phone number"
              }
              name="phoneNumber"
              value={vendorData.phoneNumber}
              onChange={(e) => handleInputChange(e, 1)}
              onBlur={() => handleBlur("phoneNumber")}
              fullWidth
              margin="normal"
              required
              error={touched.phoneNumber && !!errors.phoneNumber}
              sx={whiteTextFieldStyles}
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
              helperText={
                touched.brandName
                  ? errors.brandName
                  : "Enter the official brand name"
              }
              name="brandName"
              value={brandData.brandName || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("brandName")}
              fullWidth
              margin="normal"
              required
              error={touched.brandName && !!errors.brandName}
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Commercial Register No."
              helperText={
                touched.commercialRegisterNo
                  ? errors.commercialRegisterNo
                  : "Enter the commercial register number"
              }
              name="commercialRegisterNo"
              value={brandData.commercialRegisterNo || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("commercialRegisterNo")}
              fullWidth
              margin="normal"
              required
              error={
                touched.commercialRegisterNo && !!errors.commercialRegisterNo
              }
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Tax Number"
              helperText={
                touched.taxNumber
                  ? errors.taxNumber
                  : "Enter the tax identification number"
              }
              name="taxNumber"
              value={brandData.taxNumber || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("taxNumber")}
              fullWidth
              margin="normal"
              required
              error={touched.taxNumber && !!errors.taxNumber}
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Company Address"
              helperText={
                touched.companyAddress
                  ? errors.companyAddress
                  : "Enter the company address"
              }
              name="companyAddress"
              value={brandData.companyAddress || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("companyAddress")}
              fullWidth
              margin="normal"
              required
              error={touched.companyAddress && !!errors.companyAddress}
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Phone Number"
              helperText={
                touched.brandPhoneNumber
                  ? errors.brandPhoneNumber
                  : "Enter a valid contact number"
              }
              name="phoneNumber"
              value={brandData.phoneNumber || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("brandPhoneNumber")}
              fullWidth
              margin="normal"
              required
              error={touched.brandPhoneNumber && !!errors.brandPhoneNumber}
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Email"
              helperText={
                touched.brandEmail
                  ? errors.brandEmail
                  : "Enter the primary business email"
              }
              name="email"
              value={brandData.email || ""}
              onChange={(e) => handleInputChange(e, 2)}
              onBlur={() => handleBlur("brandEmail")}
              fullWidth
              margin="normal"
              required
              error={touched.brandEmail && !!errors.brandEmail}
              sx={whiteTextFieldStyles}
            />
            {/* 🚀 Added Types Selection */}
            <FormControl
              fullWidth
              margin="normal"
              sx={{
                "& .MuiInputLabel-root": {
                  color: "white",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                  color: "white",
                },
                "& .MuiSvgIcon-root": {
                  color: "white", // Dropdown icon color
                },
                "& .MuiFormHelperText-root": {
                  color: "white",
                },
              }}
            >
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
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#6c7c59", // Match your background color
                      color: "white",
                      "& .MuiMenuItem-root": {
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                        },
                      },
                    },
                  },
                }}
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
                    sx={{ color: "white" }}
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
                    sx={{ color: "white" }}
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
              sx={whiteTextFieldStyles}
            />
          </Box>
        );

      case 3:
        return (
          <Box
            sx={{
              overflow: "auto",
              maxHeight: "calc(100vh - 300px)",
              padding: "20px",
              width: "100%",
              "& .MuiTextField-root": {
                marginBottom: 2,
              },
            }}
          >
            <TextField
              label="Shipping Policy"
              helperText={
                touched.shippingPolicy
                  ? errors.shippingPolicy
                  : "Describe your shipping policy and fees"
              }
              name="shippingPolicy"
              value={brandData.shippingPolicy || ""}
              onChange={(e) => handleInputChange(e, 3)}
              onBlur={() => handleBlur("shippingPolicy")}
              fullWidth
              margin="normal"
              required
              error={touched.shippingPolicy && !!errors.shippingPolicy}
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Bank Account Number"
              helperText={
                touched.bankAccountNumber
                  ? errors.bankAccountNumber
                  : "Enter your bank details for payment processing"
              }
              name="bankAccountNumber"
              value={brandData.bankAccountNumber || ""}
              onChange={(e) => handleInputChange(e, 3)}
              onBlur={() => handleBlur("bankAccountNumber")}
              fullWidth
              margin="normal"
              required
              error={touched.bankAccountNumber && !!errors.bankAccountNumber}
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Website URL"
              helperText="Enter your official website link"
              name="websiteURL"
              value={brandData.websiteURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Instagram URL"
              helperText="Enter your Instagram profile link"
              name="instagramURL"
              value={brandData.instagramURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="Facebook URL"
              helperText="Enter your Facebook page link"
              name="facebookURL"
              value={brandData.facebookURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="TikTok URL"
              helperText="Enter your TikTok profile link"
              name="tiktokURL"
              value={brandData.tiktokURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              fullWidth
              margin="normal"
              sx={whiteTextFieldStyles}
            />
            <TextField
              label="LinkedIn URL"
              helperText="Enter your LinkedIn profile link"
              name="linkedinURL"
              value={brandData.linkedinURL || ""}
              onChange={(e) => handleInputChange(e, 3)}
              sx={whiteTextFieldStyles}
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
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      ></Box>

      <Box
        sx={{
          width: "80%",
          maxWidth: "600px",
          backgroundColor: "rgba(108, 124, 89, 0.8)",
          padding: 3,
          borderRadius: 2,
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.13)",
          position: "relative",
          zIndex: 2,
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
                backgroundColor: "#4a4a4a",
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
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          type={toastType}
        />
      )}
    </Box>
  );
}

export default Signupvendor;
