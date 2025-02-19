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
  const [subCategory, setSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch SubCategory details
        const subCategoryRes = await axios.get(
          `https://tdg-db.onrender.com/api/subcategories/get/${subCategoryId}`
        );
        setSubCategory(subCategoryRes.data);

        // Fetch Types within this SubCategory
        const typesRes = await axios.get(
          `https://tdg-db.onrender.com/api/types/subcategories/${subCategoryId}/types`
        );
        setTypes(typesRes.data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subCategoryId]);

  if (loading) return <LoadingScreen />;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box>
      <Header />
      {/* Pass subCategory data to PageDescription */}
      <PageDescription
        name={subCategory?.name}
        description={subCategory?.description}
      />

      <Box sx={{ padding: 2 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {types.length > 0 ? (
            types.map((type) => (
              <Grid
                item
                xs={2}
                sm={4}
                md={4}
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
                    fontSize: 24,
                    fontFamily: "horizon",
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
