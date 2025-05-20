import React, { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  // Check if critical resources are loaded
  useEffect(() => {
    // Create a list of critical resources to check
    const criticalResources = [
      "/Assets/TDG_Logo_Black.webp",
      "/Assets/Video-hero/poster.avif",
    ];

    // Check if resources are in cache or can be loaded
    const checkResources = async () => {
      try {
        // Try to load all resources in parallel
        await Promise.all(
          criticalResources.map(
            (url) =>
              new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
              })
          )
        );
        setResourcesLoaded(true);
      } catch (error) {
        console.error("Failed to load critical resources:", error);
        // Continue anyway after a timeout
        setTimeout(() => setResourcesLoaded(true), 3000);
      }
    };

    checkResources();
  }, [resourcesLoaded]);

  useEffect(() => {
    // Detect mobile (including iOS Safari)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsMobile(window.innerWidth <= 768 || isIOS);

    const timer = setTimeout(
      () => {
        setIsVisible(false);
        onComplete?.();
      },
      isMobile ? 5000 : 10000
    ); // Faster timeout on mobile
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVisible(false);
          onComplete?.();
          return 100;
        }
        return prev + 1;
      });
    }, 50); // Adjust speed here (lower = faster)
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete, isMobile]);

  return (
    isVisible && (
      <div style={loadingScreenStyle}>
        {isMobile ? (
          // Mobile: Use JPEG (Safari-compatible) + WebP for others

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            {/* Centered Image */}
            <picture>
              <source
                srcSet="/Assets/TDGLoadingScreen.webp"
                type="image/webp"
              />
              <img
                src="/Assets/TDGLoadingScreen.jpg"
                alt="Loading"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="eager"
              />
            </picture>

            {/* Circular Progress Indicator */}
            <div
              style={{
                width: "50px",
                height: "50px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
                gap: "25px",
              }}
            >
              {/* Background Circle (Gray) */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "8px solid rgba(108, 123, 69, 0.2)", // Semi-transparent
                  boxSizing: "border-box",
                }}
              />

              {/* Progress Circle (Green #6c7b45) */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "8px solid #6c7c59",
                  borderTopColor: "transparent",
                  borderRightColor: "transparent",
                  boxSizing: "border-box",
                  transform: `rotate(${progress * 3.6}deg)`, // 360ssdeg / 100%
                  transition: "transform 0.1s linear",
                }}
              />

              {/* Percentage Text (Optional) */}
              {/* <div
                style={{
                  position: "relative",
                  // position: "absolute",
                  // top: "50%",
                  // left: "50%",
                  // transform: "translate(-50%, -50%)",
                  color: "#6c7c59",
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginTop: "25px",
                }}
              >
                {progress}%
              </div> */}
            </div>
          </div>
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
