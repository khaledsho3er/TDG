import React, { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true); // Start fade-out first
    }, 9500); // Slightly earlier than full 10 seconds

    const hideTimer = setTimeout(() => {
      setIsVisible(false); // Then fully hide
      if (onComplete) {
        onComplete();
      }
    }, 10000); // 10 seconds to completely remove

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);
  if (!isVisible) return null;

  return (
    isVisible && (
      <div
        className={`loading-screen ${isFadingOut ? "fade-out" : ""}`}
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
          overflow: "hidden",
        }}
      >
        <video
          src="/Assets/TDGLoadingScreen.webm"
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
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
