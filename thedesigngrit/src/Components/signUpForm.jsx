import React, { useState } from "react";
import { Checkbox, Box } from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AccountSentPopup from "./successMsgs/successfullyRegistered";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(/[\W_]/, "Must contain at least one special character")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the Terms & Privacy Policy"),
});

const SignUpForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [strength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        data
      );
      alert(response.data.message);
      setIsPopupVisible(true);
      navigate("/login");
    } catch (error) {
      console.error("Sign-up error:", error);
      alert(
        error.response?.data?.message || "An error occurred during sign-up."
      );
    }
  };
  const getBarColors = () => {
    if (strength <= 50) return ["red", "#efebe8", "#efebe8", "#efebe8"];
    if (strength <= 75) return ["orange", "orange", "#efebe8", "#efebe8"];
    return ["green", "green", "green", "green"];
  };
  const closePopup = () => {
    setIsPopupVisible(false);
    navigate("/login");
  };

  return (
    <Box>
      <h1 className="form-title-signup">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <input
          type="email"
          placeholder="E-mail"
          className="input-field"
          {...register("email")}
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}

        <input
          type="text"
          placeholder="First Name"
          className="input-field"
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className="error-message">{errors.firstName.message}</p>
        )}

        <input
          type="text"
          placeholder="Last Name"
          className="input-field"
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className="error-message">{errors.lastName.message}</p>
        )}

        {/* Password Field */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input-field"
            {...register("password")}
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>
        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          {getBarColors().map((color, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: "8px",
                backgroundColor: color,
                borderRadius: "4px",
              }}
            ></div>
          ))}
        </div>
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}

        {/* Confirm Password Field */}
        <div style={{ position: "relative", marginTop: "20px" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="input-field"
            {...register("confirmPassword")}
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword.message}</p>
        )}

        <div className="register-policy-container">
          <Checkbox
            {...register("terms")}
            sx={{ color: "#efebe8", "&.Mui-checked": { color: "#efebe8" } }}
          />
          <p className="register-policy">
            I have read and accept the <a href="/policy">Terms of use</a> and{" "}
            <a href="/policy">Privacy Policy</a>.
          </p>
        </div>
        {errors.terms && (
          <p className="error-message">{errors.terms.message}</p>
        )}

        <button type="submit" className="btn signin-btn">
          Sign Up
        </button>
        <p className="register-link">
          Already have an account? <a href="/Login">Log In</a>
        </p>
      </form>
      <AccountSentPopup show={isPopupVisible} closePopup={closePopup} />
    </Box>
  );
};

export default SignUpForm;
