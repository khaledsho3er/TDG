import React, { useState } from "react";
import { Grid, Box, Pagination } from "@mui/material";
import ProductCard from "./productcard"; // Import the ProductCard component
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const ProductCards = ({ products = [], onToggleFavorite }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites] = useState([]); // The favorites array
  const productsPerPage = 12; // Limit to 12 products per page

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Calculate the products to display on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = safeProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(safeProducts.length / productsPerPage);

  // Handle page change and scroll to top
  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update current page when clicked
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <Box
      sx={{
        padding: { xs: "20px", sm: "30px", md: "30px 70px" },
        maxWidth: "1200px",
        margin: "0 auto",
        gap: "60px",
      }}
    >
      {/* If there are no products, display a message */}
      {safeProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <h2>No products found in this category.</h2>
        </Box>
      ) : (
        <>
          {/* Grid Layout for Product Cards */}
          <Grid
            container
            spacing={2}
            sx={{ display: "flex", justifyContent: "flex-start", gap: "80px" }}
          >
            {currentProducts.map((product) => {
              console.log(product._id); // Debugging: Check if product._id is available
              return (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  {/* Wrap each ProductCard in a Link to navigate to the product page */}
                  <Link
                    to={`/product/${product._id}`} // Use _id here for URL
                    style={{ textDecoration: "none" }}
                  >
                    <ProductCard
                      product={product}
                      onToggleFavorite={onToggleFavorite}
                      isFavorite={favorites.some(
                        (fav) => fav._id === product._id // Use _id for favorite check
                      )}
                    />
                  </Link>
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
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
        </>
      )}
    </Box>
  );
};

export default ProductCards;
