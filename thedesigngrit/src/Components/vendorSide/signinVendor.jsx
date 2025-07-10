import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import { useNavigate, Link } from "react-router-dom";
import { useVendor } from "../../utils/vendorContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ForgotPasswordDialog from "../forgetPassword";
import ConfirmationDialog from "../confirmationMsg";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useVendor();
  const navigate = useNavigate();
  // Forgot password state
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    useState(false);
  const [forgotPasswordSuccessDialogOpen, setForgotPasswordSuccessDialogOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");

      const response = await axios.post(
        "https://api.thedesigngrit.com/api/vendors/login",
        data
      );

      const vendorData = response.data.vendor;
      login(vendorData);
      localStorage.setItem("vendor", JSON.stringify(vendorData));
      navigate(`/vendor-dashboard/${vendorData.brandId}`);
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Invalid email or password.");
        } else if (error.response.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      } else {
        setErrorMessage("Network error. Please check your connection.");
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
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Horizon",
            fontWeight: "bold",
          }}
        >
          Vendor Portal
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <input
            type="email"
            placeholder="Email"
            className="input-field"
            {...register("email")}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}

          <div className="password-input" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              {...register("password")}
              placeholder="Password"
              className="input-field"
            />
            <span
              onClick={() => setShowPassword((prevState) => !prevState)}
              style={{
                position: "absolute",
                right: "18px",
                top: "53%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#6b7b58",
                fontFamily: "Montserrat",
              }}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
            <span
              onClick={() => setForgotPasswordDialogOpen(true)}
              style={{
                position: "absolute",
                right: "0.5rem",
                fontSize: "12px",
                color: "#e0e0e0",
                cursor: "pointer",
                fontFamily: "Montserrat",
                top: "4rem",
                transform: "translateY(-50%)",
                "@media (max-width: 768px)": {
                  right: "40px",
                },
              }}
            >
              Forgot Password?
            </span>
          </div>
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}

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
      </Box>
      {/* Forgot Password Dialogs */}
      <ForgotPasswordDialog
        open={forgotPasswordDialogOpen}
        onClose={() => setForgotPasswordDialogOpen(false)}
        onSend={() => setForgotPasswordSuccessDialogOpen(true)}
        type="vendor"
      />
      <ConfirmationDialog
        open={forgotPasswordSuccessDialogOpen}
        title="Reset Link Sent"
        content="A password reset link has been sent to your email."
        onConfirm={() => setForgotPasswordSuccessDialogOpen(false)}
        onCancel={() => setForgotPasswordSuccessDialogOpen(false)}
      />
    </div>
  );
};

export default SignIn;
