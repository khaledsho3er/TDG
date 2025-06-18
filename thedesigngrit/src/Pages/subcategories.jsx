import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import Header from "../Components/navBar";
import PageDicription from "../Components/Topheader";
import LoadingScreen from "./loadingScreen";
import Footer from "../Components/Footer";

function Subcategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
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

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {subCategories.length > 0 ? (
          <Box>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                textAlign: "center",
                mb: 4,
                fontWeight: 600,
                color: "#2d2d2d",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Explore {category?.name}
            </Typography>

            <Grid container spacing={3}>
              {subCategories.map((subCategory, index) => (
                <Grid item xs={12} sm={6} md={4} key={subCategory._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                      },
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="240"
                      image={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${subCategory.image}`}
                      alt={subCategory.name}
                      sx={{
                        objectFit: "cover",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 3,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            color: "#2d2d2d",
                            fontFamily: "Montserrat, sans-serif",
                            mb: 2,
                            lineHeight: 1.2,
                          }}
                        >
                          {subCategory.name}
                        </Typography>
                        {subCategory.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              fontFamily: "Montserrat, sans-serif",
                              lineHeight: 1.6,
                            }}
                          >
                            {subCategory.description}
                          </Typography>
                        )}
                      </Box>

                      <Button
                        component={Link}
                        to={`/types/${subCategory._id}`}
                        variant="outlined"
                        size="large"
                        sx={{
                          mt: 2,
                          borderColor: "#2d2d2d",
                          color: "#2d2d2d",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 500,
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          textTransform: "none",
                          fontSize: "1rem",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            backgroundColor: "#2d2d2d",
                            color: "#fff",
                            borderColor: "#2d2d2d",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(45,45,45,0.3)",
                          },
                        }}
                      >
                        Shop Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#666",
                fontFamily: "Montserrat, sans-serif",
                mb: 2,
              }}
            >
              No subcategories found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#999",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              We're working on adding more categories to this section.
            </Typography>
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
}

export default Subcategories;
