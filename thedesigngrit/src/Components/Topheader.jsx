import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

function PageDescription({ category }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [truncatedText, setTruncatedText] = useState("");
  const [fullText, setFullText] = useState("");

  // Truncate text for display purposes
  useEffect(() => {
    if (category?.description) {
      // Set the full text from the database description
      setFullText(category.description);

      // Truncate the text if it's too long
      const truncated =
        category.description.length > 200
          ? category.description.slice(0, 200) + "..."
          : category.description;
      setTruncatedText(truncated);
    }
  }, [category]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        background: "#6B7B58",
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      {/* Display the category name */}
      <Typography
        sx={{
          fontFamily: "Horizon",
          fontSize: "30px",
          fontWeight: "Bold",
          color: "#EFEBE8",
          paddingLeft: 13,
        }}
      >
        {category?.name || "Category Name Not Available"}
      </Typography>

      {/* Check if description exists and render it */}
      {category?.description ? (
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px",
            color: "#EFEBE8",
            paddingLeft: 13,
            paddingRight: 20,
            display: "flex",
            lineHeight: "1.5",
          }}
        >
          <span>
            {isExpanded ? fullText : truncatedText}
            <strong
              style={{
                color: "#EFEBE8",
                cursor: "pointer",
                marginLeft: "5px",
                whiteSpace: "nowrap",
              }}
              onClick={toggleExpand}
            >
              {isExpanded ? " less" : " more"}
            </strong>
          </span>
        </Typography>
      ) : (
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px",
            color: "#EFEBE8",
            paddingLeft: 13,
            paddingRight: 20,
          }}
        >
          No description available.
        </Typography>
      )}
    </Box>
  );
}

export default PageDescription;
