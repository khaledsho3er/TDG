import React, { useState, useEffect, lazy, Suspense, useRef } from "react";
import { Box, useMediaQuery } from "@mui/material";
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

// Video configuration
const VIDEO_DATA = [
  {
    id: 1,
    mp4: "/Assets/Video-hero/videohero.mp4",
    webm: "/Assets/Video-hero/videohero.webm",
    poster: "/Assets/Video-hero/poster.avif",
    mobileImage: "/Assets/Video-hero/videohero-mobile.avif",
  },
  {
    id: 2,
    mp4: "/Assets/Video-hero/videohero2.mp4",
    webm: "/Assets/Video-hero/videohero2.webm",
    poster: "/Assets/Video-hero/poster.avif",
    mobileImage: "/Assets/Video-hero/herovideo2-mobile.avif",
  },
  {
    id: 3,
    mp4: "/Assets/Video-hero/videohero3.mp4",
    webm: "/Assets/Video-hero/videohero3.webm",
    poster: "/Assets/Video-hero/poster.avif",
    mobileImage: "/Assets/Video-hero/videohero3-mobile.avif",
  },
];

function Home() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [shouldLoadContent, setShouldLoadContent] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  // Handle video progress and transitions
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isMobile) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      setCurrentVideoIndex((prev) => (prev + 1) % VIDEO_DATA.length);
      setProgress(0);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadeddata", () => setIsVideoLoaded(true));

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadeddata", () => setIsVideoLoaded(true));
    };
  }, [currentVideoIndex, isMobile]);

  // Load non-critical content after delay
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setShouldLoadContent(true);
      },
      isMobile ? 2500 : 1500
    );

    return () => clearTimeout(timer);
  }, [isMobile]);

  // Preload important assets
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Preload first video poster and mobile image
      const links = [
        {
          href: isMobile ? VIDEO_DATA[0].mobileImage : VIDEO_DATA[0].poster,
          as: "image",
        },
        { href: VIDEO_DATA[0].mp4, as: "video" },
      ];

      links.forEach((link) => {
        const el = document.createElement("link");
        el.rel = "preload";
        el.as = link.as;
        el.href = link.href;
        document.head.appendChild(el);
      });
    }
  }, [isMobile]);

  const handleDotClick = (index) => {
    setCurrentVideoIndex(index);
    setProgress(0);
    setIsVideoLoaded(false);
  };

  const HeroSection = () => {
    if (isMobile) {
      return (
        <picture className="hero-media">
          <source
            srcSet={`${VIDEO_DATA[currentVideoIndex].mobileImage}?width=800&format=avif`}
            type="image/avif"
          />
          <img
            src={`${VIDEO_DATA[currentVideoIndex].mobileImage}?width=800&format=jpg`}
            alt={`Hero banner ${currentVideoIndex + 1}`}
            width={800}
            height={450}
            loading="eager"
            decoding="async"
            fetchpriority="high"
            className="hero-image"
          />
        </picture>
      );
    }

    return (
      <div className="hero-video-container">
        <video
          ref={videoRef}
          key={VIDEO_DATA[currentVideoIndex].id}
          autoPlay
          muted
          playsInline
          preload="none"
          poster={`${VIDEO_DATA[currentVideoIndex].poster}?width=1600&format=avif`}
          className="hero-video"
          style={{ opacity: isVideoLoaded ? 1 : 0 }}
        >
          <source src={VIDEO_DATA[currentVideoIndex].mp4} type="video/mp4" />
          <source src={VIDEO_DATA[currentVideoIndex].webm} type="video/webm" />
        </video>

        {!isVideoLoaded && (
          <img
            src={`${VIDEO_DATA[currentVideoIndex].poster}?width=1600&format=jpg`}
            alt={`Video loading ${currentVideoIndex + 1}`}
            width={1600}
            height={900}
            loading="eager"
            decoding="async"
            className="hero-video-poster"
          />
        )}

        <div className="video-controls">
          {VIDEO_DATA.map((_, index) => (
            <button
              key={index}
              className={`video-dot ${
                currentVideoIndex === index ? "active" : ""
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Show video ${index + 1}`}
            >
              {currentVideoIndex === index && (
                <span
                  className="video-progress"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="home-page">
      {/* Critical CSS inlined */}
      <style jsx>{`
        .home-page {
          overflow-x: hidden;
        }
        .hero-media,
        .hero-video-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          max-height: 90vh;
          overflow: hidden;
        }
        .hero-image,
        .hero-video,
        .hero-video-poster {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.4s ease;
        }
        .hero-video-poster {
          z-index: 1;
        }
        .hero-video {
          z-index: 2;
        }
        .video-controls {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 10px;
          z-index: 3;
        }
        .video-dot {
          width: 40px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          padding: 0;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border-radius: 2px;
        }
        .video-dot.active {
          background: rgba(255, 255, 255, 0.5);
        }
        .video-progress {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: white;
          transition: width 0.1s linear;
        }
        .lazy-loader {
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <Header />

      <section className="hero-section" aria-label="Product showcase">
        <HeroSection />
      </section>

      {shouldLoadContent && (
        <Suspense
          fallback={<div className="lazy-loader">Loading content...</div>}
        >
          <ScrollAnimation>
            <Box className="concept-section">
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
