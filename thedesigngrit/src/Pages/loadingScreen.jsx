import React, { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true); // Start fade + scale
    }, 9500); // Slightly before 10s

    const hideTimer = setTimeout(() => {
      setIsVisible(false); // Fully hide after fade
      if (onComplete) {
        onComplete();
      }
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
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
        zIndex: 9999,
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
        className={isFadingOut ? "fade-and-scale" : ""}
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          transition: "transform 0.8s ease, opacity 0.8s ease", // smooth transitions
        }}
      />
    </div>
  );
};

export default LoadingScreen;
