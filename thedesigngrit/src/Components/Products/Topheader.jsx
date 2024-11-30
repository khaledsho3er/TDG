import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";

function PageDicription() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const fullText = `
    The living room is often regarded  as the heart of the home, a space  that sets the tone for how we live, 
    entertain, and relax. It is a room  where style and comfort meet in  perfect harmony, and each piece of  furniture must carry both aesthetic  weight and functional value. 
    The  careful selection of sofas, chairs,  and accessories ensures that this  space serves as a retreat for  unwinding or a backdrop for  socializing, all while maintaining  an air of elegance and authority.
    Crafting the Perfect Ambiance:  When designing a living room,  each detail should be carefully  curated to reflect both the  individuality of the homeowner  and the timeless elegance that  transcends trends. 
    Begin with the  sofa—a commanding centerpiece  that dictates the flow of the room.  Opt for a modular design to offer  flexibility, or invest in a bold,  iconic piece that stands as a  testament to your refined taste. 
     Remember, the living room is not  just for lounging; it’s for making a  statement.   
  `;

  const truncatedText = `
     The living room is often regarded as the heart of the home, a space that sets
    the tone for how we live, entertain, and relax. It is a room where style and 
    comfort meet in perfect harmony, and each piece of furniture must carry both 
    aesthetic weight and functional value. The careful selection of sofas, chairs, 
    and accessories ensures that this space serves as a retreat for unwinding or 
    a backdrop for socializing, all while maintaining an air of elegance and authority....
  `;
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
        Living Room
      </Typography>
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "12px",
          color: "#EFEBE8",
          paddingLeft: 13,
          paddingRight: 20,
          display: "flex",
          lineHeight: "1.5", // Adjust line height for better spacing
        }}
      >
        <span>
          {isExpanded ? fullText : truncatedText}
          <strong
            style={{
              color: "#EFEBE8",
              cursor: "pointer",
              marginLeft: "5px",
              whiteSpace: "nowrap", // Prevent breaking to a new line
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

export default PageDicription;
