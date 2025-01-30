import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useVendor } from "../../utils/vendorContext";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useVendor(); // Access the login function from the context

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/vendors/login",
        {
          email,
          password,
        }
      );

      console.log("Login successful", response.data);

      const vendorData = response.data.vendor;

      // Login via context
      login(vendorData); // Set vendor data in the context

      // Optionally store vendor data in localStorage for persistence
      localStorage.setItem("vendor", JSON.stringify(vendorData));

      // Redirect user to the dashboard
      navigate(`/vendor-dashboard/${vendorData.brandId}`);
    } catch (error) {
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <div className="container-login">
      <h1 className="signinLogo">
        <img src="Assets/TDG_logo_Black.png" alt="Logo" />
      </h1>
      <Box className="login-form" sx={{ height: "50%" }}>
        <h1>Sign In</h1>
        <h1>Vendor Portal</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="input-field"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn signin-btn">
            Sign In
          </button>
        </form>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </Box>
    </div>
  );
};

export default SignIn;
