import React, { useState, useEffect } from "react";

const LoadingScreen = () => {
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
