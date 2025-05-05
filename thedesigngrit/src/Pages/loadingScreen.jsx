import React, { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile (including iOS Safari)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsMobile(window.innerWidth <= 768 || isIOS);

    const timer = setTimeout(
      () => {
        setIsVisible(false);
        onComplete?.();
      },
      isMobile ? 5000 : 10000
    ); // Faster timeout on mobile

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    isVisible && (
      <div style={loadingScreenStyle}>
        {isMobile ? (
          // Mobile: Use JPEG (Safari-compatible) + WebP for others
          <picture>
            <source srcSet="/Assets/TDGLoadingScreen.webp" type="image/webp" />
            <img
              src="/Assets/TDGLoadingScreen.jpg"
              alt="Loading"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="eager"
            />
          </picture>
        ) : (
          // Desktop: MP4 (Safari) + WebM (Chrome/Firefox)
          <video
            autoPlay
            muted
            playsInline
            preload="auto"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src="/Assets/TDGLoadingScreen.mp4" type="video/mp4" />
            <source src="/Assets/TDGLoadingScreen.webm" type="video/webm" />
            <img src="/Assets/loading-static.jpg" alt="Loading" />{" "}
            {/* Fallback */}
          </video>
        )}
      </div>
    )
  );
};

const loadingScreenStyle = {
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
};

export default LoadingScreen;
