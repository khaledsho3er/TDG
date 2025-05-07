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
const posterImages = [
  isSafari ? "/Assets/Video-hero/poster.jpg" : "/Assets/Video-hero/poster.avif",
  isSafari
    ? "/Assets/Video-hero/poster5.jpg"
    : "/Assets/Video-hero/poster5.avif",
  isSafari
    ? "/Assets/Video-hero/poster4.jpg"
    : "/Assets/Video-hero/poster4.avif",
];

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
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    const nextVideo = document.createElement("video");
    nextVideo.src = videos[nextIndex].webm;
    nextVideo.preload = "auto";
    nextVideo.load();
    return () => nextVideo.remove();
  }, [currentVideoIndex]);

  const handleLoadedMetadata = () => {
    const video = fgVideoRef.current;
    if (video) {
      video.play();
    }
  };

  const handleTimeUpdate = () => {
    const video = fgVideoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleEnded = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
    setProgress(0);
  };
  const handleDotClick = (index) => {
    setCurrentVideoIndex(index);
    setProgress(0);

    // Reset and play the video after a short delay to allow state update
    setTimeout(() => {
      if (fgVideoRef.current) {
        fgVideoRef.current.currentTime = 0;
        fgVideoRef.current.play();
      }
    }, 50);
  };

  return (
    <div className="home">
      <div className="background-layer">
        <img
          src={posterImages[currentVideoIndex]}
          alt={`Hero background ${currentVideoIndex}`}
          className="hero-video-element"
        />
      </div>
      <Header />

      <div className="hero-home-section">
        <div className="hero-video">
          {showVideo ? (
            isMobile ? (
              <img
                src={posterImages[currentVideoIndex]}
                alt={`Hero background ${currentVideoIndex}`}
                className="hero-video-element"
              />
            ) : (
              <video
                ref={fgVideoRef}
                className="hero-video-element"
                autoPlay
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
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
              src={posterImages[currentVideoIndex]}
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
