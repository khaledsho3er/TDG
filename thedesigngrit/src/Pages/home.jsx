import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Box } from "@mui/material";
import Header from "../Components/navBar";
import OrderSentPopup from "../Components/successMsgs/orderSubmit";
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
  const heroSectionRef = useRef(null);
  const isMobile = useIsMobile();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showVideo] = useState(true);
  const [isHeroVisible, setIsHeroVisible] = useState(true); // 👈 track visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.3 } // 30% of hero must be visible to be "active"
    );
    const currentHeroRef = heroSectionRef.current;

    if (currentHeroRef) {
      observer.observe(currentHeroRef);
    }

    return () => {
      // Use the stored variable in cleanup
      if (currentHeroRef) {
        observer.unobserve(currentHeroRef);
      }
    };
  }, []);
  useEffect(() => {
    if (!isHeroVisible) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isHeroVisible]);
  // 👇 Handle playing/pausing video based on visibility
  useEffect(() => {
    const video = fgVideoRef.current;
    if (video) {
      video.load();
      if (isHeroVisible) {
        video.play().catch((err) => console.error("Autoplay failed:", err));
      } else {
        video.pause();
      }
    }
  }, [currentVideoIndex, isHeroVisible]);

  const handleTimeUpdate = () => {
    const video = fgVideoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleDotClick = (index) => {
    setCurrentVideoIndex(index);
    setProgress(0);
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

      <div className="hero-home-section" ref={heroSectionRef}>
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
                key={currentVideoIndex}
                ref={fgVideoRef}
                className="hero-video-element"
                poster={posterImages[currentVideoIndex]}
                autoPlay
                muted
                playsInline
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => {
                  setCurrentVideoIndex(
                    (prevIndex) => (prevIndex + 1) % videos.length
                  );
                }}
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
      <OrderSentPopup />
    </div>
  );
}

export default Home;
