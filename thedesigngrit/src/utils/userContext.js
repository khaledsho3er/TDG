import React, { createContext, useState, useEffect } from "react";

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
    } else {
      localStorage.removeItem("userSession");
    }
  }, [userSession]);

  return (
    <UserContext.Provider value={{ userSession, setUserSession }}>
      {children}
    </UserContext.Provider>
  );
};
