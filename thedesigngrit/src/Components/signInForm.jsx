import React, { useContext, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { UserContext } from "../utils/userContext"; // Import the UserContext

function SignInForm() {
  const { setUserSession } = useContext(UserContext); // Access the context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/signin",
        formData,
        { withCredentials: true } // Include session cookies
      );

      // Save session data to context
      setUserSession(response.data);

      console.log("Login successful!", response.data);
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
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="input-field"
            required
          />
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
