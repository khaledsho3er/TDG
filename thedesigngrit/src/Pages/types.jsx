import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Components/navBar";
import LoadingScreen from "./loadingScreen";

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
    <Box>
      <Header />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Choose a Type
        </Typography>
        <Grid container spacing={2}>
          {types.length > 0 ? (
            types.map((type) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={type._id}
                component={Link}
                to={`/products/${type._id}/${type.name}`}
                sx={{
                  position: "relative",
                  textDecoration: "none",
                  borderRadius: "8px",
                  overflow: "hidden",
                  height: 200,
                  backgroundImage: `url(https://tdg-db.onrender.com/uploads/${type.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                    fontWeight: "bold",
                    textAlign: "center",
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
    </Box>
  );
}

export default TypesPage;
