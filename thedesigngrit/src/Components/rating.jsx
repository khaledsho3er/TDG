import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const InteractiveStarRating = ({ value = 0, onChange, size = 30 }) => {
  const [hoverRating, setHoverRating] = useState(0); // Track hover rating
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
            onClick={() => onChange && onChange(starIndex)} // Call onChange with new rating
            style={{
              color:
                starIndex <= (hoverRating || value) ? "#FFD700" : "#CCCCCC",
              fontSize: size,
              transition: "color 0.2s",
            }}
          />
        );
      })}
    </div>
  );
};

export default InteractiveStarRating;
