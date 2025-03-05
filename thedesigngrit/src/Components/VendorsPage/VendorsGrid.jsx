import React, { useEffect, useState } from "react";
import { Grid, Box, Pagination } from "@mui/material";
import VendorCard from "./Vendorcard";
import { useNavigate } from "react-router-dom";

const VendorsGrid = ({ selectedCategory }) => {
  const [vendors, setVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("https://tdg-db.onrender.com/api/brand/");
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
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
              "& .MuiPaginationItem-root:hover": { backgroundColor: "green" },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default VendorsGrid;
