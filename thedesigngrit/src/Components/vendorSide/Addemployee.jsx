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
} from "@mui/material";
import { useVendor } from "../../utils/vendorContext"; // Import the vendor context
import AccountSentPopup from "../successMsgs/successfullyRegistered";
import * as Yup from "yup"; // Import Yup

const VendorSignup = () => {
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
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

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
            `http://localhost:5000/api/brand/${vendor.brandId}`
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
        "http://localhost:5000/api/vendors/signup",
        dataToSend
      );

      // Log the API response for debugging
      console.log("API Response:", response);

      if (response.status === 200) {
        // Show the success popup if the vendor is added successfully
        setShowPopup(true);
        console.log("Employee added successfully."); // Log the success message
        // Reset form
        setFormData({
          firstname: "",
          lastname: "",
          employeeNumber: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          tier: "", // Reset tier field
        });
      }
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

  // Function to close the success popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div style={{ padding: "110px", fontFamily: "Montserrat" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", fontFamily: "Horizon" }}
        gutterBottom
      >
        Add New Vendor
        {/* Display brand name */}
      </Typography>
      <p>Brand: {brandName || "Loading..."} </p>
      <br></br>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              error={!!errors.firstname} // Show error state
              helperText={errors.firstname} // Display error message
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              error={!!errors.lastname} // Show error state
              helperText={errors.lastname} // Display error message
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Employee Number"
              variant="outlined"
              fullWidth
              name="employeeNumber"
              value={formData.employeeNumber}
              onChange={handleChange}
              error={!!errors.employeeNumber} // Show error state
              helperText={errors.employeeNumber} // Display error message
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email} // Show error state
              helperText={errors.email} // Display error message
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber} // Show error state
              helperText={errors.phoneNumber} // Display error message
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Set Password"
              variant="outlined"
              type="password"
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password} // Show error state
              helperText={errors.password} // Display error message
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword} // Show error state
              helperText={errors.confirmPassword} // Display error message
            />
          </Grid>
          {/* Dropdown for tier selection */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.tier}>
              {" "}
              {/* Show error state */}
              <InputLabel>Authority Level (Tier)</InputLabel>
              <Select
                label="Authority Level (Tier)"
                name="tier"
                value={formData.tier}
                onChange={handleChange}
              >
                <MenuItem value="1">Tier 1</MenuItem>
                <MenuItem value="2">Tier 2</MenuItem>
                <MenuItem value="3">Tier 3</MenuItem>
              </Select>
              {errors.tier && <p style={{ color: "red" }}>{errors.tier}</p>}{" "}
              {/* Display error message */}
            </FormControl>
          </Grid>
        </Grid>
        {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}{" "}
        {/* Display API error message */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          style={{ marginTop: "20px" }}
        >
          {isSubmitting ? "Adding Vendor..." : "Add Vendor"}
        </Button>
      </form>
      <AccountSentPopup show={showPopup} closePopup={closePopup} />
    </div>
  );
};

export default VendorSignup;
