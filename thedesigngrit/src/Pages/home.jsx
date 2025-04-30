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

const posterImage = "/Assets/Video-hero/poster.webp";

function Home() {
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [deferLoad, setDeferLoad] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        setAutoplay(true);
        setDeferLoad(true);
      });
    } else {
      setTimeout(() => {
        setAutoplay(true);
        setDeferLoad(true);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setVideoDuration(video.duration);

    const handleTimeUpdate = () => {
      if (videoDuration) {
        setProgress((video.currentTime / videoDuration) * 100);
      }
    };

    const handleEnded = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
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
  }, [videoDuration, currentVideoIndex]);

  const handleDotClick = (index) => {
    setCurrentVideoIndex(index);
    setProgress(0);
  };

  return (
    <div className="home">
      <div className="background-layer">
        {/* Always render video with poster image, defer autoplay */}
        <video
          ref={videoRef}
          className="hero-video-element"
          src={videos[currentVideoIndex]}
          poster={posterImage}
          preload="auto"
          autoPlay={autoplay}
          muted
          playsInline
        />
      </div>

      <Header />

      <div className="hero-home-section">
        <div className="hero-video">
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
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {deferLoad && (
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
