import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../utils/userContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ForgotPasswordDialog from "./forgetPassword";
import ConfirmationDialog from "./confirmationMsg";
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function SignInForm() {
  const { setUserSession } = useUser();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    useState(false);
  const [forgotPasswordSuccessDialogOpen, setForgotPasswordSuccessDialogOpen] =
    useState(false);
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
        "https://tdg-db.onrender.com/api/signin",
        data,
        { withCredentials: true }
      );

      setUserSession(response.data.user);
      console.log("Login successful!", response.data.user);
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Error during sign-in:", error.response || error);
      alert(
        error.response?.data?.message || "An error occurred during sign-in"
      );
    }
  };

  return (
    <div>
      <h1 className="form-title-signin">Login</h1>
      <div className="signin-form">
        <div className="social-btns-section">
          <button className="btn social-btn google-btn">
            <FcGoogle className="google-icon" />
            Continue with Google
          </button>
          <button className="btn social-btn facebook-btn">
            <FaFacebook className="facebook-icon" />
            Continue with Facebook
          </button>
        </div>
        <div className="divider-signIn"> OR</div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            name="email"
            {...register("email")}
            placeholder="E-mail"
            className="input-field"
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}

          <div style={{ position: "relative" }}>
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
              }}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <span
            onClick={() => setForgotPasswordDialogOpen(true)}
            style={{
              position: "absolute",
              right: "298px",
              fontSize: "12px",
              color: "#6b7b58",
              cursor: "pointer",
            }}
          >
            Forgot Password?
          </span>
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}

          <button type="submit" className="btn signin-btn">
            Sign In
          </button>
        </form>

        <p className="register-link">
          If you don’t have an account? <a href="/signup">Register</a>
        </p>
      </div>
      <ForgotPasswordDialog
        open={forgotPasswordDialogOpen}
        onClose={() => setForgotPasswordDialogOpen(false)}
        onSend={() => setForgotPasswordSuccessDialogOpen(true)}
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
}

export default SignInForm;
