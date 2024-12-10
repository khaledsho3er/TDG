import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const InteractiveStarRating = () => {
  const [hoverRating, setHoverRating] = useState(0); // Track hover rating
  const [savedRating, setSavedRating] = useState(0); // Track saved rating
  const maxStars = 5;
  return (
    <div style={{ display: "flex", gap: "10px", cursor: "pointer" }}>
      {[...Array(maxStars)].map((_, index) => {
        const starIndex = index + 1;

        return (
          <FaStar
            key={index}
            onMouseEnter={() => setHoverRating(starIndex)} // Set hover rating
            onMouseLeave={() => setHoverRating(0)} // Reset hover on mouse leave
            onClick={() => setSavedRating(starIndex)} // Save clicked rating
            style={{
              color:
                starIndex <= (hoverRating || savedRating)
                  ? "#FFD700"
                  : "#CCCCCC",
              fontSize: "30px",
              transition: "color 0.2s",
            }}
          />
        );
      })}
    </div>
  );
};

export default InteractiveStarRating;
