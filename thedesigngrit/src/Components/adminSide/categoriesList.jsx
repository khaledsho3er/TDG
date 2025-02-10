import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Grid,
  CardMedia,
  Button,
} from "@mui/material";
import UpdateCategory from "./editcategories";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      {selectedCategory ? (
        <UpdateCategory
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      ) : (
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item key={category._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  maxWidth: 345,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedCategory(category)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    category.image
                      ? `http://localhost:5000/uploads/${category.image}`
                      : ""
                  }
                  alt={category.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default CategoryListPage;
