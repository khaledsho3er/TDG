import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useVendor } from "../../utils/vendorContext"; // Import the vendor context
import * as Yup from "yup"; // Import Yup
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

const VendorSignup = ({ open, onClose, refreshList }) => {
  const { vendor } = useVendor(); // Get vendor data (including brandId)
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    employeeNumber: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    tier: "", // new field for authority level (tier)
  });
  const [errors, setErrors] = useState({}); // State to hold error messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandName, setBrandName] = useState(""); // State to store the brand name
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Define the validation schema
  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    employeeNumber: Yup.string().required("Employee number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    tier: Yup.string().required("Authority level is required"),
  });

  // Fetch brand details using brandId from the vendor session
  useEffect(() => {
    if (vendor?.brandId) {
      const fetchBrandName = async () => {
        try {
          const response = await axios.get(
            `https://api.thedesigngrit.com/api/brand/${vendor.brandId}`
          );
          setBrandName(response.data.brandName); // Set the brand name in the state
        } catch (error) {
          console.error("Error fetching brand name:", error);
          setErrors((prev) => ({
            ...prev,
            brand: "Failed to fetch brand details.",
          }));
        }
      };
      fetchBrandName();
    }
  }, [vendor?.brandId]); // Only run this effect when vendor.brandId changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Validate the form data
    try {
      await validationSchema.validate(formData, { abortEarly: false });
    } catch (err) {
      // If validation fails, set the error messages
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const dataToSend = {
      firstName: formData.firstname,
      lastName: formData.lastname,
      email: formData.email,
      password: formData.password,
      employeeNumber: formData.employeeNumber,
      phoneNumber: formData.phoneNumber,
      brandId: vendor.brandId,
      tier: formData.tier,
    };

    console.log("Sending data to API:", dataToSend); // Log the data to be sent

    try {
      const response = await axios.post(
        "https://api.thedesigngrit.com/api/vendors/signup",
        dataToSend
      );

      // Log the API response for debugging
      console.log("API Response:", response);

      console.log("Employee added successfully.");
      onClose(); // Close modal after successful submission
      refreshList(); // Refresh the employee list
    } catch (err) {
      console.error("Error:", err);
      setErrors((prev) => ({
        ...prev,
        api: "Failed to add employee. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle style={{ fontWeight: "Bold", fontFamily: "Horizon" }}>
        Add New Employee
      </DialogTitle>
      <DialogContent>
        <Typography fontFamily={"Montserrat"}>
          Brand: {brandName || "Loading..."}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                error={!!errors.firstname}
                helperText={errors.firstname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                error={!!errors.lastname}
                helperText={errors.lastname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee Number"
                fullWidth
                name="employeeNumber"
                value={formData.employeeNumber}
                onChange={handleChange}
                error={!!errors.employeeNumber}
                helperText={errors.employeeNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Set Password"
                fullWidth
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="textSecondary">
                Password must be at least 6 characters.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Password"
                fullWidth
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword((show) => !show)}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.tier} variant="outlined">
                <InputLabel id="tier-label">Authority Level (Tier)</InputLabel>
                <Select
                  id="tier-label"
                  name="tier"
                  value={formData.tier}
                  onChange={handleChange}
                  label="Authority Level (Tier)"
                >
                  <MenuItem value="1">
                    Tier 1 - Notification Page, Orders List
                  </MenuItem>
                  <MenuItem value="2">
                    Tier 2 - Notifications Page, Orders List, all Products,
                    Promotion, brand profile
                  </MenuItem>
                  <MenuItem value="3">
                    Tier 3 - Full Access + Financials
                  </MenuItem>
                </Select>
                {errors.tier && (
                  <Typography color="error">{errors.tier}</Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
          {errors.api && <Typography color="error">{errors.api}</Typography>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="btn-cancel">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="btn-save"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VendorSignup;
