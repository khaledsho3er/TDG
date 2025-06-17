import React, { useState, useRef, useEffect } from "react";
import {
  Checkbox,
  Box,
  Popper,
  Paper,
  Typography,
  ClickAwayListener,
  useMediaQuery,
} from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AccountSentPopup from "./successMsgs/successfullyRegistered";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUser } from "../utils/userContext";
import AccountExistsPopup from "./successMsgs/accountExists";

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
  const { setUserSession } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [showRequirements, setShowRequirements] = useState(false);
  const [emailExistsPopup, setEmailExistsPopup] = useState(false);

  const passwordFieldRef = useRef(null);

  // Add media query for medium-sized laptops
  const isMediumLaptop = useMediaQuery(
    "(min-width: 1024px) and (max-width: 1440px)"
  );

  // Add media query for mobile devices
  const isMobile = useMediaQuery("(max-width:768px)");

  // Password requirements state
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError, // <== ADD THIS
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Watch the password field to update strength and requirements
  const watchPassword = watch("password", "");

  // Update password strength and requirements whenever password changes
  useEffect(() => {
    if (watchPassword) {
      calculateStrength(watchPassword);
      checkRequirements(watchPassword);

      // Check if all requirements are met to auto-close the popper
      setShowRequirements(true); // Always show on change
    }
  }, [watchPassword, strength]);

  const checkRequirements = (password) => {
    const newRequirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[\W_]/.test(password),
    };

    setRequirements(newRequirements);
    return newRequirements; // Return the requirements for immediate use
  };

  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/\d/.test(password)) score += 25;
    if (/[\W_]/.test(password)) score += 25;
    setStrength(score);
  };
  const onSubmit = async (data) => {
    try {
      // Register the user
      const response = await axios.post(
        "https://api.thedesigngrit.com/api/signup",
        data
      );

      // If registration is successful, automatically sign in
      if (
        response.data.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        try {
          // Sign in with the same credentials
          const signInResponse = await axios.post(
            "https://api.thedesigngrit.com/api/signin",
            {
              email: data.email,
              password: data.password,
            },
            { withCredentials: true }
          );

          // Set user session
          setUserSession(signInResponse.data.user);

          // Show success popup briefly
          setIsPopupVisible(true);

          // Navigate to home page after a short delay
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } catch (signInError) {
          console.error("Auto sign-in error:", signInError);
          // If auto sign-in fails, still show success message and redirect to login
          setIsPopupVisible(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } else {
        console.error("Registration failed:", response.data.message);
      }
    } catch (error) {
      console.error("Sign-up error:", error);

      // If backend returns email in use error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.toLowerCase().includes("email")
      ) {
        setEmailExistsPopup(true);

        setError("email", {
          type: "manual",
          message: "This email is already exists.",
        });
      }
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    navigate("/login");
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setValue("password", newPassword);
    setShowRequirements(true); // Always show requirements when changing
  };

  const handlePasswordFocus = () => {
    setShowRequirements(true);
  };

  const handleClickAway = () => {
    setShowRequirements(false);
  };

  return (
    <Box>
      <h1
        className="form-title-signup"
        style={
          isMediumLaptop ? { fontSize: "1.5rem", marginBottom: "10px" } : {}
        }
      >
        Register
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="signup-form"
        noValidate
        style={{
          maxWidth: isMediumLaptop ? "450px" : "initial",
          margin: isMediumLaptop ? "0 auto" : "initial",
        }}
      >
        {(errors.email ||
          errors.password ||
          errors.confirmPassword ||
          errors.firstName ||
          errors.lastName ||
          errors.terms) && (
          <div className="login-error-message">
            {errors.email?.message && <div>{errors.email.message}</div>}
            {errors.password?.message && <div>{errors.password.message}</div>}
            {errors.confirmPassword?.message && (
              <div>{errors.confirmPassword.message}</div>
            )}
            {errors.firstName?.message && <div>{errors.firstName.message}</div>}
            {errors.lastName?.message && <div>{errors.lastName.message}</div>}
            {errors.terms?.message && <div>{errors.terms.message}</div>}
          </div>
        )}
        <input
          type="email"
          placeholder="E-mail"
          className="input-field"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
          style={
            isMediumLaptop ? { marginBottom: "10px", padding: "8px 12px" } : {}
          }
        />
        {/* {errors.email && (
          <p
            className="error-message"
            style={
              isMediumLaptop
                ? { marginTop: "-8px", marginBottom: "8px", fontSize: "0.7rem" }
                : {}
            }
          >
            {errors.email.message}
          </p>
        )} */}

        <input
          type="text"
          placeholder="First Name"
          className="input-field"
          {...register("firstName")}
          style={
            isMediumLaptop ? { marginBottom: "10px", padding: "8px 12px" } : {}
          }
        />
        {/* {errors.firstName && (
          <p
            className="error-message"
            style={
              isMediumLaptop
                ? { marginTop: "-8px", marginBottom: "8px", fontSize: "0.7rem" }
                : {}
            }
          >
            {errors.firstName.message}
          </p>
        )} */}

        <input
          type="text"
          placeholder="Last Name"
          className="input-field"
          {...register("lastName")}
          style={
            isMediumLaptop ? { marginBottom: "10px", padding: "8px 12px" } : {}
          }
        />
        {/* {errors.lastName && (
          <p
            className="error-message"
            style={
              isMediumLaptop
                ? { marginTop: "-8px", marginBottom: "8px", fontSize: "0.7rem" }
                : {}
            }
          >
            {errors.lastName.message}
          </p>
        )} */}

        {/* Password Field */}
        <ClickAwayListener onClickAway={handleClickAway}>
          <div style={{ position: "relative" }}>
            <input
              ref={passwordFieldRef}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              style={
                isMediumLaptop
                  ? { marginBottom: "10px", padding: "8px 12px" }
                  : {}
              }
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translate(-50%,-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>

            {/* Password requirements popup */}
            <Popper
              open={showRequirements}
              anchorEl={passwordFieldRef.current}
              placement={isMobile ? "bottom-start" : "right-start"}
              style={{ zIndex: 1000 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  ...(isMobile
                    ? {
                        mt: 1,
                        position: "relative",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: -10,
                          left: 20,
                          borderWidth: "0 10px 10px 10px",
                          borderStyle: "solid",
                          borderColor:
                            "transparent transparent #fff transparent",
                        },
                      }
                    : {
                        ml: 1,
                        position: "relative",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 20,
                          left: -10,
                          borderWidth: "10px 10px 10px 0",
                          borderStyle: "solid",
                          borderColor:
                            "transparent #fff transparent transparent",
                        },
                      }),
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Password Requirements:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li
                    style={{
                      color: requirements.length ? "green" : "red",
                      marginBottom: "4px",
                    }}
                  >
                    At least 8 characters
                  </li>
                  <li
                    style={{
                      color: requirements.uppercase ? "green" : "red",
                      marginBottom: "4px",
                    }}
                  >
                    At least one uppercase letter
                  </li>
                  <li
                    style={{
                      color: requirements.number ? "green" : "red",
                      marginBottom: "4px",
                    }}
                  >
                    At least one number
                  </li>
                  <li style={{ color: requirements.special ? "green" : "red" }}>
                    At least one special character
                  </li>
                </ul>
              </Paper>
            </Popper>
          </div>
        </ClickAwayListener>

        {/* {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )} */}

        {/* Confirm Password Field */}
        <div style={{ position: "relative" }}>
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
              transform: "translate(-50%,-50%)",
              cursor: "pointer",
            }}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>
        {/* {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword.message}</p>
        )} */}

        <div className="register-policy-container">
          <Checkbox
            {...register("terms")}
            sx={{ color: "#efebe8", "&.Mui-checked": { color: "#efebe8" } }}
          />
          <p className="register-policy">
            I have read and accept the{" "}
            <a href="/policy" target="_blank" rel="noopener noreferrer">
              Terms of use
            </a>{" "}
            and{" "}
            <a href="/policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            .
          </p>
        </div>
        {/* {errors.terms && (
          <p className="error-message">{errors.terms.message}</p>
        )} */}

        <button type="submit" className="btn signin-btn">
          Sign Up
        </button>
        <p className="register-link">
          Already have an account? <a href="/Login">Log In</a>
        </p>
      </form>
      <AccountSentPopup show={isPopupVisible} closePopup={closePopup} />
      <AccountExistsPopup
        show={emailExistsPopup}
        onClose={() => {
          setEmailExistsPopup(false);
          navigate("/signup");
        }}
      />
    </Box>
  );
};

export default SignUpForm;
