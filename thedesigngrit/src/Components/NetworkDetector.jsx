import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { keyframes } from "@emotion/react";

// Define animations for text elements
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const NetworkDetector = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsSearching(false);
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsSearching(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsSearching(true);
    // Simulate network check
    setTimeout(() => {
      if (navigator.onLine) {
        setIsOnline(true);
        setIsSearching(false);
        window.location.reload();
      } else {
        setIsSearching(false);
      }
    }, 3000);
  };

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
        {/* Video animation instead of CSS animation */}
        <Box
          sx={{
            width: "200px",
            height: "200px",
            margin: "0 auto 20px",
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          >
            <source src="/Assets/AnimationNetwork.webm" type="video/webm" />
            {/* Fallback for browsers that don't support WebM */}
            <source src="/Assets/AnimationNetwork.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>

        <h2
          style={{
            marginBottom: "10px",
            fontFamily: "Montserrat, sans-serif",
            animation: `${fadeIn} 0.5s ease-out 0.2s both`,
            color: "#6b7b58",
          }}
        >
          {isSearching ? "Searching for network..." : "You are offline"}
        </h2>
        <p
          style={{
            color: "#666",
            maxWidth: "300px",
            fontFamily: "Montserrat, sans-serif",
            animation: `${fadeIn} 0.5s ease-out 0.4s both`,
          }}
        >
          {isSearching
            ? "Attempting to reconnect..."
            : "Please check your internet connection and try again."}
        </p>
        {!isSearching && (
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
            onClick={handleRetry}
          >
            Retry
          </button>
        )}
      </Box>
    );
  }

  return children;
};

export default NetworkDetector;
