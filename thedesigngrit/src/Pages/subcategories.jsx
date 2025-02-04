import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Header from "../Components/navBar";
import { Link, useParams } from "react-router-dom";
import PageDicription from "../Components/Topheader";


function Subcategories() {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/subcategories/categories/${categoryId}/subcategories`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subcategories");
        }
        const data = await response.json();
        setSubCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
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
        setCategories(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const category = categories.find((cat) => cat._id === categoryId);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  return (
    <Box>
      <Header />
      {category && <PageDicription category={category} />}
      {subCategories.length > 0 ? (
        <Box className="subcategory-container">

  {subCategories.map((subCategory, index) => (
    <Box key={subCategory._id} className={`subcategory-box ${index % 2 !== 0 ? "reverse" : ""}`}>
      <img
        src={`http://localhost:5000/uploads/${subCategory.image}`}
        alt={subCategory.name}
        className="subcategory-image"
      />
      <Box className="subcategory-content">
        <Typography variant="h3" className="subcategory-title">{subCategory.name}</Typography>
        <Typography variant="h2" className="subcategory-description">
          {subCategory.description}
        </Typography>
        <Link
          to={`/products/${subCategory._id}/${subCategory.name}`}
          className="subcategory-button"
        >
          Shop Now
        </Link>
      </Box>
    </Box>
  ))}
</Box>
      ) : (
        <Box>No subcategories found</Box>
      )}
    </Box>
  );
}

export default Subcategories;
