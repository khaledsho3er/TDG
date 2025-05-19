import React, { useState } from "react";
import { Grid, Box, Pagination } from "@mui/material";
import ProductCard from "./productcard";

const ProductCards = ({ products = [], onToggleFavorite }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites] = useState([]);
  const productsPerPage = 12; // Consistent 12 products per page

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
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Box
      sx={{
        margin: { xs: "auto", md: 0 },
        marginTop: { xs: "0", md: "70px" },
      }}
    >
      {safeProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <h2>No products found in this category.</h2>
        </Box>
      ) : (
        <>
          {/* Grid Layout with responsive columns */}
          <Grid
            container
            spacing={3}
            sx={{
              width: "100%",
              margin: "0",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              "@media (max-width: 1024px)": {
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
              },
              "@media (max-width: 768px)": {
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
                marginTop: "20px",
              },
              "@media (max-width: 480px)": {
                gridTemplateColumns: "repeat(1, 1fr)",
                gap: "16px",
                marginTop: "20px",
              },
            }}
          >
            {currentProducts.map((product) => (
              <Box key={product._id}>
                <ProductCard
                  product={product}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.some((fav) => fav._id === product._id)}
                />
              </Box>
            ))}
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
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    borderRadius: 2,
                  },
                  "& .Mui-selected": {
                    backgroundColor: "#6B7B58",
                    color: "#fff",
                  },
                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "#f5f5f5",
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
