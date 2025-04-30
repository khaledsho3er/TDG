import React, { useState, useEffect, lazy, Suspense, useRef } from "react";
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

// Video configuration with all formats
const VIDEO_SOURCES = [
  {
    id: 1,
    mp4: "/Assets/Video-hero/herovideo.mp4",
    webm: "/Assets/Video-hero/herovideo.webm",
    poster: {
      avif: "/Assets/Video-hero/poster.avif",
      webp: "/Assets/Video-hero/poster.webp",
      jpg: "/Assets/Video-hero/poster.jpg",
    },
    mobile: {
      avif: "/Assets/Video-hero/herovideo-mobile.avif",
      webp: "/Assets/Video-hero/herovideo-mobile.webp",
      jpg: "/Assets/Video-hero/herovideo-mobile.jpg",
    },
  },
  {
    id: 2,
    mp4: "/Assets/Video-hero/herovideo2.mp4",
    webm: "/Assets/Video-hero/herovideo2.webm",
    poster: {
      avif: "/Assets/Video-hero/poster.avif",
      webp: "/Assets/Video-hero/poster.webp",
      jpg: "/Assets/Video-hero/poster.jpg",
    },
    mobile: {
      avif: "/Assets/Video-hero/herovideo2-mobile.avif",
      webp: "/Assets/Video-hero/herovideo2-mobile.webp",
      jpg: "/Assets/Video-hero/herovideo2-mobile.jpg",
    },
  },
  {
    id: 3,
    mp4: "/Assets/Video-hero/herovideo3.mp4",
    webm: "/Assets/Video-hero/herovideo3.webm",
    poster: {
      avif: "/Assets/Video-hero/poster.avif",
      webp: "/Assets/Video-hero/poster.webp",
      jpg: "/Assets/Video-hero/poster.jpg",
    },
    mobile: {
      avif: "/Assets/Video-hero/herovideo3-mobile.avif",
      webp: "/Assets/Video-hero/herovideo3-mobile.webp",
      jpg: "/Assets/Video-hero/herovideo3-mobile.jpg",
    },
  },
];

function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [deferLoad, setDeferLoad] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Delay non-critical content
  useEffect(() => {
    const timer = setTimeout(() => setDeferLoad(true), isMobile ? 3000 : 1500);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Video controls and progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isMobile) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % VIDEO_SOURCES.length);
      setProgress(0);
    };

    const handleReady = () => setVideoReady(true);

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadeddata", handleReady);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadeddata", handleReady);
    };
  }, [currentVideoIndex, isMobile]);

  const handleDotClick = (index) => {
    setCurrentVideoIndex(index);
    setProgress(0);
    setVideoReady(false);
  };

  const HeroMedia = () => {
    if (isMobile) {
      return (
        <picture className="hero-image">
          <source
            srcSet={VIDEO_SOURCES[currentVideoIndex].mobile.avif}
            type="image/avif"
          />
          <source
            srcSet={VIDEO_SOURCES[currentVideoIndex].mobile.webp}
            type="image/webp"
          />
          <img
            src={VIDEO_SOURCES[currentVideoIndex].mobile.jpg}
            alt={`Hero ${currentVideoIndex + 1}`}
            width={1600}
            height={900}
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </picture>
      );
    }

    return (
      <>
        <video
          ref={videoRef}
          key={`video-${VIDEO_SOURCES[currentVideoIndex].id}`}
          className="hero-video-element"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={VIDEO_SOURCES[currentVideoIndex].poster.avif}
          style={{ opacity: videoReady ? 1 : 0 }}
        >
          <source src={VIDEO_SOURCES[currentVideoIndex].mp4} type="video/mp4" />
          <source
            src={VIDEO_SOURCES[currentVideoIndex].webm}
            type="video/webm"
          />
        </video>
        {!videoReady && (
          <picture className="hero-video-poster">
            <source
              srcSet={VIDEO_SOURCES[currentVideoIndex].poster.avif}
              type="image/avif"
            />
            <source
              srcSet={VIDEO_SOURCES[currentVideoIndex].poster.webp}
              type="image/webp"
            />
            <img
              src={VIDEO_SOURCES[currentVideoIndex].poster.jpg}
              alt={`Video loading ${currentVideoIndex + 1}`}
              width={1600}
              height={900}
              loading="eager"
              decoding="async"
            />
          </picture>
        )}
      </>
    );
  };

  return (
    <div className="home">
      {/* Background blur layer */}
      <div className="background-layer"></div>

      <Header />

      {/* Hero Section */}
      <section className="hero-home-section">
        <div className="hero-video">
          <HeroMedia />
          {/* Video Navigation Dots */}
          {!isMobile && (
            <div className="slider-navigation">
              {VIDEO_SOURCES.map((_, index) => (
                <div
                  key={index}
                  className={`slider-dot ${
                    currentVideoIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
          )}
          <div className="video-progress-container">
            {VIDEO_SOURCES.map((_, index) => (
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
        </div>
      </section>

      {/* Lazy-loaded Content */}
      {deferLoad && (
        <Suspense fallback={<div style={{ minHeight: "100vh" }}></div>}>
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

      {/* CSS Styles */}
      <style jsx global>{`
        .home {
          display: block;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: auto;
          width: 100%;
          position: relative;
        }

        .background-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          filter: blur(20px);
          z-index: 1;
        }

        .hero-home-section {
          position: relative;
          width: 70%;
          height: auto;
          overflow: hidden;
          border-radius: 20px;
          margin-top: 1rem;
          z-index: 2;
          margin: auto;
        }

        .hero-video {
          position: relative;
          width: 100%;
          height: 70vh;
          overflow: hidden;
          backdrop-filter: blur(10px);
          border-radius: 20px;
          margin-bottom: 50px;
          margin-top: 30px;
        }

        .hero-video-element,
        .hero-video-poster img,
        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.5s ease;
        }

        .hero-video-poster,
        .hero-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .hero-text-overlay {
          position: absolute;
          top: 50%;
          left: 30%;
          transform: translate(-50%, -50%);
          color: #ffffff;
          text-align: left;
          z-index: 3;
        }

        .hero-text-overlay h1 {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 10px;
          color: #ffffff;
          text-align: left;
        }

        .hero-text-overlay p {
          font-size: 1.2rem;
          max-width: 600px;
          line-height: 1.5;
          font-family: Montserrat;
        }

        .btn-hero-section {
          border: 1px solid #6c7c59;
          background-color: #6c7c59;
          padding: 10px;
          border-radius: 10px;
          margin-top: 20px;
          cursor: pointer;
          color: white;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .btn-hero-section:hover {
          background-color: #5a6a48;
        }

        .slider-navigation {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 4;
        }

        .slider-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #fff;
          opacity: 0.5;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .slider-dot.active {
          opacity: 1;
          background-color: #6c7c59;
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .hero-home-section {
            width: 90%;
          }

          .hero-video {
            height: 50vh;
            margin-bottom: 30px;
            margin-top: 15px;
          }

          .hero-text-overlay {
            left: 50%;
            text-align: center;
            width: 90%;
          }

          .hero-text-overlay h1 {
            font-size: 2rem;
          }

          .hero-text-overlay p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
