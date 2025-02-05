import React, { useState, useEffect } from "react";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true); // Set loading to true initially

  useEffect(() => {
    // Simulate an async operation (e.g., API call or data fetching)
    setTimeout(() => {
      setLoading(false); // Set loading to false after 3 seconds (replace this with your actual loading condition)
    }, 3000);
  }, []);

  return (
    <div>
      <div className="loading-screen">
        <video
          src="/Assets/TDGLoadingScreen.mp4" // Add the correct path to your video file
          autoPlay
          loop
          muted
          style={{ width: "100%", height: "auto" }} // Adjust styles as needed
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default LoadingScreen;
