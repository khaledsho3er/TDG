import React, { useState } from "react";
import { Box, Typography, Card, CardMedia, CardContent, IconButton } from "@mui/material";
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { FaArrowRight } from "react-icons/fa6";


const ExploreConcepts = () => {
  const cards = [
    { id: 1, title: "Bed Room", image: "Assets/concept2.png" },
    { id: 2, title: "Living Room", image: "Assets/concept1.png" },
    { id: 3, title: "Dining Room", image: "Assets/concept3.png" },
    { id: 4, title: "Office Room", image: "Assets/concept5.jpg" },
    { id: 5, title: "Kitchen", image: "Assets/concept4.jpg" },
  ]; // Imagine this list comes from the backend

  const [visibleIndexes, setVisibleIndexes] = useState([0, 1, 2]); // Indices of the visible cards

  const handleNext = () => {
    setVisibleIndexes((prevIndexes) => [
      (prevIndexes[0] + 1) % cards.length,
      (prevIndexes[1] + 1) % cards.length,
      (prevIndexes[2] + 1) % cards.length,
    ]);
  };

  const handlePrev = () => {
    setVisibleIndexes((prevIndexes) => [
      (prevIndexes[0] - 1 + cards.length) % cards.length,
      (prevIndexes[1] - 1 + cards.length) % cards.length,
      (prevIndexes[2] - 1 + cards.length) % cards.length,
    ]);
  };

  return (
    <Box className="concept-explore-container">
      {/* Title */}
      <Box className="concept-title-container">
        <Typography className="concept-title">Explore Our Concepts</Typography>
      </Box>

      {/* Cards */}
      <Box className="concept-cards-container">
        {visibleIndexes.map((index, position) => {
          const card = cards[index];
          let className = "concept-card";
          if (position === 1) className += " middle-card"; // Middle card
          if (position === 0) className += " left-card"; // Left card
          if (position === 2) className += " right-card"; // Right card

          return (
            <Card key={card.id} className={className}>
              <CardMedia component="img" image={card.image} alt={card.title} />
              
              <CardContent className="concept-card-content">
                <IconButton className="concept-shopping-icon">
                  <ShoppingBagIcon />
                </IconButton>
                
                <p className="concept-card-text">
                  {card.title}
                </p>
                {position === 1 && (
            <FaArrowRight color="#eae3e4" size="20px" />
        )}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Subtitle */}
      <Box className="concept-subtitle">
        <Typography variant="h4" className="concept-subtitle-title">
          Furniture and <br/> Accessories<br/> for a Modern <br/>Interior
        </Typography>
        <Typography variant="body1" className="concept-subtitle-text">
          Use our ideas to create <br/>an interior that suits you.
        </Typography>
      </Box>

      {/* Progress */}
      <Box className="concept-controls">
  <Box className="concept-progress-container">
    <Typography>02</Typography>
    <Box className="concept-progress-bar">
      <Box className="concept-progress-fill"></Box>
    </Box>
    <Typography>23</Typography>
  </Box>

  <Box className="concept-navigation">
    <IconButton onClick={handlePrev}>
      <BsArrowLeftCircle size={30} />
    </IconButton>
    <IconButton onClick={handleNext}>
      <BsArrowRightCircle size={30} />
    </IconButton>
  </Box>
</Box>

    </Box>
  );
};

export default ExploreConcepts;
