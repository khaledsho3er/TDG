import React, { createContext, useState, useEffect } from "react";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employeeSession, setEmployeeSession] = useState(() => {
    // Retrieve session from LocalStorage if it exists
    const savedSession = localStorage.getItem("employeeSession");
    return savedSession ? JSON.parse(savedSession) : null;
  });

  useEffect(() => {
    // Save session to LocalStorage whenever it changes
    if (employeeSession) {
      localStorage.setItem("employeeSession", JSON.stringify(employeeSession));
    } else {
      localStorage.removeItem("employeeSession");
    }
  }, [employeeSession]);

  return (
    <EmployeeContext.Provider value={{ employeeSession, setEmployeeSession }}>
      {children}
    </EmployeeContext.Provider>
  );
};
