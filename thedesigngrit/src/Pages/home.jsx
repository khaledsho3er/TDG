import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Box } from "@mui/material";
import Header from "../Components/navBar";

// Lazy-loaded components
const ShopByCategory = lazy(() => import("../Components/home/Category"));
const ExploreConcepts = lazy(() => import("../Components/home/concept"));
const SustainabilitySection = lazy(() =>
  import("../Components/home/Sustainability")
);
const PartnersSection = lazy(() => import("../Components/home/partners"));
const ProductSlider = lazy(() => import("../Components/home/bestSeller"));
const Footer = lazy(() => import("../Components/Footer"));
const ScrollAnimation = lazy(() => import("../Context/scrollingAnimation"));

// Video sources - now with multiple formats and mobile variants
const videoSources = [
  {
    mp4: "/Assets/Video-hero/herovideo.mp4",
    webm: "/Assets/Video-hero/herovideo.webm",
    mobile: "/Assets/Video-hero/herovideo-mobile.avif", // Shorter, lower resolution version
  },
  {
    mp4: "/Assets/Video-hero/herovideo2.mp4",
    webm: "/Assets/Video-hero/herovideo2.webm",
    mobile: "/Assets/Video-hero/herovideo2-mobile.avif",
  },
  {
    mp4: "/Assets/Video-hero/herovideo3.mp4",
    webm: "/Assets/Video-hero/herovideo3.webm",
    mobile: "/Assets/Video-hero/herovideo3-mobile.avif",
  },
];

// Optimized poster images
const posterImages = {
  desktop: "/Assets/Video-hero/poster.avif",
  mobile: "/Assets/Video-hero/poster.avif", // Smaller, optimized version
  fallback: "/Assets/Video-hero/poster.jpg", // For browsers that don't support AVIF
};

function Home() {
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [deferLoad, setDeferLoad] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Detect mobile and handle resize
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      return isMobileView;
    };

    checkIfMobile();
    const resizeHandler = () => checkIfMobile();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // Delay loading of non-critical components
  useEffect(() => {
    const timer = setTimeout(() => setDeferLoad(true), isMobile ? 3000 : 2000);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
      setVideoLoaded(true);
    };

    const handleTimeUpdate = () => {
      if (videoDuration) {
        setProgress((video.currentTime / videoDuration) * 100);
      }
    };

    const handleEnded = () => {
      setCurrentVideoIndex(
        (prevIndex) => (prevIndex + 1) % videoSources.length
      );
      setProgress(0);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [videoDuration, currentVideoIndex, videoLoaded]);

  const handleDotClick = (index) => {
    setCurrentVideoIndex(index);
    setProgress(0);
  };

  const VideoPlayer = () => (
    <video
      ref={videoRef}
      className="hero-video-element"
      poster={isMobile ? posterImages.mobile : posterImages.desktop}
      preload={isMobile ? "none" : "metadata"}
      autoPlay
      muted
      playsInline
      disablePictureInPicture
      disableRemotePlayback
    >
      <source
        src={
          isMobile
            ? videoSources[currentVideoIndex].mobile
            : videoSources[currentVideoIndex].mp4
        }
        type="video/mp4"
      />
      <source src={videoSources[currentVideoIndex].webm} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );

  const HeroImageFallback = () => (
    <picture>
      <source
        srcSet={posterImages.mobile}
        media="(max-width: 767px)"
        type="image/avif"
      />
      <source
        srcSet={posterImages.desktop}
        media="(min-width: 768px)"
        type="image/avif"
      />
      <source srcSet={posterImages.fallback} type="image/jpeg" />
      <img
        src={posterImages.fallback}
        alt="Hero preview"
        width="1000"
        height="500"
        loading="eager"
        decoding="async"
        fetchpriority="high"
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
      />
    </picture>
  );

  return (
    <div className="home">
      <Header />

      {/* Hero Section */}
      <div className="hero-home-section">
        <div className="background-layer">
          <video
            ref={videoRef}
            className="hero-video-element"
            src={videoSources[currentVideoIndex]}
            autoPlay
            muted
            playsInline
          ></video>
        </div>
        <div className="hero-video">
          {isMobile ? (
            <HeroImageFallback />
          ) : (
            <>
              <VideoPlayer />
              <div className="video-progress-container">
                {videoSources.map((_, index) => (
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
                        style={{
                          width: `${progress}%`,
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lazy-loaded sections */}
      {deferLoad && (
        <Suspense fallback={<div className="lazy-loader" />}>
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
