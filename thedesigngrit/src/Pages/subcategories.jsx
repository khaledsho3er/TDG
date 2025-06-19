import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Header from "../Components/navBar";
import PageDicription from "../Components/Topheader";
import LoadingScreen from "./loadingScreen";
import Footer from "../Components/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Subcategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.thedesigngrit.com/api/subcategories/categories/${categoryId}/subcategories`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        const data = await response.json();
        setSubCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.thedesigngrit.com/api/categories/categories"
        );
        const data = await response.json();
        setCategories(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const category = categories.find((cat) => cat._id === categoryId);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" color="error" textAlign="center">
            Error: {error}
          </Typography>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <PageDicription
        name={category?.name}
        description={category?.description}
      />

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {subCategories.length > 0 ? (
            subCategories.map((subCategory, index) => {
              const imageUrl = subCategory?.image
                ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${subCategory.image}`
                : `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/Assets/signin.jpeg`;
              const displayName = subCategory?.name || "Undefined";
              const displayDescription = subCategory?.description || "";

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={subCategory._id}
                  sx={{ display: "flex" }}
                >
                  <Box
                    component={motion.div}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 8px 24px 0 rgba(0,0,0,0.13)",
                      transition: { duration: 0.18 },
                    }}
                    S
                    // component={Link}
                    onClick={() => {
                      navigate(`/types/${subCategory._id}`);
                    }}
                    // to={`/types/${subCategory._id}`}
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "220px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      background: "#fff",
                      textDecoration: "none",
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
                        transition: "opacity 0.18s ease",
                        opacity: 0.7,
                      },
                      "&:hover::before": {
                        opacity: 0.9,
                      },
                    }}
                  >
                    <Box
                      component={motion.img}
                      whileHover={{
                        scale: 1.035,
                        transition: { duration: 0.18 },
                      }}
                      src={imageUrl}
                      alt={displayName}
                      loading="lazy"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.18s ease",
                      }}
                    />
                    <Box
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
                        variant="h6"
                        sx={{
                          color: "white",
                          fontFamily: "Horizon",
                          fontWeight: "bold",
                          marginBottom: "4px",
                          fontSize: "16px",
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
                            transition: "width 0.18s ease",
                          },
                          "&:hover::after": {
                            width: "100%",
                          },
                        }}
                      >
                        {displayName}
                      </Typography>
                      {/* {displayDescription && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255,255,255,0.8)",
                            fontFamily: "Montserrat",
                            fontSize: "12px",
                            maxWidth: "90%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {displayDescription}
                        </Typography>
                      )} */}
                      <Box
                        sx={{
                          height: "2px",
                          backgroundColor: "white",
                          marginTop: "auto",
                          transition: "width 0.18s ease",
                          alignSelf: "flex-start",
                          width: 0,
                          ...(subCategory?.name && {
                            "&:hover": { width: "100%" },
                          }),
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              );
            })
          ) : (
            <Box sx={{ textAlign: "center", py: 5, width: "100%" }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No subcategories found for this category.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please check back later or explore other categories.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Typography variant="button" color="primary">
                    Return to Home
                  </Typography>
                </Link>
              </Box>
            </Box>
          )}
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
}

export default Subcategories;
