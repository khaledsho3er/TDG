import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const ExploreConcepts = () => {
  const cards = [
    { id: 1, title: "Bed Room", image: "/Assets/concept2.png" },
    { id: 2, title: "Living Room", image: "/Assets/concept1.png" },
    { id: 3, title: "Dining Room", image: "/Assets/concept3.png" },
    { id: 4, title: "Office Room", image: "/Assets/concept5.jpg" },
    { id: 5, title: "Kitchen", image: "/Assets/concept4.jpg" },
  ]; // Imagine this list comes from the backend

  const [currentCard, setCurrentCard] = useState(0); // Track the current card index

  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  // Calculate left position for the progress fill
  const progressLeft = (currentCard / (cards.length - 1)) * 100;

  return (
    <Box className="concept-explore-container">
      {/* Title */}
      <Box className="concept-title-container">
        <Typography variant="h4" className="concept-title">
          Explore Our Concepts
        </Typography>
      </Box>

      {/* Cards */}
      <Box className="concept-cards-container">
        {[
          currentCard,
          (currentCard + 1) % cards.length,
          (currentCard + 2) % cards.length,
        ].map((index, position) => {
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
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Subtitle */}
      <Box className="concept-subtitle">
        <Typography variant="h4" className="concept-subtitle-title">
          Like <br />
          something <br></br>you see?
        </Typography>
        <p className="concept-subtitle-text">Click on it.</p>
      </Box>

      {/* Progress */}
      <Box className="concept-controls">
        <Box className="concept-progress-container">
          <Typography>{currentCard + 1}</Typography>
          <Box className="concept-progress-bar">
            <Box
              className="concept-progress-fill"
              style={{ left: `${progressLeft}%` }}
            ></Box>
          </Box>
          <Typography>{cards.length}</Typography>
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
