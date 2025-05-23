import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { useNavigate, Link } from "react-router-dom";
import { useVendor } from "../../utils/vendorContext";
import * as Yup from "yup";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useVendor(); // Access the login function from the context

  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error messages

    // Validate input data using Yup
    try {
      await validationSchema.validate(
        { email, password },
        { abortEarly: false }
      );

      // Proceed with the axios request if validation passes
      const response = await axios.post(
        "https://api.thedesigngrit.com/api/vendors/login",
        {
          email,
          password,
        }
      );

      console.log("Login successful", response.data);

      const vendorData = response.data.vendor;

      // Login via context
      login(vendorData);

      // Optionally store vendor data in localStorage for persistence
      localStorage.setItem("vendor", JSON.stringify(vendorData));

      // Redirect user to the dashboard
      navigate(`/vendor-dashboard/${vendorData.brandId}`);
    } catch (error) {
      // If validation fails, show the first validation error
      if (error instanceof Yup.ValidationError) {
        setErrorMessage(error.errors[0]); // Show the first validation error
      } else {
        setErrorMessage("Invalid email or password.");
      }
    }
  };

  return (
    <div
      className="container-login"
      style={{
        backgroundImage: "url('/Assets/signin.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="signinLogo">
        <img
          src="https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/TDG_Icon_Black.webp"
          alt="Logo"
        />
      </h1>
      <Box className="login-form" sx={{ height: "55%" }}>
        {/* <h1 style={{ textAlign: "center", fontFamily: "" }}>Sign In</h1> */}
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Horizon",
            fontWeight: "bold",
          }}
        >
          Vendor Portal
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="input-field"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-input">
            <input
              type="password"
              // type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <div
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div> */}
          </div>
          <button type="submit" className="btn signin-btn">
            Sign In
          </button>
          <p className="signup-link">
            Don't have an account?{" "}
            <Link to="/signupvendor" className="signup-btn">
              Sign Up
            </Link>
          </p>
        </form>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </Box>
    </div>
  );
};

export default SignIn;
