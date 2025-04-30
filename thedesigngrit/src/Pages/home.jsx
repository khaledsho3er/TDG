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
  "/Assets/Video-hero/herovideo.webm",
  "/Assets/Video-hero/herovideo2.webm",
  "/Assets/Video-hero/herovideo3.webm",
];

const posterImage = "/Assets/Video-hero/poster.avif"; // Preloaded in HTML head

function Home() {
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const [deferLoad, setDeferLoad] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => setDeferLoad(true));
    } else {
      setTimeout(() => setDeferLoad(true), 2000);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      if (videoDuration) {
        setProgress((video.currentTime / videoDuration) * 100);
      }
    };

    const handleEnded = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
      setProgress(0);
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
        <video
          ref={videoRef}
          className="hero-video-element"
          src={videos[currentVideoIndex]}
          autoPlay
          muted
          playsInline
        ></video>
      </div>
      {/* Header and Sections */}
      <Header />
      {/* Hero Section */}
      <div className="hero-home-section">
        <div className="hero-video">
          {showVideo ? (
            <video
              ref={videoRef}
              className="hero-video-element"
              src={videos[currentVideoIndex]}
              poster={posterImage}
              preload="metadata"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <picture>
              <source
                srcSet="/Assets/Video-hero/poster.avif"
                type="image/avif"
                media="(min-width: 600px)"
              />
              <source
                srcSet="/Assets/Video-hero/poster.webp"
                type="image/webp"
              />
              <img
                src="/Assets/Video-hero/poster.webp"
                width="1000"
                height="500"
                alt="Hero preview"
                loading="eager"
                decoding="async"
                fetchpriority="high"
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </picture>
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
      {deferLoad && (
        <Suspense fallback={<div className="lazy-loader" />}>
          {" "}
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
