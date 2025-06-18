import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../utils/userContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ForgotPasswordDialog from "./forgetPassword";
import ConfirmationDialog from "./confirmationMsg";
import jwt_decode from "jwt-decode";

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
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Load Google Identity Services
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID", // 🔁 Replace this with your actual client ID
        callback: handleGoogleSuccess,
      });
    }
  }, []);

  const handleGoogleClick = () => {
    if (window.google) {
      google.accounts.id.prompt(); // this shows the One Tap, optional
      google.accounts.id.renderButton(document.getElementById("google-btn"), {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
      });

      // Trigger the actual login
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          handleGoogleError();
        }
      });
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setLoginError("");
      const credential = response.credential;

      const res = await axios.post(
        "https://api.thedesigngrit.com/api/google-auth/google",
        { credential },
        { withCredentials: true }
      );

      setUserSession(res.data.user);
      navigate("/");
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setLoginError("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setLoginError("Google sign-in was cancelled or failed. Please try again.");
  };

  const onSubmit = async (data) => {
    try {
      setLoginError("");
      const response = await axios.post(
        "https://api.thedesigngrit.com/api/signin",
        data,
        { withCredentials: true }
      );
      setUserSession(response.data.user);
      navigate("/");
    } catch (error) {
      console.error("Error during sign-in:", error);
      setLoginError("Invalid email or password. Please try again.");
    }
  };

  const handleValidateAndSubmit = async (data) => {
    const isValid = await trigger();
    if (!isValid) {
      const firstError = errors.email?.message || errors.password?.message;
      setLoginError(firstError);
      return;
    }
    onSubmit(data);
  };

  return (
    <div>
      <h1 className="form-title-signin">Login</h1>
      <div className="signin-form">
        <div className="social-btns-section">
          <button
            id="google-btn"
            className="btn social-btn google-btn"
            onClick={handleGoogleClick}
          >
            <FcGoogle size={20} style={{ marginRight: "8px" }} />
            Continue with Google
          </button>
        </div>

        <div className="divider-signIn"> OR</div>

        <form onSubmit={handleSubmit(handleValidateAndSubmit)}>
          {(errors.email || errors.password || loginError) && (
            <div className="login-error-message">
              {errors.email?.message && <div>{errors.email.message}</div>}
              {errors.password?.message && <div>{errors.password.message}</div>}
              {loginError && <div>{loginError}</div>}
            </div>
          )}

          <input
            type="email"
            {...register("email")}
            placeholder="E-mail"
            className="input-field"
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
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
              right: "59px",
              fontSize: "12px",
              color: "#e0e0e0",
              cursor: "pointer",
              fontFamily: "Montserrat",
            }}
          >
            Forgot Password?
          </span>

          <button
            type="submit"
            className="btn signin-btn"
            style={{ marginTop: "24px" }}
          >
            Sign In
          </button>
        </form>

        <p className="register-link">
          If you don't have an account? <a href="/signup">Register</a>
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
