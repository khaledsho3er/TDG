import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CardMedia, Grid } from "@mui/material";
import axios from "axios";
import CategoryForm from "./editcategories"; // Import the UpdateCategory component

const CategoryCard = ({ category, onClick }) => {
  const fullImagePath = `http://localhost:5000/uploads/${category.image}`; // Full image path for rendering
  return (
    <Card onClick={onClick} style={{ cursor: "pointer", margin: "10px" }}>
      <CardMedia
        component="img"
        height="140"
        image={fullImagePath}
        alt={category.name}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {category.name}
        </Typography>
      </CardContent>
    </Card>
  );
};

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // State to hold the selected category

  // Fetch categories on mount
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category); // Set the selected category
  };

  // If a category is selected, show UpdateCategory instead of the list
  if (selectedCategory) {
    console.log("selected category", selectedCategory._id);
    return (
      <CategoryForm
        categoryId={selectedCategory._id} // Pass the selected category ID
        onClose={() => setSelectedCategory(null)} // Function to go back to the category list
      />
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Montserrat" }}>
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category._id}>
            <CategoryCard
              category={category}
              onClick={() => handleCategoryClick(category)} // Pass the category to the click handler
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CategoryListPage;
