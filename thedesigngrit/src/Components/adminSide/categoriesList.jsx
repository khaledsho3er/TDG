import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid, CardMedia } from "@mui/material";
import UpdateCategory from "./editcategories";
import { CiCirclePlus } from "react-icons/ci";
import CategoryForm from "./createCategory";
const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [addCategory, setAddCategory] = useState(false);
  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://tdg-db.onrender.com/api/categories/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  if (addCategory === true) {
    return <CategoryForm />;
  }
  return (
    <>
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
                        ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${category.image}`
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
    </>
  );
};

export default CategoryListPage;
