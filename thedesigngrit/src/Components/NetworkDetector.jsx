import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";

// Define animations
const pulse = keyframes`
  0% { opacity: 0.6; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.6; transform: scale(0.98); }
`;

const wiggle = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Network failure icon component
const NetworkFailureIcon = () => {
  return (
    <Box
      sx={{
        width: "120px",
        height: "120px",
        position: "relative",
        margin: "0 auto 20px",
        animation: `${fadeIn} 0.5s ease-out`,
      }}
    >
      {/* Outer circle (wifi signal) */}
      <Box
        sx={{
          position: "absolute",
          top: "10px",
          left: "10px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          border: "6px solid #f0f0f0",
          opacity: 0.7,
        }}
      />

      {/* Middle circle (wifi signal) */}
      <Box
        sx={{
          position: "absolute",
          top: "25px",
          left: "25px",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          border: "6px solid #e0e0e0",
          opacity: 0.8,
        }}
      />

      {/* Inner circle (wifi signal) */}
      <Box
        sx={{
          position: "absolute",
          top: "40px",
          left: "40px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "6px solid #d0d0d0",
          opacity: 0.9,
        }}
      />

      {/* Device icon */}
      <Box
        sx={{
          position: "absolute",
          top: "55px",
          left: "55px",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#666",
          animation: `${pulse} 2s infinite ease-in-out`,
        }}
      />

      {/* Red slash (no connection) */}
      <Box
        sx={{
          position: "absolute",
          top: "0",
          left: "50%",
          height: "120px",
          width: "6px",
          backgroundColor: "#ff5252",
          transform: "rotate(45deg)",
          transformOrigin: "center",
          animation: `${wiggle} 5s infinite ease-in-out`,
        }}
      />
    </Box>
  );
};

const NetworkDetector = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          p: 3,
          textAlign: "center",
        }}
      >
        <NetworkFailureIcon />
        <h2
          style={{
            marginBottom: "10px",
            fontFamily: "Montserrat, sans-serif",
            animation: `${fadeIn} 0.5s ease-out 0.2s both`,
            color: "#6b7b58",
          }}
        >
          You are offline
        </h2>
        <p
          style={{
            color: "#666",
            maxWidth: "300px",
            fontFamily: "Montserrat, sans-serif",
            animation: `${fadeIn} 0.5s ease-out 0.4s both`,
          }}
        >
          Please check your internet connection and try again.
        </p>
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#6b7b58",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            animation: `${fadeIn} 0.5s ease-out 0.6s both`,
          }}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </Box>
    );
  }

  return children;
};

export default NetworkDetector;
