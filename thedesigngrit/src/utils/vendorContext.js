import React, { createContext, useState, useContext } from "react";

// Create Vendor Context
const VendorContext = createContext();

// VendorProvider component to wrap your app
export const VendorProvider = ({ children }) => {
  const [vendor, setVendor] = useState(null);

  const login = (vendorData) => {
    setVendor(vendorData);
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
