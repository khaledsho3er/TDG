import React from "react";
import { Box } from "@mui/material";
import { BiShieldQuarter } from "react-icons/bi";
import { GiMedal } from "react-icons/gi";
import { SiMinds } from "react-icons/si";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoFingerPrint } from "react-icons/io5";
import { ImHammer2 } from "react-icons/im";

const ValuesGrid = () => {
  const values = [
    {
      title: "INTEGRITY",
      description: "Trust and transparency are at the heart of everything we do.",
      icon: <BiShieldQuarter />, // Replace with actual SVG or font icons
    },
    {
      title: "EMPOWERMENT",
      description: "We uplift brands and employees alike, creating opportunities for growth.",
      icon: <GiMedal />,
    },
    {
      title: "BOLD  INNOVATION",
      description: "We challenge conventions, blending tradition with cutting-edge ideas.",
      icon: <SiMinds />,
    },
    {
      title: "COMMUNITY",
      description: "Collaboration fuels our success, both within and beyond our team.",
      icon: <FaPeopleGroup />,
    },
    {
      title: "GRIT",
      description: "We thrive on determination and hard work.",
      icon: <ImHammer2 />,
    },
    {
      title: "LEGACY OWNERSHIP",
      description: "We’re shaping the future while honoring the past.",
      icon: <IoFingerPrint />,
    },
  ];

  return (
    <div className="values-grid">
      {values.map((value, index) => (
        <div key={index} className="value-card">
          
          <Box className="value-card-content">
          <h3 className="value-card-title">{value.title}</h3>
          <p className="value-card-description">{value.description}</p>
          </Box>
          <div className="value-card-icon">{value.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default ValuesGrid;
