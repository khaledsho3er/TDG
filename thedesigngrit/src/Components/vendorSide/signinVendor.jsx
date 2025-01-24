import React, { useContext, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../utils/userContext";

const Signin = () => {
  const { setUserSession } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee"); // Default role

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/signin-emp/signin-emp", // Ensure correct API path
        { email, password, role }
      );

      const user = response.data.user;

      if (!user) {
        throw new Error("User data not received.");
      }

      // Debugging: Check if tier exists in response
      console.log("User Data:", user);

      const sessionData = {
        _id: user._id,
        email: user.email,
        role: user.role,
        tier: user.tier || "Unknown", // Instead of "N/A", use "Unknown" for better clarity
      };

      setUserSession(sessionData);
      localStorage.setItem("userSession", JSON.stringify(sessionData));

      // Show welcome alert with tier information
      if (user.role === "Employee") {
        alert(`Welcome Employee Tier ${user.tier || "N/A"}`);
        navigate(`/employee-dashboard/${user._id}`);
      } else if (user.role === "Vendor") {
        alert("Welcome Vendor");
        navigate(`/vendor-dashboard/${user._id}`);
      }
    } catch (error) {
      console.error("Error during sign-in:", error.response || error);
      alert("Sign-in failed. Please check your credentials.");
    }
  };

  return (
    <div className="container-login">
      <h1 className="signinLogo">
        <img src="Assets/TDG_logo_Black.png" alt="Logo" />
      </h1>
      <Box className="login-form" sx={{ height: "50%" }}>
        <h1>Sign In</h1>
        <h1>Vendor Portal</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="input-field"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Employee">Employee</option>
            <option value="Vendor">Vendor</option>
          </select>
          <button type="submit" className="btn signin-btn">
            Sign In
          </button>
        </form>
      </Box>
    </div>
  );
};

export default Signin;
