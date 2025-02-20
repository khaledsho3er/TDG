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
    <Box className="types-page">
      <Header />
      <Box className="types-container">
        <Grid
          container
          spacing={3}
          columns={{ xs: 4, sm: 8, md: 12 }}
          className="types-grid"
        >
          {types.length > 0 ? (
            types.map((type) => (
              <Grid
                item
                xs={4}
                sm={4}
                md={3}
                key={type._id}
                component={Link}
                to={`/products/${type._id}/${type.name}`}
                className="type-item"
                style={{
                  backgroundImage: `url(https://tdg-db.onrender.com/uploads/${type.image})`,
                }}
              >
                <Box className="type-overlay" />
                <Typography variant="h6" className="type-name">
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
