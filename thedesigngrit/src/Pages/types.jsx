import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Components/navBar";
import LoadingScreen from "./loadingScreen";
import PageDescription from "../Components/Topheader";

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
          spacing={{ xs: 4, md: 6 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ margin: "0 auto", width: "100%" }}
        >
          {types.length > 0 ? (
            types.map((type) => (
              <Grid
                item
                size={{ xs: 2, sm: 4, md: 4 }}
                key={type._id}
                component={Link}
                to={`/products/${type._id}/${type.name}`}
                sx={{
                  position: "relative",
                  textDecoration: "none",
                  borderRadius: "8px",
                  overflow: "hidden",
                  height: 200,
                  gap: 5,
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
                    textAlign: "center",
                    fontSize: 24,
                    fontFamily: "horizon",
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
    </Box>
  );
}

export default TypesPage;
