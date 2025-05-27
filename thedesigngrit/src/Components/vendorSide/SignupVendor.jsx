import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
  Popper,
  Paper,
  ClickAwayListener,
  useMediaQuery,
} from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

function Signupvendor() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [vendorId, setVendorId] = useState(null);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [types, setTypes] = useState([]);
  const [brandLogo, setBrandLogo] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [catalogues, setCatalogues] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showRequirements, setShowRequirements] = useState(false);
  const passwordFieldRef = useRef(null);

  // Add media query for mobile devices
  const isMobile = useMediaQuery("(max-width:768px)");

  // Password requirements state
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  // Define validation schemas for each phase
  const phase1Schema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"),
  });

  const phase2Schema = Yup.object().shape({
    brandName: Yup.string().required("Brand name is required"),
    commercialRegisterNo: Yup.string().required(
      "Commercial register number is required"
    ),
    taxNumber: Yup.string()
      .required("Tax number is required")
      .matches(/^\d+$/, "Tax number should contain only digits"),
    companyAddress: Yup.string().required("Company address is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    type: Yup.array()
      .min(1, "Select at least one type")
      .max(3, "You can select up to 3 types only"),
    brandDescription: Yup.string(),
  });

  const phase3Schema = Yup.object().shape({
    shippingPolicy: Yup.string().required("Shipping policy is required"),
    bankAccountNumber: Yup.string().required("Bank account number is required"),
    websiteURL: Yup.string().nullable(),
    instagramURL: Yup.string().nullable(),
    facebookURL: Yup.string().nullable(),
    tiktokURL: Yup.string().nullable(),
    linkedinURL: Yup.string().nullable(),
  });

  // Setup react-hook-form for each phase
  const phase1Form = useForm({
    resolver: yupResolver(phase1Schema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      employeeNumber: Math.floor(1000 + Math.random() * 9000).toString(),
      tier: "3",
    },
  });

  const phase2Form = useForm({
    resolver: yupResolver(phase2Schema),
    mode: "onBlur",
    defaultValues: {
      brandName: "",
      commercialRegisterNo: "",
      taxNumber: "",
      companyAddress: "",
      phoneNumber: "",
      email: "",
      type: [],
      brandDescription: "",
    },
  });

  const phase3Form = useForm({
    resolver: yupResolver(phase3Schema),
    mode: "onBlur",
    defaultValues: {
      shippingPolicy: "",
      bankAccountNumber: "",
      websiteURL: "",
      instagramURL: "",
      facebookURL: "",
      tiktokURL: "",
      linkedinURL: "",
    },
  });

  // Get form methods
  const {
    register: registerPhase1,
    handleSubmit: handleSubmitPhase1,
    formState: { errors: errorsPhase1 },
    setValue: setValuePhase1,
    watch: watchPhase1,
  } = phase1Form;

  const {
    register: registerPhase2,
    handleSubmit: handleSubmitPhase2,
    formState: { errors: errorsPhase2 },
    control: controlPhase2,
  } = phase2Form;

  const {
    register: registerPhase3,
    handleSubmit: handleSubmitPhase3,
    formState: { errors: errorsPhase3 },
  } = phase3Form;

  // Watch the password field to update requirements
  const watchPassword = watchPhase1("password", "");

  // Update password requirements whenever password changes
  useEffect(() => {
    if (watchPassword) {
      const newRequirements = checkRequirements(watchPassword);
      setShowRequirements(true); // Always show on change
    }
  }, [watchPassword]);

  const checkRequirements = (password) => {
    const newRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[\W_]/.test(password),
    };

    setRequirements(newRequirements);
    return newRequirements;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setValuePhase1("password", newPassword);
    setShowRequirements(true);
  };

  const handlePasswordFocus = () => {
    setShowRequirements(true);
  };

  const handleClickAway = () => {
    setShowRequirements(false);
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get(
        "https://api.thedesigngrit.com/api/types/getAll"
      );
      if (response.status === 200) {
        setTypes(response.data);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Handle file changes
  const handleFileChange = (event, fileType) => {
    const { files } = event.target;

    switch (fileType) {
      case "brandlogo":
        setBrandLogo(files[0]);
        break;
      case "coverPhoto":
        setCoverPhoto(files[0]);
        break;
      case "catalogues":
        const pdfFiles = Array.from(files).filter(
          (file) => file.type === "application/pdf"
        );
        setCatalogues(pdfFiles);
        break;
      case "documents":
        setDocuments(Array.from(files));
        break;
      default:
        break;
    }
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Handle form submissions for each phase
  const onSubmitPhase1 = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://api.thedesigngrit.com/api/vendors/signup",
        data,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitPhase2 = (data) => {
    setCurrentPhase(3);
  };

  const onSubmitPhase3 = async (data) => {
    setIsSubmitting(true);

    const formData = new FormData();

    // Add phase 2 data
    // Add phase 2 data
    const phase2Data = phase2Form.getValues();
    Object.keys(phase2Data).forEach((key) => {
      if (key === "type") {
        // Use "types" as the field name and append each type ID individually
        phase2Data[key].forEach((typeId) => {
          formData.append("types", typeId);
        });
      } else {
        formData.append(key, phase2Data[key]);
      }
    });

    // Add phase 3 data
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    // Add files
    if (brandLogo) formData.append("brandlogo", brandLogo);
    if (coverPhoto) formData.append("coverPhoto", coverPhoto);

    catalogues.forEach((file) => {
      formData.append("catalogues", file);
    });

    documents.forEach((file) => {
      formData.append("documents", file);
    });

    // Add additional fields
    formData.append("status", "pending");
    formData.append("fees", 0);
    formData.append("createdAt", new Date().toISOString());

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

        // Navigate after a short delay to show the success message
        setTimeout(() => {
          navigate("/signin-vendor");
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create brand account";
      showToastMessage(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom styles for text fields
  const whiteTextFieldStyles = {
    "& .MuiInputBase-input": {
      color: "white !important",
    },
    "& .MuiInputLabel-root": {
      color: "white !important",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white !important",
      },
      "&:hover fieldset": {
        borderColor: "white !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white !important",
      },
      "&.Mui-error fieldset": {
        borderColor: "#f44336 !important",
      },
    },
    "& .MuiFormHelperText-root": {
      color: "rgba(255, 255, 255, 0.7)",
    },
    "& .Mui-error": {
      color: "#f44336",
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "#f44336",
    },
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
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            marginBottom: 2,
            color: "#2d2d2d",
            fontFamily: "montserrat !important",
          }}
        >
          Vendor and Brand Registration
        </Typography>

        {currentPhase === 1 && (
          <form onSubmit={handleSubmitPhase1(onSubmitPhase1)}>
            <TextField
              label="First Name"
              {...registerPhase1("firstName")}
              error={!!errorsPhase1.firstName}
              helperText={errorsPhase1.firstName?.message}
              fullWidth
              margin="normal"
              sx={whiteTextFieldStyles}
            />

            <TextField
              label="Last Name"
              {...registerPhase1("lastName")}
              error={!!errorsPhase1.lastName}
              helperText={errorsPhase1.lastName?.message}
              fullWidth
              margin="normal"
              sx={whiteTextFieldStyles}
            />

            <TextField
              label="Email"
              type="email"
              {...registerPhase1("email")}
              error={!!errorsPhase1.email}
              helperText={errorsPhase1.email?.message}
              fullWidth
              margin="normal"
              sx={whiteTextFieldStyles}
            />

            {/* Password Field with Requirements Popper */}
            <ClickAwayListener onClickAway={handleClickAway}>
              <div style={{ position: "relative", width: "100%" }}>
                <TextField
                  inputRef={passwordFieldRef}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={handlePasswordFocus}
                  error={!!errorsPhase1.password}
                  helperText={errorsPhase1.password?.message}
                  fullWidth
                  margin="normal"
                  sx={whiteTextFieldStyles}
                  InputProps={{
                    endAdornment: (
                      <Box
                        component="span"
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{
                          cursor: "pointer",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </Box>
                    ),
                  }}
                />

                {/* Password requirements popup */}
                <Popper
                  open={showRequirements}
                  anchorEl={passwordFieldRef.current}
                  placement={isMobile ? "bottom-start" : "right-start"}
                  style={{ zIndex: 1000 }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      ...(isMobile
                        ? {
                            mt: 1,
                            position: "relative",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: -10,
                              left: 20,
                              borderWidth: "0 10px 10px 10px",
                              borderStyle: "solid",
                              borderColor:
                                "transparent transparent #fff transparent",
                            },
                          }
                        : {
                            ml: 1,
                            position: "relative",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 20,
                              left: -10,
                              borderWidth: "10px 10px 10px 0",
                              borderStyle: "solid",
                              borderColor:
                                "transparent #fff transparent transparent",
                            },
                          }),
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Password Requirements:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      <li
                        style={{
                          color: requirements.length ? "green" : "red",
                          marginBottom: "4px",
                        }}
                      >
                        At least 8 characters
                      </li>
                      <li
                        style={{
                          color: requirements.uppercase ? "green" : "red",
                          marginBottom: "4px",
                        }}
                      >
                        At least one uppercase letter
                      </li>
                      <li
                        style={{
                          color: requirements.number ? "green" : "red",
                          marginBottom: "4px",
                        }}
                      >
                        At least one number
                      </li>
                      <li
                        style={{
                          color: requirements.special ? "green" : "red",
                        }}
                      >
                        At least one special character
                      </li>
                    </ul>
                  </Paper>
                </Popper>
              </div>
            </ClickAwayListener>

            <TextField
              label="Phone Number"
              {...registerPhase1("phoneNumber")}
              error={!!errorsPhase1.phoneNumber}
              helperText={errorsPhase1.phoneNumber?.message}
              fullWidth
              margin="normal"
              sx={whiteTextFieldStyles}
            />

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              sx={{
                marginTop: 2,
                color: "white",
                backgroundColor: "#2d2d2d",
                "&:hover": {
                  backgroundColor: "#4a4a4a",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Next"
              )}
            </Button>
          </form>
        )}

        {currentPhase === 2 && (
          <form onSubmit={handleSubmitPhase2(onSubmitPhase2)}>
            <Box
              sx={{
                overflow: "auto",
                maxHeight: "calc(100vh - 200px)",
                padding: "20px",
                "&::-webkit-scrollbar": {
                  background: "#fff",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#2d2d2d",
                },
              }}
            >
              <TextField
                label="Brand Name"
                {...registerPhase2("brandName")}
                error={!!errorsPhase2.brandName}
                helperText={errorsPhase2.brandName?.message}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <TextField
                label="Commercial Register No."
                {...registerPhase2("commercialRegisterNo")}
                error={!!errorsPhase2.commercialRegisterNo}
                helperText={errorsPhase2.commercialRegisterNo?.message}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <TextField
                label="Tax Number"
                {...registerPhase2("taxNumber")}
                error={!!errorsPhase2.taxNumber}
                helperText={errorsPhase2.taxNumber?.message}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <TextField
                label="Company Address"
                {...registerPhase2("companyAddress")}
                error={!!errorsPhase2.companyAddress}
                helperText={errorsPhase2.companyAddress?.message}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <TextField
                label="Phone Number"
                {...registerPhase2("phoneNumber")}
                error={!!errorsPhase2.phoneNumber}
                helperText={errorsPhase2.phoneNumber?.message}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <TextField
                label="Email"
                type="email"
                {...registerPhase2("email")}
                error={!!errorsPhase2.email}
                helperText={errorsPhase2.email?.message}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <FormControl
                fullWidth
                margin="normal"
                error={!!errorsPhase2.type}
                sx={{
                  ...whiteTextFieldStyles,
                  "& .MuiSelect-icon": { color: "white" },
                }}
              >
                <InputLabel sx={{ color: "white" }}>Brand Types</InputLabel>
                <Controller
                  name="type"
                  control={controlPhase2}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      renderValue={(selected) =>
                        selected
                          .map(
                            (id) => types.find((type) => type._id === id)?.name
                          )
                          .join(", ")
                      }
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            backgroundColor: "#6c7c59",
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
                          <Checkbox checked={field.value.includes(type._id)} />
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>
                  {errorsPhase2.type?.message || "Select up to 3 types"}
                </FormHelperText>
              </FormControl>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <FormControl fullWidth margin="normal">
                    <label htmlFor="brandlogo" style={{ color: "white" }}>
                      Brand Logo
                    </label>
                    <Input
                      id="brandlogo"
                      type="file"
                      onChange={(e) => handleFileChange(e, "brandlogo")}
                      accept="image/*"
                      sx={{ color: "white" }}
                    />
                    <FormHelperText sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Please upload in .png, .jpeg, or .svg format
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth margin="normal">
                    <label htmlFor="coverPhoto" style={{ color: "white" }}>
                      Cover Photo
                    </label>
                    <Input
                      id="coverPhoto"
                      type="file"
                      onChange={(e) => handleFileChange(e, "coverPhoto")}
                      accept="image/*"
                      sx={{ color: "white" }}
                    />
                    <FormHelperText sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Upload image with recommended dimensions of 1920x1080px
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                label="Brand Description"
                {...registerPhase2("brandDescription")}
                error={!!errorsPhase2.brandDescription}
                helperText={
                  errorsPhase2.brandDescription?.message ||
                  "Enter a brief brand description, around 50-150 words"
                }
                fullWidth
                margin="normal"
                multiline
                rows={2}
                sx={whiteTextFieldStyles}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              sx={{
                marginTop: 2,
                color: "white",
                backgroundColor: "#2d2d2d",
                "&:hover": {
                  backgroundColor: "#4a4a4a",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Next"
              )}
            </Button>
          </form>
        )}

        {currentPhase === 3 && (
          <form onSubmit={handleSubmitPhase3(onSubmitPhase3)}>
            <Box
              sx={{
                overflow: "auto",
                maxHeight: "calc(100vh - 300px)",
                padding: "20px",
                width: "100%",
                "& .MuiTextField-root": {
                  marginBottom: 2,
                },
                "&::-webkit-scrollbar": {
                  background: "#fff",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#2d2d2d",
                },
              }}
            >
              <TextField
                label="Shipping Policy"
                {...registerPhase3("shippingPolicy")}
                error={!!errorsPhase3.shippingPolicy}
                helperText={errorsPhase3.shippingPolicy?.message}
                fullWidth
                margin="normal"
                multiline
                rows={1}
                sx={whiteTextFieldStyles}
              />

              <TextField
                label="Bank Account Number"
                {...registerPhase3("bankAccountNumber")}
                error={!!errorsPhase3.bankAccountNumber}
                helperText={errorsPhase3.bankAccountNumber?.message}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <TextField
                label="Website URL (optional)"
                {...registerPhase3("websiteURL")}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <TextField
                label="Instagram URL (optional)"
                {...registerPhase3("instagramURL")}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <TextField
                label="Facebook URL (optional)"
                {...registerPhase3("facebookURL")}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <TextField
                label="TikTok URL (optional)"
                {...registerPhase3("tiktokURL")}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <TextField
                label="LinkedIn URL (optional)"
                {...registerPhase3("linkedinURL")}
                fullWidth
                margin="normal"
                sx={whiteTextFieldStyles}
              />

              <FormControl fullWidth margin="normal">
                <label htmlFor="catalogues" style={{ color: "white" }}>
                  Catalogues (PDF only)
                </label>
                <Input
                  id="catalogues"
                  type="file"
                  onChange={(e) => handleFileChange(e, "catalogues")}
                  accept="application/pdf"
                  multiple
                  sx={{ color: "white" }}
                />
                <FormHelperText sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Upload your product catalogues in PDF format
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <label htmlFor="documents" style={{ color: "white" }}>
                  Additional Documents
                </label>
                <Input
                  id="documents"
                  type="file"
                  onChange={(e) => handleFileChange(e, "documents")}
                  multiple
                  sx={{ color: "white" }}
                />
                <FormHelperText sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Upload any additional documents
                </FormHelperText>
              </FormControl>
            </Box>

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              sx={{
                marginTop: 2,
                color: "white",
                backgroundColor: "#2d2d2d",
                "&:hover": {
                  backgroundColor: "#4a4a4a",
                },
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Finish"
              )}
            </Button>
          </form>
        )}

        <Typography
          variant="subtitle2"
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
            color: "white",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/signin-vendor"
            style={{
              textDecoration: "none",
              color: "#f0f0f0",
              marginLeft: "5px",
            }}
          >
            Sign in
          </Link>
        </Typography>
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
