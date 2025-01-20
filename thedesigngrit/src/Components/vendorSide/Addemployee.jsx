import React, { useState } from "react";
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

const EmployeeSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    employeeNumber: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    tier: "", // new field for authority level
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.employeeNumber ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.tier
    ) {
      setError("All fields are required.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/employee/signup-employee",
        formData
      );
      if (response.status === 200) {
        alert("Employee added successfully. Email notification sent.");
        // Reset form
        setFormData({
          name: "",
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
      setError("Failed to add employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Montserrat" }}>
      <Typography variant="h4" gutterBottom>
        Add New Employee
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
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
            />
          </Grid>
          {/* Dropdown for tier selection */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
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
            </FormControl>
          </Grid>
        </Grid>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          style={{ marginTop: "20px" }}
        >
          {isSubmitting ? "Adding Employee..." : "Add Employee"}
        </Button>
      </form>
    </div>
  );
};

export default EmployeeSignup;
