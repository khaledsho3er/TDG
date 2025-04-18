import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../utils/adminContext";
import * as Yup from "yup";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAdmin(); // Access the login function from context

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error messages

    try {
      await validationSchema.validate(
        { email, password },
        { abortEarly: false }
      );

      // Proceed with the axios request if validation passes
      const res = await axios.post(
        "https://tdg-db.onrender.com/api/admin/login",
        { email, password }
      );

      localStorage.setItem("adminToken", res.data.token);
      login(res.data.admin); // Assuming `res.data.admin` is the object
      navigate("/adminpanel");
    } catch (error) {
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
        backgroundImage: "url('/Assets/signin.jpeg')", // You can replace this with a specific admin background
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <h1 className="signinLogo">
        <img
          src="https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/TDG_Icon_Black.webp"
          alt="Logo"
          style={{ maxWidth: "200px", marginTop: "30px" }}
        />
      </h1>
      <Box
        className="login-form"
        sx={{
          height: "500px",
          padding: "30px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "500px",
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "Montserrat",
            color: "#2d2d2d",
            fontWeight: "normal",
          }}
        >
          Admin Login
        </h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="input-field"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              className="input-field"
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </div>
          <button
            type="submit"
            className="btn signin-btn"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#6B7755",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Login
          </button>
        </form>

        {errorMessage && (
          <div
            className="error-message"
            style={{
              color: "red",
              marginTop: "15px",
              fontSize: "14px",
            }}
          >
            {errorMessage}
          </div>
        )}
      </Box>
    </div>
  );
};

export default AdminLogin;
