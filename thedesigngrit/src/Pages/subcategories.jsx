import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import Header from "../Components/navBar";
import { Link, useParams } from "react-router-dom";
import PageDicription from "../Components/Topheader";

function Subcategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(
          `http://localhost:5000/api/subcategories/categories/${categoryId}/subcategories`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        const data = await response.json();
        setSubCategories(data);
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchSubCategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/categories/categories"
        );
        const data = await response.json();
        setCategories(data.slice(0, 6)); // Slice the first 6 categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const category = categories.find((cat) => cat._id === categoryId);

  if (loading) {
    return <Box>Loading...</Box>; // Show loading message
  }

  if (error) {
    return <Box>Error: {error}</Box>; // Show error message
  }

  return (
    <Box>
      <Header />
      {category && <PageDicription category={category} />}
      {subCategories.length > 0 ? (
        <Box>
          <Grid container spacing={2}>
            {subCategories.map((subCategory) => (
              <Grid item xs={12} sm={6} md={4} key={subCategory._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{subCategory.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {subCategory.description}
                    </Typography>
                    <Link
                      to={`/products/${subCategory._id}/${subCategory.name}`}
                    >
                      <Button variant="contained" color="primary" fullWidth>
                        Shop
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box>No subcategories found</Box>
      )}
    </Box>
  );
}

export default Subcategories;
