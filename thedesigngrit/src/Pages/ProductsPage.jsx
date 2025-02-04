import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the category details from URL
import { Box } from "@mui/material";
import Header from "../Components/navBar";
import PageDicription from "../Components/Topheader";
import ProductCards from "../Components/Products/Productsgrid";
import FilterSection from "../Components/Products/filters";
import TopFilter from "../Components/Products/TopFilters";
import Footer from "../Components/Footer";

function ProductsPage() {
  const { subcategoryId, subcategoryName } = useParams(); // Get categoryId and categoryName from URL
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState("Newest");

  // Fetch categories to find the matching category for description
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

  // Find the category by ID
  // const category = categories.find((cat) => cat._id === categoryId);

  // Fetch products for the selected category when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/subcategory/${subcategoryId}/${subcategoryName}`
        );
        const data = await response.json();
        setProducts(data); // Set the products of the selected category
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [subcategoryId, subcategoryName]); // Include categoryName in the dependency array

  // Fetch favorites from localStorage (if any)
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Toggle favorite status
  const toggleFavorite = (product) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.id === product.id)) {
      // If product is already in favorites, remove it
      updatedFavorites = favorites.filter((fav) => fav.id !== product.id);
    } else {
      // Otherwise, add it to favorites
      updatedFavorites = [...favorites, product];
    }

    // Update the state and store the updated list in localStorage
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };
  useEffect(() => {
    let sortedProducts = [...products];
    switch (sortOption) {
      case "Newest":
        sortedProducts.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
        break;
      case "Price: Low to High":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "Alphabetical: A-Z":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Alphabetical: Z-A":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    setProducts(sortedProducts);
  }, [sortOption, products]);
  return (
    <Box>
      <Header />
      {/* {category && <PageDicription category={category} />} */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TopFilter sortOption={sortOption} setSortOption={setSortOption} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <FilterSection />
        </Box>
        <Box >
          {/* Pass products and favorite toggle function to ProductCards */}
          <ProductCards products={products} onToggleFavorite={toggleFavorite} />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default ProductsPage;
