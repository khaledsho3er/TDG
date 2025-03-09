import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Components/navBar";
import LoadingScreen from "./loadingScreen";
import Footer from "../Components/Footer";
import PageDescription from "../Components/Topheader";

function TypesPage() {
  const { subCategoryId } = useParams();
  const [types, setTypes] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch the subcategory details
    const fetchSubcategory = async () => {
      try {
        const { data } = await axios.get(
          `https://tdg-db.onrender.com/api/subcategories/${subCategoryId}`
        );
        setSubcategory(data);
        console.log("Subcategory:", data);
      } catch (error) {
        console.error("Error fetching subcategory:", error);
      }
    };
    const fetchTypes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://tdg-db.onrender.com/api/types/subcategories/${subCategoryId}/types`
        );
        console.log("Fetched Types:", data); // Debugging
        setTypes(data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching types");
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
    fetchSubcategory();
  }, [subCategoryId]);

  if (loading) return <LoadingScreen />;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <PageDescription
        name={subcategory.name}
        description={subcategory.description}
      />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <Grid
          container
          spacing={3}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{
            margin: "0 auto",
            width: "100%",
            padding: "16px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "40px",
          }}
        >
          {types.length > 0 ? (
            types.map(
              (type) => (
                console.log(`Type: ${type.name}, Image: ${type.image}`),
                (
                  <Grid
                    item
                    xs={4}
                    sm={4}
                    md={3}
                    key={type._id}
                    component={Link}
                    to={`/products/${type._id}/${type.name}`}
                    sx={{
                      position: "relative",
                      textDecoration: "none",
                      borderRadius: "8px",
                      overflow: "hidden",
                      height: 300,
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
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(0.95)",
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
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
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
                )
              )
            )
          ) : (
            <Typography>No types found.</Typography>
          )}
        </Grid>
      </Box>
      <Footer sx={{ marginTop: "auto" }} />
    </Box>
  );
}

export default TypesPage;
