import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Components/navBar";
import LoadingScreen from "./loadingScreen";
import Footer from "../Components/Footer";

function TypesPage() {
  const { subCategoryId } = useParams();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://tdg-db.onrender.com/api/types/subcategories/${subCategoryId}/types`
        );
        setTypes(data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching types");
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, [subCategoryId]);

  if (loading) return <LoadingScreen />;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box sx={{ marginBottom: 0 }}>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 2,
          margin: "0 auto",
          maxWidth: 1200,
        }}
      >
        <Grid
          container
          spacing={3} // Added spacing for gaps
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ margin: "0 auto", width: "100%" }}
        >
          {types.length > 0 ? (
            types.map((type) => (
              <Grid
                item
                xs={4}
                sm={4}
                md={3} // Ensuring 4 per row
                key={type._id}
                component={Link}
                to={`/products/${type._id}/${type.name}`}
                sx={{
                  position: "relative",
                  textDecoration: "none",
                  borderRadius: "8px",
                  overflow: "hidden",
                  height: 300, // Increased height
                  backgroundImage: `url(https://tdg-db.onrender.com/uploads/${type.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "flex-end", // Align text to bottom
                  justifyContent: "flex-start", // Align text to left
                  padding: 2,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)", // Hover animation
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
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    position: "relative",
                    color: "white",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  {type.name}
                </Typography>
              </Grid>
            ))
          ) : (
            <Typography>No types found.</Typography>
          )}
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
}

export default TypesPage;
