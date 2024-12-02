import React, { useEffect, useState } from "react";
import { Grid, Box, Pagination } from "@mui/material";
import VendorCard from "./Vendorcard";

const VendorsGrid = () => {
  const [vendors, setVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 9; // Adjust number of vendors per page if needed

  // Fetch vendors from the backend
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("/json/Vendors.json"); // Replace with your API endpoint
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  // Calculate vendors to display on the current page
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);

  const totalPages = Math.ceil(vendors.length / vendorsPerPage);

  // Handle page change and scroll to top
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <Box
      sx={{
        padding: { xs: "20px", sm: "30px", md: "5px 30px" }, // Responsive padding
        maxWidth: "1200px", // Limit max width
        margin: "0 auto", // Center content horizontally
        gap: 1,
      }}
    >
      {/* Grid Layout for Vendor Cards */}
      <Grid
        container
        spacing={{ xs: 2, sm: 10, md: 1 }} // Responsive spacing between items
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {currentVendors.map((vendor) => (
          <Grid item xs={12} sm={6} md={4} key={vendor.id}>
            {/* Render each vendor */}
            <VendorCard vendor={vendor} />
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
    </Box>
  );
};

export default VendorsGrid;
