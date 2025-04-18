import React, { createContext, useState, useContext, useEffect } from "react";

// Create Admin Context
const AdminContext = createContext();

// AdminProvider component to wrap your app
export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  // Load admin data from localStorage if it exists
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const login = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData)); // Store admin data in localStorage
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin"); // Remove admin data from localStorage
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use admin context
export const useAdmin = () => {
  return useContext(AdminContext);
};
