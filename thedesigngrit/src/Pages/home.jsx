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

function Home() {
  // const [setCurrentSlide] = useState(0);

  // const slides = [
  //   {
  //     id: 1,
  //     imgSrc: "/Assets/homehero/Herohome1.png",
  //     title: "Effortless Discovery",
  //     text: "Explore Egypt’s top furniture and décor brands in one place. Browse, compare, and customize your selections—we’ll handle the rest.",
  //   },
  //   {
  //     id: 2,
  //     imgSrc: "/Assets/homehero/Herohome2.png",
  //     title: "Need to see it in person?",
  //     text: "Plan your visit effortlessly with our View in Store option. Prepare your payment andaddress for a seamless experience, then see it up close.",
  //   },
  //   {
  //     id: 3,
  //     imgSrc: "/Assets/homehero/Herohome3.png",
  //     title: "Design your Vision",
  //     text: "Use our moodboards to craft your aesthetic",
  //     text2: "Explore products in stunning detail with downloadable 3D files",
  //   },
  // ];

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  //   }, 10000); // Change slide every 5 seconds

  //   return () => clearInterval(interval); // Clean up the interval on unmount
  // }, [slides.length]);

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
      <div className="background-layer"></div>
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
          <div className="progress-container">
            <LinearProgress
              variant="determinate"
              value={progress}
              className="custom-progress-bar"
            />
          </div>
        </div>
      </div>
      <div className="concept-section">
        <Box className="concept-title">
          <ExploreConcepts />
        </Box>
      </div>

      {/*Category section*/}
      <Box>
        <ShopByCategory />
      </Box>

      {/*best seller products section*/}
      <Box>
        <ProductSlider />
      </Box>

      {/*Sustainability section*/}
      <Box>
        <SustainabilitySection />
      </Box>

      {/*Vendor section*/}
      <Box>
        <PartnersSection />
      </Box>

      {/*Footer*/}
      <Box>
        <Footer />
      </Box>
    </div>
  );
}

export default Home;
