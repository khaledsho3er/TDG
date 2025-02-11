import React, { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete(); // Callback to proceed after loading
      }
    }, 10000); // Ensure it plays for at least 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    isVisible && (
      <div className="loading-screen">
        <video
          src="/Assets/TDGLoadingScreen.mp4"
          autoPlay
          muted
          onLoadedMetadata={(e) => {
            if (e.target.duration < 10) {
              setTimeout(() => setIsVisible(false), 10000);
            }
          }}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    )
  );
};

export default LoadingScreen;
