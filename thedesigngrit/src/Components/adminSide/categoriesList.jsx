import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Box,
  CircularProgress,
} from "@mui/material";
import UpdateCategory from "./editcategories";
import { CiCirclePlus } from "react-icons/ci";
import CategoryForm from "./createCategory";
const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addCategory, setAddCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://api.thedesigngrit.com/api/categories/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (addCategory === true) {
    return <CategoryForm onBack={() => setAddCategory(false)} />;
  }

  return (
    <>
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Categories</h2>
          <p>Home &gt; Categories</p>
        </div>
        <div className="dashboard-date-vendor">
          <button
            onClick={() => setAddCategory(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: "#2d2d2d",
              color: "white",
              padding: "15px 15px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <CiCirclePlus /> Add Category
          </button>
        </div>
      </header>
      <div>
        {selectedCategory ? (
          <UpdateCategory
            category={selectedCategory}
            onBack={() => setSelectedCategory(null)}
          />
        ) : isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              width: "100%",
            }}
          >
            <CircularProgress
              size={60}
              thickness={4}
              sx={{ color: "#6b7b58" }}
            />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {categories.length > 0 ? (
              categories.map((category) => (
                <Grid item key={category._id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                      },
                    }}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={
                        category.image
                          ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${category.image}`
                          : "https://via.placeholder.com/345x140?text=No+Image"
                      }
                      alt={category.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description &&
                        category.description.length > 100
                          ? `${category.description.substring(0, 100)}...`
                          : category.description || "No description available"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No categories found
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </div>
    </>
  );
};

export default CategoryListPage;
