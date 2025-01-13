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
  const { categoryId, categoryName } = useParams(); // Get categoryId and categoryName from URL
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch products for the selected category when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/category/${categoryId}/${categoryName}/products`
        );
        const data = await response.json();
        setProducts(data); // Set the products of the selected category
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryId, categoryName]); // Re-fetch products if the categoryId changes

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

  return (
    <Box>
      <Header />
      <PageDicription />
      <h2>Products in {categoryName}</h2> {/* Display the category name */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TopFilter />
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box>
          <FilterSection />
        </Box>
        <Box>
          {/* Pass products and favorite toggle function to ProductCards */}
          <ProductCards products={products} onToggleFavorite={toggleFavorite} />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default ProductsPage;
