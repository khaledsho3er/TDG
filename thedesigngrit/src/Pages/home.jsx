import React, { useRef, useState, useEffect } from "react";
import Header from "../Components/navBar";
import ShopByCategory from "../Components/home/Category";
import ExploreConcepts from "../Components/home/concept";
import SustainabilitySection from "../Components/home/Sustainability";
import { Box } from "@mui/material";
import PartnersSection from "../Components/home/partners";
import ProductSlider from "../Components/home/bestSeller";
import Footer from "../Components/Footer";
import LinearProgress from "@mui/material/LinearProgress";
import ScrollAnimation from "../Context/scrollingAnimation"; // Import the animation wrapper

function Home() {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  // Handle video metadata load (get video duration)
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    setVideoDuration(video.duration);
    console.log("Video Duration:", video.duration);
  };
  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (videoDuration) {
        const progressValue = (video.currentTime / videoDuration) * 100;
        setProgress(progressValue);
      }
    };

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [videoDuration]);

  return (
    <div className="home">
      <div className="background-layer">
        <video
          ref={videoRef}
          className="hero-video-element"
          src="/Assets/Video-hero/herovideo.mp4"
          autoPlay
          loop
          muted
          playsInline
        ></video>
      </div>
      <Header />

      <div className="hero-home-section">
        <div className="hero-video">
          <video
            ref={videoRef}
            className="hero-video-element"
            src="/Assets/Video-hero/herovideo.mp4"
            autoPlay
            loop
            muted
            playsInline
          ></video>
          <div className="progress-container-hero">
            <LinearProgress
              variant="determinate"
              value={progress}
              className="custom-progress-bar-hero"
            />
          </div>
        </div>
      </div>

      {/* Apply Scroll Animation to Sections */}
      <ScrollAnimation>
        <Box className="concept-title">
          <ExploreConcepts />
        </Box>
      </ScrollAnimation>

      <ScrollAnimation>
        <ShopByCategory />
      </ScrollAnimation>

      <ScrollAnimation>
        <ProductSlider />
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
