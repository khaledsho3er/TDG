import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

function PageDescription({ name, description }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [truncatedText, setTruncatedText] = useState("");
  const [fullText, setFullText] = useState("");

  useEffect(() => {
    if (description) {
      setFullText(description);
      setTruncatedText(
        description.length > 200
          ? description.slice(0, 200) + "..."
          : description
      );
    }
  }, [description]);

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
      {/* Display Name (Category or Type) */}
      <Typography
        sx={{
          fontFamily: "Horizon",
          fontSize: "30px",
          fontWeight: "Bold",
          color: "#EFEBE8",
          paddingLeft: 13,
          "@media (max-width: 768px)": {
            fontSize: "24px",
            textAlign: "start",
            paddingLeft: "20px",
          },
        }}
      >
        {name || "Name Not Available"}
      </Typography>

      {/* Description */}
      {description ? (
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px",
            color: "#EFEBE8",
            paddingLeft: 13,
            paddingRight: 20,
            display: "flex",
            lineHeight: "1.5",
            "@media (max-width: 768px)": {
              paddingLeft: "20px",
              paddingRight: "20px",
            },
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
