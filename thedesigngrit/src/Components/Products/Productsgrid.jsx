import React, { useEffect, useState } from "react";
import { Grid, Box, Pagination } from "@mui/material";
import ProductCard from "./productcard";

const ProductCards = () => {
  const [products] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const productsPerPage = 12; // Limit to 12 products per page

  // Fetch products from the backendcd
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch("/json/productData.json"); // Replace with your API endpoint
  //       const data = await response.json();
  //       setProducts(data);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  // Fetch favorites from localStorage when the component mounts
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Calculate the products to display on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  // Handle page change and scroll to top
  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update current page when clicked
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  // Toggle favorite status for a product
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
    <Box
      sx={{
        padding: { xs: "20px", sm: "30px", md: "50px 70px" }, // Responsive padding
        maxWidth: "1200px", // Limit max width of the container
        margin: "0 auto", // Center content horizontally
        gap: 1,
      }}
    >
      {/* Grid Layout for Product Cards */}
      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 1 }} // Responsive spacing between items
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {currentProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            {/* Pass the toggleFavorite function to each ProductCard */}
            <ProductCard
              product={product}
              onToggleFavorite={toggleFavorite}
              isFavorite={favorites.some((fav) => fav.id === product.id)} // Check if the product is a favorite
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: { xs: 2, sm: 4 }, // Responsive margin-top
            marginBottom: { xs: 1, sm: 2 }, // Responsive margin-bottom
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary" // Keep the same color for all pages
            sx={{
              display: "flex",
              justifyContent: "center",
              "& .MuiPaginationItem-root": {
                backgroundColor: "#fff", // Ensure pagination buttons are styled the same
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Add subtle shadow for uniformity
                borderRadius: 2, // Round corners of pagination buttons
              },
              "& .Mui-selected": {
                backgroundColor: "#6B7B58", // Active page background color
                color: "#fff", // Change text color for selected page
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#f5f5f5", // Light hover effect for better visibility
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProductCards;
