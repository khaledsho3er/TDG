import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { GoogleLogin } from "@react-oauth/google";
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
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger, // ✅ Add this
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Google OAuth handlers
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoginError(""); // Clear previous error messages

      const response = await axios.post(
        "https://api.thedesigngrit.com/api/google-auth/google",
        {
          credential: credentialResponse.credential,
        },
        { withCredentials: true }
      );

      setUserSession(response.data.user);
      navigate("/");
    } catch (error) {
      console.error("Error during Google sign-in:", error.response || error);

      if (error.response) {
        if (error.response.status === 401) {
          setLoginError("Google authentication failed. Please try again.");
        } else if (error.response.data && error.response.data.message) {
          setLoginError(error.response.data.message);
        } else {
          setLoginError("Google login failed. Please try again.");
        }
      } else {
        setLoginError(
          "Network error. Please check your connection and try again."
        );
      }
    }
  };

  const handleGoogleError = () => {
    setLoginError("Google sign-in was cancelled or failed. Please try again.");
  };

  const onSubmit = async (data) => {
    try {
      setLoginError(""); // Clear previous error messages

      const response = await axios.post(
        "https://api.thedesigngrit.com/api/signin",
        data,
        { withCredentials: true }
      );

      setUserSession(response.data.user);
      navigate("/");
    } catch (error) {
      console.error("Error during sign-in:", error.response || error);

      // Set appropriate error message based on the error response
      if (error.response) {
        if (error.response.status === 401) {
          setLoginError("Invalid email or password. Please try again.");
        } else if (error.response.data && error.response.data.message) {
          setLoginError(error.response.data.message);
        } else {
          setLoginError(
            "Login failed. Please check your credentials and try again."
          );
        }
      } else {
        setLoginError(
          "Network error. Please check your connection and try again."
        );
      }
    }
  };
  const handleValidateAndSubmit = async (data) => {
    const isValid = await trigger(); // Validate fields manually
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
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            render={(renderProps) => (
              <button
                type="button"
                className="btn social-btn google-btn"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                style={{
                  width: "100%",
                  height: "40px",
                  fontFamily: "Montserrat",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <FcGoogle style={{ fontSize: "20px" }} />
                Continue with Google
              </button>
            )}
          />
          {/* <button className="btn social-btn facebook-btn">
            <FaFacebook className="facebook-icon" />
            Continue with Facebook
          </button> */}
        </div>
        <div className="divider-signIn"> OR</div>

        <form onSubmit={handleSubmit(handleValidateAndSubmit)}>
          {/* Display general login error at the top of the form */}
          {(errors.email || errors.password || loginError) && (
            <div className="login-error-message">
              {errors.email?.message && <div>{errors.email.message}</div>}
              {errors.password?.message && <div>{errors.password.message}</div>}
              {loginError && <div>{loginError}</div>}
            </div>
          )}

          <input
            type="email"
            name="email"
            {...register("email")}
            placeholder="E-mail"
            className="input-field"
          />
          {/* {errors.email && (
            <p className="error-message-login">{errors.email.message}</p>
          )} */}

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
                fontFamily: "Montserrat",
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

              "@media (max-width: 768px)": {
                right: "40px",
              },
            }}
          >
            Forgot Password?
          </span>
          {/* {errors.password && (
            <p className="error-message-login">{errors.password.message}</p>
          )} */}

          <button
            type="submit"
            className="btn signin-btn"
            style={{
              marginTop: "24px",
              marginBottom: "-20px",
              "@media (max-width: 768px)": {
                marginBottom: "-15px",
              },
            }}
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
