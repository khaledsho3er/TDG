import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Box } from "@mui/material";
import Header from "../Components/navBar";

// Prioritize critical components
const ShopByCategory = React.lazy(() => import("../Components/home/Category"));
const ProductSlider = React.lazy(() => import("../Components/home/bestSeller"));

// Defer less critical components
const ExploreConcepts = React.lazy(() => import("../Components/home/concept"));
const SustainabilitySection = React.lazy(() =>
  import("../Components/home/Sustainability")
);
const PartnersSection = React.lazy(() => import("../Components/home/partners"));
const Footer = React.lazy(() => import("../Components/Footer"));
const ScrollAnimation = lazy(() => import("../Context/scrollingAnimation"));

// Optimize video sources with proper formats and sizes
const videos = [
  {
    webm: "/Assets/Video-hero/herovideo2.webm",
    mp4: "/Assets/Video-hero/herovideo2.mp4",
    poster: "/Assets/Video-hero/poster.avif",
    mobilePoster: "/Assets/Video-hero/poster-mobile.avif",
  },
  {
    webm: "/Assets/Video-hero/herovideo5.webm",
    mp4: "/Assets/Video-hero/herovideo5.mp4",
    poster: "/Assets/Video-hero/poster.avif",
    mobilePoster: "/Assets/Video-hero/poster-mobile.avif",
  },
  {
    webm: "/Assets/Video-hero/herovideo4.webm",
    mp4: "/Assets/Video-hero/herovideo4.mp4",
    poster: "/Assets/Video-hero/poster.avif",
    mobilePoster: "/Assets/Video-hero/poster-mobile.avif",
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
  const bgVideoRef = useRef(null);
  const fgVideoRef = useRef(null);
  const isMobile = useIsMobile();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Preload the first video and poster
  useEffect(() => {
    if (!isMobile) {
      const preloadVideo = new Image();
      preloadVideo.src = videos[0].mp4;
      preloadVideo.onload = () => {
        setIsVideoLoaded(true);
        setShowVideo(true);
      };
    } else {
      setShowVideo(true);
    }
  }, [isMobile]);

  // Optimize video loading
  useEffect(() => {
    const video = fgVideoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
        setProgress(0);
        setIsFading(false);
      }, 800); // match fade duration
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentVideoIndex]); // ✅ dependency: change event bindings on index change

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
      <div className="background-layer">
        {isMobile ? (
          <img
            src={videos[currentVideoIndex].mobilePoster}
            alt="Hero background"
            className="hero-video-element"
            loading="eager"
            fetchpriority="high"
            width="100%"
            height="auto"
          />
        ) : (
          <video
            key={currentVideoIndex} // ✅ Force remount on video index change
            ref={bgVideoRef}
            className={`hero-video-element ${isFading ? "fade-out" : ""}`}
            poster={videos[currentVideoIndex].poster}
            autoPlay
            muted
            playsInline
            preload="auto"
            loading="eager"
            fetchpriority="high"
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
                src={videos[currentVideoIndex].mobilePoster}
                alt="Hero poster"
                className="hero-video-element"
                loading="eager"
                fetchpriority="high"
                width="100%"
                height="auto"
              />
            ) : (
              <video
                key={currentVideoIndex} // ✅ Force remount on video index change
                ref={fgVideoRef}
                className={`hero-video-element ${isFading ? "fade-out" : ""}`}
                poster={videos[currentVideoIndex].poster}
                autoPlay
                muted
                playsInline
                preload="auto"
                loading="eager"
                fetchpriority="high"
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
              src={videos[currentVideoIndex].poster}
              alt="Hero placeholder"
              className="hero-video-element"
              loading="eager"
              fetchpriority="high"
              width="100%"
              height="auto"
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

      <Suspense fallback={<div className="loading-placeholder" />}>
        <ScrollAnimation>
          <Box className="concept-title">
            <ExploreConcepts />
          </Box>
        </ScrollAnimation>
      </Suspense>

      <Suspense fallback={<div className="loading-placeholder" />}>
        <ScrollAnimation>
          <ShopByCategory />
        </ScrollAnimation>
      </Suspense>

      <Suspense fallback={<div className="loading-placeholder" />}>
        <ScrollAnimation>
          <Box sx={{ width: "100%" }}>
            <ProductSlider />
          </Box>
        </ScrollAnimation>
      </Suspense>

      <Suspense fallback={null}>
        <ScrollAnimation>
          <SustainabilitySection />
        </ScrollAnimation>
      </Suspense>

      <Suspense fallback={null}>
        <ScrollAnimation>
          <PartnersSection />
        </ScrollAnimation>
      </Suspense>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default Home;
