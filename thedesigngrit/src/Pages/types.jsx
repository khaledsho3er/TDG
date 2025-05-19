import React, { useState, useEffect } from "react";
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

function TypesPage() {
  const { subCategoryId } = useParams();
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch the subcategory details
    const fetchSubcategory = async () => {
      try {
        const { data } = await axios.get(
          `https://api.thedesigngrit.com/api/subcategories/${subCategoryId}`
        );
        setSubcategory(data);
      } catch (error) {
        console.error("Error fetching subcategory:", error);
        setError("Failed to load subcategory details. Please try again later.");
      }
    };

    // Function to fetch types for the subcategory
    const fetchTypes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://api.thedesigngrit.com/api/types/subcategories/${subCategoryId}/types`
        );

        // Filter types to only include those with status = true (if applicable)
        const activeTypes = data.filter((type) => type.status !== false);
        setTypes(activeTypes);
      } catch (error) {
        console.error("Error fetching types:", error);
        setError(
          error.response?.data?.message ||
            "Error fetching types. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (subCategoryId) {
      fetchTypes();
      fetchSubcategory();
    } else {
      setError("Invalid subcategory ID");
      setLoading(false);
    }

    return () => {
      // Cleanup function
      setTypes([]);
      setSubcategory(null);
    };
  }, [subCategoryId]);

  // Handle loading state
  if (loading) return <LoadingScreen />;

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
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {types.length > 0 ? (
            types.map((type) => (
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
                  component={Link}
                  to={`/products/${type._id}/${type.name}`}
                  sx={{
                    position: "relative",
                    textDecoration: "none",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: 300,
                    width: "100%",
                    backgroundImage: `url(${encodeURI(
                      `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${
                        type.image ? type.image : "Assets/signin.jpeg"
                      }`
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    padding: 2,
                    transition: "all 0.3s ease-in-out",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      position: "relative",
                      color: "white",
                      fontSize: { xs: 20, md: 24 },
                      fontWeight: "bold",
                      textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                    }}
                  >
                    {type.name}
                  </Typography>
                </Box>
              </Grid>
            ))
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

export default TypesPage;
