import React, { useRef, useState, useEffect } from "react";
import Header from "../Components/navBar";
import ShopByCategory from "../Components/home/Category";
import ExploreConcepts from "../Components/home/concept";
import SustainabilitySection from "../Components/home/Sustainability";
import { Box } from "@mui/material";
import PartnersSection from "../Components/home/partners";
import ProductSlider from "../Components/home/bestSeller";
import Footer from "../Components/Footer";
import ScrollAnimation from "../Context/scrollingAnimation";

// Hero video files
const videos = [
  "/Assets/Video-hero/herovideo.webm",
  "/Assets/Video-hero/herovideo2.webm",
  "/Assets/Video-hero/herovideo3.webm",
];

// Mobile detection hook
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
  const isMobile = useIsMobile();

  const bgVideoRef = useRef(null);
  const fgVideoRef = useRef(null);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    if (!isMobile && fgVideoRef.current) {
      const video = fgVideoRef.current;

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
    }
  }, [videoDuration, currentVideoIndex, isMobile]);

  const handleDotClick = (index) => {
    setCurrentVideoIndex(index);
    setProgress(0);
  };

  return (
    <div className="home">
      {/* Background layer */}
      <div className="background-layer">
        {isMobile ? (
          <img
            src="/Assets/Video-hero/poster.avif"
            alt="Hero background"
            className="hero-video-element"
          />
        ) : (
          <video
            ref={bgVideoRef}
            className="hero-video-element"
            src={videos[currentVideoIndex]}
            autoPlay
            muted
            playsInline
            preload="none"
            poster="/Assets/Video-hero/poster.avif"
          />
        )}
      </div>

      <Header />

      {/* Foreground video + controls */}
      <div className="hero-home-section">
        <div className="hero-video">
          {isMobile ? (
            <img
              src="/Assets/Video-hero/poster.avif"
              alt="Hero foreground"
              className="hero-video-element"
            />
          ) : (
            <video
              ref={fgVideoRef}
              className="hero-video-element"
              src={videos[currentVideoIndex]}
              autoPlay
              muted
              playsInline
              preload="none"
              poster="/Assets/Video-hero/poster.avif"
            />
          )}

          {!isMobile && (
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
          )}
        </div>
      </div>

      {/* Content Sections */}
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
    </div>
  );
}

export default Home;
