import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Box } from "@mui/material";
import Header from "../Components/navBar";

const ShopByCategory = lazy(() => import("../Components/home/Category"));
const ExploreConcepts = lazy(() => import("../Components/home/concept"));
const SustainabilitySection = lazy(() =>
  import("../Components/home/Sustainability")
);
const PartnersSection = lazy(() => import("../Components/home/partners"));
const ProductSlider = lazy(() => import("../Components/home/bestSeller"));
const Footer = lazy(() => import("../Components/Footer"));
const ScrollAnimation = lazy(() => import("../Context/scrollingAnimation"));

const videos = [
  {
    webm: "/Assets/Video-hero/herovideo2.webm",
    mp4: "/Assets/Video-hero/herovideo2.mp4",
  },
  {
    webm: "/Assets/Video-hero/herovideo5.webm",
    mp4: "/Assets/Video-hero/herovideo5.mp4",
  },
  {
    webm: "/Assets/Video-hero/herovideo4.webm",
    mp4: "/Assets/Video-hero/herovideo4.mp4",
  },
];

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const posterImage = isSafari
  ? "/Assets/Video-hero/poster.jpg"
  : "/Assets/Video-hero/poster.webp";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

function Home() {
  const fgVideoRef = useRef(null);
  const isMobile = useIsMobile();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showSections, setShowSections] = useState(false);

  // Load video only after idle
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => setShowVideo(true));
    } else {
      setTimeout(() => setShowVideo(true), 1500);
    }

    // Defer rest of page
    setTimeout(() => setShowSections(true), 2000);
  }, []);

  // Video event listeners
  useEffect(() => {
    const video = fgVideoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
        setProgress(0);
        setIsFading(false);
      }, 800);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentVideoIndex]);

  const handleDotClick = (index) => {
    if (index !== currentVideoIndex) {
      setIsFading(true);
      setTimeout(() => {
        setCurrentVideoIndex(index);
        setProgress(0);
        setIsFading(false);
      }, 800);
    }
  };

  return (
    <div className="home">
      {/* Immediate LCP Image */}
      <div className="hero-home-section">
        <div className="hero-video">
          <img
            src={posterImage}
            alt="Hero poster"
            className="hero-video-element"
            width="100%"
            height="auto"
            style={{ aspectRatio: "16/9", width: "100%", height: "auto" }}
            fetchpriority="high"
            loading="eager"
          />
          {showVideo && !isMobile && (
            <video
              key={currentVideoIndex}
              ref={fgVideoRef}
              className={`hero-video-element ${isFading ? "fade-out" : ""}`}
              poster={posterImage}
              autoPlay
              muted
              playsInline
              preload="auto"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src={videos[currentVideoIndex].mp4} type="video/mp4" />
              <source src={videos[currentVideoIndex].webm} type="video/webm" />
            </video>
          )}
          {/* Progress Dots */}
          <div className="video-progress-container">
            {videos.map((_, index) => (
              <div
                key={index}
                className={`video-progress-dot ${
                  currentVideoIndex === index ? "active" : "circle"
                }`}
                onClick={() => handleDotClick(index)}
              >
                {currentVideoIndex === index && (
                  <div
                    className="video-progress-bar"
                    style={{ width: `${progress}%` }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <Header />

      {/* Below the fold content */}
      {showSections && (
        <Suspense fallback={null}>
          <ScrollAnimation>
            <Box className="concept-title">
              <ExploreConcepts />
            </Box>
          </ScrollAnimation>

          <ScrollAnimation>
            <ShopByCategory />
          </ScrollAnimation>

          <ScrollAnimation>
            <Box sx={{ width: "100%" }}>
              <ProductSlider />
            </Box>
          </ScrollAnimation>

          <ScrollAnimation>
            <SustainabilitySection />
          </ScrollAnimation>

          <ScrollAnimation>
            <PartnersSection />
          </ScrollAnimation>

          <Footer />
        </Suspense>
      )}
    </div>
  );
}

export default Home;
