import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(() => {
    // Retrieve session from LocalStorage if it exists
    const savedSession = localStorage.getItem("userSession");
    return savedSession ? JSON.parse(savedSession) : null;
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("https://tdg-db.onrender.com/api/getUser", { withCredentials: true });
        setUserSession(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
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
