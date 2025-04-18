import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../utils/adminContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAdmin();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://tdg-db.onrender.com/api/admin/login",
        { email, password }
      );
      localStorage.setItem("adminToken", res.data.token);
      login(res.data.admin); // Assuming `res.data.admin` is the object
      navigate("/adminpanel");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Login
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default AdminLogin;
