// hooks/useWebSocket.js
import { useEffect } from "react";

const useWebSocket = (onMessageCallback) => {
  useEffect(() => {
    const socket = new WebSocket("wss://api.thedesigngrit.com"); // Use your live server's domain with wss://

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received WebSocket message:", data);
        if (onMessageCallback) {
          onMessageCallback(data);
        }
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, [onMessageCallback]);
};

export default useWebSocket;
