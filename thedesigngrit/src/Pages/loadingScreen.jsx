import React, { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsMobile(window.innerWidth <= 768 || isIOS);

    // Progress interval
    const interval = setInterval(
      () => {
        setProgress((prev) => {
          const next = prev + 1;
          if (next >= 100) {
            clearInterval(interval);
            setIsVisible(false);
            onComplete?.();
          }
          return next;
        });
      },
      isMobile ? 50 : 100
    );

    // On desktop, try to play video to ensure it's ready (Safari fix)
    if (!isMobile) {
      const video = document.querySelector("video");
      if (video) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay might be blocked, ignore error, keep showing loading screen until progress ends
          });
        }
      }
    }

    return () => clearInterval(interval);
  }, [isMobile, onComplete]);

  if (!isVisible) return null;

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
            loop
            controls={false}
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none", // Prevent interaction
              display: "block", // Avoid inline media player styling
            }}
          >
            <source src="/Assets/TDGLoadingScreen.mp4" type="video/mp4" />
            <source src="/Assets/TDGLoadingScreen.webm" type="video/webm" />
            <img src="/Assets/loading-static.jpg" alt="Loading" />
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
  backgroundColor: "white",
  backgroundImage: "url('/Assets/TDGLoadingScreen.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

export default LoadingScreen;
