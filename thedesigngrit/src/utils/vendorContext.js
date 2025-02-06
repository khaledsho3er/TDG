import React, { createContext, useState, useContext, useEffect } from "react";

// Create Vendor Context
const VendorContext = createContext();

// VendorProvider component to wrap your app
export const VendorProvider = ({ children }) => {
  const [vendor, setVendor] = useState(null);

  // Load vendor data from localStorage if it exists
  useEffect(() => {
    const storedVendor = localStorage.getItem("vendor");
    if (storedVendor) {
      setVendor(JSON.parse(storedVendor));
    }
  }, []);

  const login = (vendorData) => {
    setVendor(vendorData);
    localStorage.setItem("vendor", JSON.stringify(vendorData)); // Store vendor data in localStorage
  };

  const logout = () => {
    setVendor(null);
    localStorage.removeItem("vendor"); // Optionally, remove vendor data from localStorage
  };

  return (
    <VendorContext.Provider value={{ vendor, login, logout }}>
      {children}
    </VendorContext.Provider>
  );
};

// Custom hook to use vendor context
export const useVendor = () => {
  return useContext(VendorContext);
};
