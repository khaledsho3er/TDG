import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Pagination,
  CircularProgress,
  Typography,
} from "@mui/material";
import VendorCard from "./Vendorcard";
import { useNavigate } from "react-router-dom";

const VendorsGrid = ({ selectedCategory }) => {
  const [vendors, setVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const vendorsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://api.thedesigngrit.com/api/brand/"
        );
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Filter vendors based on selected category
  const filteredVendors = selectedCategory
    ? vendors.filter((vendor) => vendor.category === selectedCategory)
    : vendors;

  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = filteredVendors.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );

  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  const handleVendorClick = (vendorId) => {
    navigate(`/vendor/${vendorId}`);
  };

  return (
    <Box
      sx={{
        padding: { xs: "20px", sm: "30px", md: "5px 30px" },
        maxWidth: "1200px",
        margin: "0 auto",
        gap: 1,
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            width: "100%",
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{ color: "#2d2d2d", marginBottom: 2 }}
          />
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              color: "#666",
            }}
          >
            Loading vendors...
          </Typography>
        </Box>
      ) : filteredVendors.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              color: "#666",
            }}
          >
            No vendors found in this category
          </Typography>
        </Box>
      ) : (
        <>
          <Grid
            container
            spacing={{ xs: 2, sm: 10, md: 1 }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {currentVendors.map((vendor) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={vendor._id}>
                <VendorCard
                  vendor={vendor}
                  onClick={() => handleVendorClick(vendor._id)}
                />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: { xs: 2, sm: 4 },
                marginBottom: { xs: 1, sm: 2 },
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    backgroundColor: "grey",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    borderRadius: 2,
                  },
                  "& .Mui-selected": { backgroundColor: "grey", color: "#fff" },
                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "green",
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

export default VendorsGrid;
