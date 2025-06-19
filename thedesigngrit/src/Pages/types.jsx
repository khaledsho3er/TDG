import React, { useState, useEffect, Suspense } from "react";
import {
  Box,
  Grid,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Components/navBar";
import LoadingScreen from "./loadingScreen";
import Footer from "../Components/Footer";
import PageDescription from "../Components/Topheader";
import { motion } from "framer-motion";

function TypesPage() {
  const { subCategoryId } = useParams();
  const [types, setTypes] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;

    // Function to fetch the subcategory details
    const fetchSubcategory = async () => {
      try {
        const { data } = await axios.get(
          `https://api.thedesigngrit.com/api/subcategories/${subCategoryId}`
        );
        if (isMounted) {
          setSubcategory(data);
        }
      } catch (error) {
        console.error("Error fetching subcategory:", error);
        if (isMounted) {
          setError(
            "Failed to load subcategory details. Please try again later."
          );
        }
      }
    };

    // Function to fetch types for the subcategory
    const fetchTypes = async () => {
      try {
        if (isMounted) {
          setLoading(true);
        }
        const { data } = await axios.get(
          `https://api.thedesigngrit.com/api/types/subcategories/${subCategoryId}/types`
        );

        // Filter types to only include those with status = true
        const activeTypes = data.filter((type) => type.status !== false);

        if (isMounted) {
          setTypes(activeTypes);
          setLoading(false);
          setInitialLoad(false);
        }
      } catch (error) {
        console.error("Error fetching types:", error);
        if (isMounted) {
          setError(
            error.response?.data?.message ||
              "Error fetching types. Please try again later."
          );
          setLoading(false);
          setInitialLoad(false);
        }
      }
    };

    // Only fetch if we have a valid subCategoryId
    if (subCategoryId) {
      // Use Promise.all to fetch both data in parallel
      Promise.all([fetchSubcategory(), fetchTypes()]).catch((error) => {
        console.error("Error in Promise.all:", error);
        if (isMounted) {
          setError(
            "An error occurred while loading the page. Please try again."
          );
          setLoading(false);
          setInitialLoad(false);
        }
      });
    } else {
      if (isMounted) {
        setError("Invalid subcategory ID");
        setLoading(false);
        setInitialLoad(false);
      }
    }

    // Cleanup function to prevent memory leaks and state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [subCategoryId]);

  // Render loading screen during initial load
  if (initialLoad) {
    return <LoadingScreen />;
  }

  // Render a basic structure with loading indicator for subsequent loads
  if (loading && !initialLoad) {
    return (
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <Container
          maxWidth="lg"
          sx={{
            py: 4,
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Container>
        <Footer />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography variant="button" color="primary">
                Return to Home
              </Typography>
            </Link>
          </Box>
        </Container>
        <Footer sx={{ marginTop: "auto" }} />
      </Box>
    );
  }

  // Handle case where subcategory is not found
  if (!subcategory) {
    return (
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
          <Alert severity="warning">
            Subcategory not found. It may have been removed or is unavailable.
          </Alert>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography variant="button" color="primary">
                Return to Home
              </Typography>
            </Link>
          </Box>
        </Container>
        <Footer sx={{ marginTop: "auto" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <PageDescription
        name={subcategory.name}
        description={subcategory.description}
      />

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        {/* Section Title and Description */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-start" },
            alignItems: "stretch",
          }}
        >
          {types.length > 0 ? (
            types.map((type) => {
              const typeName = type?.name
                ? encodeURIComponent(
                    type.name.toLowerCase().replace(/\s+/g, "-")
                  )
                : "undefined";
              const imageUrl = type?.image
                ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${type.image}`
                : `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/Assets/signin.jpeg`;
              const displayName = type?.name || "Undefined";
              const displayDescription = type?.description || "";

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={type._id}
                  sx={{ display: "flex" }}
                >
                  <Box
                    component={motion.div}
                    whileHover={{
                      y: -4,
                      boxShadow: "0 8px 24px 0 rgba(0,0,0,0.13)",
                      transition: { duration: 0.18 },
                    }}
                    onClick={() =>
                      navigate(`/products/${type._id}/${typeName}`)
                    }
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "220px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      background: "#fff",
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
                          ...(type?.name && {
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
                No types found for this subcategory.
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

// Create an error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          <Header />
          <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Something went wrong. Please try refreshing the page.
            </Alert>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Typography variant="button" color="primary">
                  Return to Home
                </Typography>
              </Link>
            </Box>
          </Container>
          <Footer sx={{ marginTop: "auto" }} />
        </Box>
      );
    }

    return this.props.children;
  }
}

// Wrap the TypesPage component with the ErrorBoundary
export default function TypesPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <TypesPage />
      </Suspense>
    </ErrorBoundary>
  );
}
