import React, { createContext, useState, useEffect, useContext } from "react";
import { use } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(() => {
    // Retrieve session from LocalStorage if it exists
    const savedSession = localStorage.getItem("userSession");
    return savedSession ? JSON.parse(savedSession) : null;
  });

  useEffect(() => {
    // Save session to LocalStorage whenever it changes
    if (userSession) {

      localStorage.setItem("userSession", JSON.stringify(userSession));
      console.log("userSession:", userSession);
    } else {
      localStorage.removeItem("userSession");
    }
  }, [userSession]);
  // Add a logout function to clear the session
  const logout = () => {
    setUserSession(null); // Clear session in context
    localStorage.removeItem("userSession"); // Remove from localStorage
  };
  return (
    <UserContext.Provider value={{ userSession, setUserSession, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

