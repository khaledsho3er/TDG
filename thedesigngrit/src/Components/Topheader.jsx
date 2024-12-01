import React from "react";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function PageDescription() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState("");
  const location = useLocation();

  const descriptions = {
    "/": {
      title: "Living Room",
      fullText: `
        The living room is often regarded as the heart of the home, a space that sets the tone for how we live, 
        entertain, and relax. It is a room where style and comfort meet in perfect harmony, and each piece of furniture 
        must carry both aesthetic weight and functional value. The careful selection of sofas, chairs, and accessories 
        ensures that this space serves as a retreat for unwinding or a backdrop for socializing, all while maintaining 
        an air of elegance and authority. 
        Crafting the Perfect Ambiance: When designing a living room, each detail should be carefully curated to reflect 
        both the individuality of the homeowner and the timeless elegance that transcends trends. Begin with the sofa—a 
        commanding centerpiece that dictates the flow of the room. Opt for a modular design to offer flexibility, or 
        invest in a bold, iconic piece that stands as a testament to your refined taste. 
        Remember, the living room is not just for lounging; it’s for making a statement.
      `,
      truncatedText: `
        The living room is often regarded as the heart of the home, a space that sets
        the tone for how we live, entertain, and relax. It is a room where style and 
        comfort meet in perfect harmony, and each piece of furniture must carry both 
        aesthetic weight and functional value....
      `,
    },
    "/Vendors": {
      title: "All Vendors",
      fullText: `
        We’re dedicated to being your trusted destination for premium furniture. Partnering with hundreds of top-tier vendors and renowned brands, we offer a curated selection of stylish, quality pieces designed to meet every aesthetic and budget. Our user-friendly platform provides a seamless shopping experience, making it easy to find everything from classic designs to modern trends. Enjoy exceptional quality and reliability as you furnish your space with confidence.
      `,
      truncatedText: `
         We’re dedicated to being your trusted destination for premium furniture.....
      `,
    },
  };

  useEffect(() => {
    const path = location.pathname;
    setDescription(descriptions[path] || descriptions["/"]);
  }, [location]);

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
      <Typography
        sx={{
          fontFamily: "Horizon",
          fontSize: "30px",
          fontWeight: "Bold",
          color: "#EFEBE8",
          paddingLeft: 13,
        }}
      >
        {description.title}
      </Typography>
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
          {isExpanded ? description.fullText : description.truncatedText}
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
    </Box>
  );
}

export default PageDescription;
