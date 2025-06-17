import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const VendorCategoryCard = ({ id, name, description, image }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    const typeName = encodeURIComponent(
      name.toLowerCase().replace(/\s+/g, "-")
    );
    navigate(`/products/${id}/${typeName}`);
  };
  return (
    <Box
      component={motion.div}
      whileHover={{
        y: -5,
        transition: { duration: 0.3 },
      }}
      onClick={handleClick}
      sx={{
        position: "relative",
        width: "100%",
        height: "220px", // Reduced height for slider
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        cursor: "pointer",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0) 60%)",
          zIndex: 1,
          transition: "opacity 0.3s ease",
          opacity: 0.7,
        },
        "&:hover::before": {
          opacity: 0.9,
        },
      }}
    >
      <Box
        component={motion.img}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
        src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${image}`}
        alt={name}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.5s ease",
        }}
      />

      <Box
        component={motion.div}
        initial={{ opacity: 0.9, y: 0 }}
        whileHover={{
          opacity: 1,
          y: -3,
          transition: { duration: 0.3 },
        }}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="h6" // Smaller heading for compact cards
          component={motion.h6}
          initial={{ y: 0 }}
          whileHover={{ y: -2 }}
          sx={{
            color: "white",
            fontFamily: "Horizon",
            fontWeight: "bold",
            marginBottom: "4px",
            fontSize: "16px", // Smaller font size
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -5,
              left: 0,
              width: "30px",
              height: "2px",
              backgroundColor: "#6b7b58",
              transition: "width 0.3s ease",
            },
            "&:hover::after": {
              width: "100%",
            },
          }}
        >
          {name}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            component={motion.p}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontFamily: "Montserrat",
              fontSize: "12px", // Smaller font size
              maxWidth: "90%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </Typography>
        )}

        <Box
          component={motion.div}
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          sx={{
            height: "2px",
            backgroundColor: "white",
            marginTop: "auto",
            transition: "width 0.3s ease",
            alignSelf: "flex-start",
          }}
        />
      </Box>
    </Box>
  );
};

export default VendorCategoryCard;
