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
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import useMediaQuery from "@mui/material/useMediaQuery";

const ExploreConcepts = () => {
  const [concepts, setConcepts] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const response = await fetch(
          "https://api.thedesigngrit.com/api/concepts/concepts"
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

  const progressLeft = (currentCard / (concepts.length - 1)) * 100;

  const visibleCards = isMobile
    ? [currentCard]
    : [
        currentCard,
        (currentCard + 1) % concepts.length,
        (currentCard + 2) % concepts.length,
      ];

  return (
    <Box className="concept-explore-container">
      <Box className="concept-title-container">
        <Typography variant="h4" className="concept-title">
          Explore Our Concepts
        </Typography>
      </Box>

      <Box className="concept-cards-container">
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          visibleCards.map((index, position) => {
            const concept = concepts[index];
            let className = "concept-card";
            if (isMobile) {
              className += " middle-card"; // only "middle-card" for mobile
            } else {
              if (position === 0) className += " left-card";
              if (position === 1) className += " middle-card";
              if (position === 2) className += " right-card";
            }

            return (
              <Card key={concept?._id} className={className}>
                <CardMedia
                  component="img"
                  image={
                    concept?.imageUrl
                      ? `https://pub-8aa8289e571a4ef1a067e89c0e294837.r2.dev/${concept.imageUrl}?width=400&height=300&format=webp`
                      : "/default-image.jpg"
                  }
                  alt={concept?.title || "Concept image"}
                  width="400"
                  height="300"
                  style={{ width: "100%" }}
                  loading={position === 1 ? "eager" : "lazy"}
                  fetchpriority={position === 1 ? "high" : "auto"}
                  decoding="async"
                />

                {concept?.nodes?.map((node, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      position: "absolute",
                      left: `${node.x * 100}%`,
                      top: `${node.y * 100}%`,
                      transform: "translate(-50%, -50%)",
                      zIndex: 10,
                      backgroundColor: "transparent",
                    }}
                    onClick={() => navigate(`/product/${node.productId._id}`)}
                  >
                    <Tooltip
                      slotProps={{
                        popper: {
                          sx: {
                            "& .MuiTooltip-tooltip": {
                              backgroundColor: "#fff",
                              color: "#2d2d2d",
                              borderRadius: "8px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                              padding: 0,
                            },
                            "& .MuiTooltip-arrow": {
                              color: "#fff",
                            },
                          },
                        },
                      }}
                      arrow
                      placement="top"
                      title={
                        <Box
                          sx={{
                            padding: 1,
                            backgroundColor: "#fff",
                            color: "#2d2d2d",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <img
                            src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${node.productId.mainImage}`}
                            alt={node.productId.name}
                            width="80"
                            height="80"
                            style={{ objectFit: "cover" }}
                          />
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {node.productId.name}
                            </Typography>
                            <Typography variant="body2">
                              E£{Number(node.productId.price).toLocaleString()}
                            </Typography>
                          </Box>
                          <MdOutlineArrowForwardIos />
                        </Box>
                      }
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          cursor: "pointer",
                          backgroundColor: "#6b7b58",
                          border: "3px solid #fff",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                          transition: "all 0.2s ease-in-out",
                          animation: "pulse 2s infinite",
                          "&:hover": {
                            transform: "scale(1.2)",
                          },
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

      <Box className="concept-subtitle">
        <Typography variant="h4" className="concept-subtitle-title">
          Like <br />
          something <br />
          you see?
        </Typography>
        <p className="concept-subtitle-text">Click on it.</p>
      </Box>

      <Box className="concept-controls">
        <Box className="concept-progress-container">
          <Typography>{currentCard + 1}</Typography>
          <Box className="concept-progress-bar">
            <Box
              className="concept-progress-fill"
              style={{ width: `${progressLeft}%` }}
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
