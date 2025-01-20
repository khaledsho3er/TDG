import React, { useContext, useState } from "react";
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
        "http://localhost:5000/api/signin-emp/signin-emp",
        { email, password, role }
      );

      const user = response.data.user;

      // Save user session including role and tier
      setUserSession({
        ...user,
        role: user.role,
        tier: user.tier, // Assuming the response has a 'tier' property
      });

      // Redirect based on user role
      if (user.role === "Vendor") {
        navigate(`/vendor-dashboard/${user._id}`);
      } else if (user.role === "Employee") {
        navigate(`/vendor-dashboard/${user._id}`);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("Sign-in failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Employee">Employee</option>
          <option value="Vendor">Vendor</option>
        </select>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;
