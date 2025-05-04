import React, { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsVisible(false);
  //     if (onComplete) {
  //       onComplete();
  //       isLoading(false); // Call the onComplete function and set loading to false
  //     }
  //   }, 10000);

  //   return () => clearTimeout(timer);
  // }, [onComplete]); // Added onComplete as a dependency
  useEffect(() => {
    let interval = null;

    // Animate progress from 0 to 100 over 10 seconds
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 100); // 100ms * 100 = 10 seconds

    // Set timeout to finish loading after 10s
    const timer = setTimeout(() => {
      setIsVisible(false);
      setIsLoading(false);
      if (onComplete) onComplete();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);
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
        {/* <video
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
        /> */}
        <div
          className="spinner"
          style={{
            width: 60,
            height: 60,
            border: "6px solid rgba(255, 255, 255, 0.2)",
            borderTop: "6px solid white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: 20,
          }}
        />

        {/* Loading Percentage */}
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          {progress}%
        </div>

        {/* Animation keyframes */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  );
};

export default LoadingScreen;
