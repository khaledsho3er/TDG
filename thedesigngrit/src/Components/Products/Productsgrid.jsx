import React, { useState } from "react";
import { Grid, Box, Pagination } from "@mui/material";
import ProductCard from "./productcard";

const ProductCards = ({ products = [], onToggleFavorite }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites] = useState([]);
  const productsPerPage = 12;

  const safeProducts = Array.isArray(products) ? products : [];
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = safeProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(safeProducts.length / productsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Box sx={{ width: "100%", padding: { xs: 2, md: 3 } }}>
      {safeProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
          <h2>No products found in this category.</h2>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {currentProducts.map((product) => (
              <Grid
                item
                key={product._id}
                xs={6} // 2 per row on small screens
                sm={6} // 2 per row on tablets
                md={4} // 3 per row on medium screens
                lg={4} // 4 per row on large screens
              >
                <ProductCard
                  product={product}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.some((fav) => fav._id === product._id)}
                />
              </Grid>
            ))}
          </Grid>

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
