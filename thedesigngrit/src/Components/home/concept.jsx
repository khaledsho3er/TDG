import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Link } from "react-router-dom"; // Assuming you're using React Router

const ExploreConcepts = () => {
  const [concepts, setConcepts] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the concept data from the backend
    const fetchConcepts = async () => {
      try {
        const response = await fetch(
          "https://tdg-db.onrender.com/api/concepts/concepts"
        );
        const data = await response.json();
        setConcepts(data.concepts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching concepts:", error);
        setLoading(false);
      }
    };
    fetchConcepts();
  }, []);

  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % concepts.length);
  };

  const handlePrev = () => {
    setCurrentCard((prev) => (prev - 1 + concepts.length) % concepts.length);
  };

  // Calculate left position for the progress fill
  const progressLeft = (currentCard / (concepts.length - 1)) * 100;

  const currentConcept = concepts[currentCard];

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
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          [
            currentCard,
            (currentCard + 1) % concepts.length,
            (currentCard + 2) % concepts.length,
          ].map((index, position) => {
            const concept = concepts[index];
            let className = "concept-card";
            if (position === 1) className += " middle-card"; // Middle card
            if (position === 0) className += " left-card"; // Left card
            if (position === 2) className += " right-card"; // Right card

            return (
              <Card key={concept.id} className={className}>
                <CardMedia
                  component="img"
                  image={`https://pub-8aa8289e571a4ef1a067e89c0e294837.r2.dev/${concept.imageUrl}`}
                  alt={concept.title}
                />

                <CardContent className="concept-card-content">
                  <IconButton className="concept-shopping-icon">
                    <ShoppingBagIcon />
                  </IconButton>
                  {concept.nodes &&
                    concept.nodes.map((node, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          position: "absolute",
                          left: `${node.x * 100}%`,
                          top: `${node.y * 100}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Tooltip
                          title={
                            <Box
                              sx={{
                                padding: 1,
                                backgroundColor: "#333",
                                color: "#fff",
                              }}
                            >
                              <Typography variant="body2">
                                {node.productName}
                              </Typography>
                              <Typography variant="body2">
                                ${node.productPrice}
                              </Typography>
                            </Box>
                          }
                          placement="top"
                        >
                          <Box
                            sx={{
                              backgroundColor: "#6c7c59",
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              cursor: "pointer",
                            }}
                          />
                        </Tooltip>
                      </Box>
                    ))}
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>

      {/* Subtitle */}
      <Box className="concept-subtitle">
        <Typography variant="h4" className="concept-subtitle-title">
          Like <br />
          something <br />
          you see?
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
          <Typography>{concepts.length}</Typography>
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
