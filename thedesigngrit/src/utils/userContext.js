import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);

  return (
    <UserContext.Provider value={{ userSession, setUserSession }}>
      {children}
    </UserContext.Provider>
  );
};
