import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function SignInForm() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Define state for storing the form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send POST request to backend API for sign-in
    try {
      const response = await axios.post(
        "http://localhost:5000/api/signin",
        formData
      );

      // On successful login, store the token (in localStorage or cookies)
      localStorage.setItem("authToken", response.data.token);

      // Optionally, navigate to the home page or dashboard
      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert(
        error.response?.data?.message || "An error occurred during sign-in"
      );
    }
  };

  return (
    <div>
      <h1 className="form-title-signin">Login</h1>
      <div className="signin-form">
        <button className="btn social-btn google-btn">
          <FcGoogle className="google-icon" />
          Continue with Google
        </button>
        <button className="btn social-btn facebook-btn">
          <FaFacebook className="facebook-icon" />
          Continue with Facebook
        </button>
        <div className="divider-signIn"> OR</div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail"
            className="input-field"
            required
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="input-field"
              required
            />
            <span
              onClick={() => setShowPassword((prevState) => !prevState)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#6b7b58",
              }}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <button type="submit" className="btn signin-btn">
            Sign In
          </button>
        </form>
        <p className="register-link">
          If you don’t have an account? <a href="/signup">Register</a>
        </p>
      </div>
    </div>
  );
}

export default SignInForm;
