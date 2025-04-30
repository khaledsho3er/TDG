import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
      navigate("/home"); // Navigate to /home after timeout
    }, 10000);

    return () => clearTimeout(timer);
  }, [onComplete, navigate]); // Added navigate as a dependency

  return (
    isVisible && (
      <div
        className="loading-screen"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999, // Ensure it's above everything
        }}
      >
        <video
          src="/Assets/TDGLoadingScreen.webm"
          autoPlay
          muted
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onEnded={() => {
            setIsVisible(false);
            navigate("/home"); // Navigate to /home after video ends
          }}
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
          }}
        />
      </div>
    )
  );
};

export default LoadingScreen;
