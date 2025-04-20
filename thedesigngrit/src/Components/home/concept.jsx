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
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router
import { MdOutlineArrowForwardIos } from "react-icons/md";

const ExploreConcepts = () => {
  const [concepts, setConcepts] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize the navigate function
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
              <Card key={concept._id} className={className}>
                <CardMedia
                  component="img"
                  image={
                    concept.imageUrl
                      ? `https://pub-8aa8289e571a4ef1a067e89c0e294837.r2.dev/${concept.imageUrl}`
                      : "path/to/default-image.jpg" // Provide a default image if imageUrl is not available
                  }
                  alt={concept.title || "Concept image"} // Default alt text
                />
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
                      onClick={() =>
                        navigate(`/category/${node.productId.category._id}`)
                      }
                    >
                      <Tooltip
                        title={
                          <Box
                            sx={{
                              padding: 1,
                              backgroundColor: "#ffffff",
                              color: "#2d2d2d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexDirection: "row",
                              borderRadius: "8px",
                            }}
                          >
                            <Box>
                              {/* beside teh name of the prodct in the node */}
                              <img
                                src={`https://pub-8aa8289e571a4ef1a067e89c0e294837.r2.dev/${node.productId.mainImage}`}
                                alt="product"
                                style={{ width: "100px", height: "100px" }}
                              />
                              <Typography variant="body2">
                                {node.productId.name}
                              </Typography>
                              <Typography variant="body2">
                                E£{node.productId.price}
                              </Typography>
                              <Typography variant="body2">
                                {node.productId.category.name}
                              </Typography>
                            </Box>
                            <Box sx={{ ml: 1 }}>
                              <MdOutlineArrowForwardIos />
                            </Box>
                          </Box>
                        }
                        placement="top"
                      >
                        <Box
                          sx={{
                            backgroundColor: "#ffffff",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                        />
                      </Tooltip>
                    </Box>
                  ))}
                <CardContent className="concept-card-content">
                  <IconButton
                    className="concept-shopping-icon"
                    onClick={() =>
                      navigate(
                        `/category/${concept.nodes[0].productId.category}/subcategories`
                      )
                    }
                  >
                    <ShoppingBagIcon />
                  </IconButton>
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
