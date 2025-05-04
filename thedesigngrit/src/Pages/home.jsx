import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Box } from "@mui/material";
import Header from "../Components/navBar";
const ShopByCategory = React.lazy(() => import("../Components/home/Category"));
const ExploreConcepts = React.lazy(() => import("../Components/home/concept"));
const SustainabilitySection = React.lazy(() =>
  import("../Components/home/Sustainability")
);
const PartnersSection = React.lazy(() => import("../Components/home/partners"));
const ProductSlider = React.lazy(() => import("../Components/home/bestSeller"));
const Footer = React.lazy(() => import("../Components/Footer"));
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
  : "/Assets/Video-hero/poster.avif";

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
  const bgVideoRef = useRef(null);
  const fgVideoRef = useRef(null);
  const isMobile = useIsMobile();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Defer video rendering to reduce LCP impact
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => setShowVideo(true));
    } else {
      setTimeout(() => setShowVideo(true), 2000);
    }
  }, []);

  useEffect(() => {
    const video = fgVideoRef.current;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      if (videoDuration) {
        setProgress((video.currentTime / videoDuration) * 100);
      }
    };

    const handleEnded = () => {
      setIsFading(true);

      setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
        setProgress(0);
        setIsFading(false); // Reset after new video is set
      }, 800); // match CSS transition duration
    };

    if (video) {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleEnded);
    }

    return () => {
      if (video) {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleEnded);
      }
    };
  }, [videoDuration, currentVideoIndex]);

  const handleDotClick = (index) => {
    setCurrentVideoIndex(index);
    setProgress(0);
  };

  return (
    <div className="home">
      <div className="background-layer">
        {isMobile ? (
          <img
            src={posterImage}
            alt="Hero background"
            className="hero-video-element"
          />
        ) : (
          <video
            ref={bgVideoRef}
            className={`hero-video-element ${isFading ? "fade-out" : ""}`}
            poster={posterImage}
            autoPlay
            muted
            playsInline
            preload="none"
          >
            <source src={videos[currentVideoIndex].mp4} type="video/mp4" />
            <source src={videos[currentVideoIndex].webm} type="video/webm" />
          </video>
        )}
      </div>
      {/* Header and Sections */}
      <Header />
      {/* Hero Section */}
      <div className="hero-home-section">
        <div className="hero-video">
          {showVideo ? (
            isMobile ? (
              <img
                src={posterImage}
                alt="Hero poster"
                className="hero-video-element"
                loading="eager"
                fetchpriority="high"
              />
            ) : (
              <video
                ref={fgVideoRef}
                className={`hero-video-element ${isFading ? "fade-out" : ""}`}
                poster={posterImage}
                autoPlay
                muted
                playsInline
                preload="none"
              >
                <source src={videos[currentVideoIndex].mp4} type="video/mp4" />
                <source
                  src={videos[currentVideoIndex].webm}
                  type="video/webm"
                />
              </video>
            )
          ) : (
            <img
              src={posterImage}
              alt="Hero placeholder"
              className="hero-video-element"
            />
          )}
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
    </div>
  );
}

export default Home;
