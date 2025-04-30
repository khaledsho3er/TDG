import React, { useRef, useState, useEffect, Suspense, lazy } from "react";
import Header from "../Components/navBar";
import Footer from "../Components/Footer";
import { Box } from "@mui/material";

const ShopByCategory = lazy(() => import("../Components/home/Category"));
const ExploreConcepts = lazy(() => import("../Components/home/concept"));
const SustainabilitySection = lazy(() => import("../Components/home/Sustainability"));
const PartnersSection = lazy(() => import("../Components/home/partners"));
const ProductSlider = lazy(() => import("../Components/home/bestSeller"));
const ScrollAnimation = lazy(() => import("../Context/scrollingAnimation"));

// Preloaded poster image path
const posterImage = "/Assets/Video-hero/poster.webp";

// Your WebM videos (make sure they are compressed properly)
const videos = [
  "/Assets/Video-hero/herovideo.webm",
  "/Assets/Video-hero/herovideo2.webm",
  "/Assets/Video-hero/herovideo3.webm",
];

function Home() {
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

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
      <Header />

      <div className="hero-home-section">
        <div className="hero-video">
          <video
            ref={videoRef}
            className="hero-video-element"
            src={videos[currentVideoIndex]}
            poster={posterImage}
            preload="metadata"
            autoPlay
            muted
            playsInline
          ></video>

          {/* Progress Dots & Circles */}
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

      {/* Lazy-loaded sections */}
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>

      <Footer />
    </div>
  );
}

export default Home;
