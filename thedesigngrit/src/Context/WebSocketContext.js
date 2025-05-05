import React, { createContext, useState, useEffect } from "react";
import useWebSocket from "../utils/useWebSocket";

// Create a context
const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // WebSocket logic hook
  useWebSocket((message) => {
    if (["orders", "products", "quotations"].includes(message.collection)) {
      setNotifications((prev) => [
        ...prev,
        {
          collection: message.collection,
          type: message.operationType,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  });

  return (
    <WebSocketContext.Provider value={{ notifications }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  return React.useContext(WebSocketContext);
};
