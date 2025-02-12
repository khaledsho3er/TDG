import React, { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete(); // Callback to proceed after loading
      }
    }, 10000); // Ensuring a minimum 10s play time

    return () => clearTimeout(timer);
  }, []);

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
          onEnded={() => setIsVisible(false)}
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
