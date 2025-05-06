import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box } from "@mui/system";

import CircularProgress from "@mui/material/CircularProgress";
const AllEmployees = () => {
  const [vendors, setVendors] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  // Define fetchVendors function and memoize it
  const fetchVendors = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.thedesigngrit.com/api/vendors/`
      );
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors", error);
    }
  }, []); // Remove vendor.brandId as a dependency

  // Fetch vendors when the component mounts or vendor changes
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]); // Include fetchVendors in dependency array

  // Pagination Logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = vendors.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(vendors.length / employeesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div style={{ padding: "70px" }}>
      <div className="dashboard-header-title">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <h2>All Employees</h2>
        </div>
        <p style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
          Home &gt; All Employees
        </p>
      </div>
      <div className="dashboard-date-vendor"></div>
      <section className="dashboard-lists-vendor">
        <div className="recent-orders-vendor">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                color: "#2d2d2d",
                textAlign: "left",
                marginBottom: "20px",
              }}
            >
              All Employees List
            </h2>
            <table>
              <thead style={{ backgroundColor: "#f2f2f2", color: "#2d2d2d" }}>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Employee Number</th>
                  <th>Phone Number</th>
                  <th>Tier</th>
                  <th>Brand</th>
                </tr>
              </thead>
              {vendors.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      <CircularProgress style={{ color: "#6b7b58" }} />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {currentEmployees.map((vendor) => (
                    <tr key={vendor._id}>
                      <td>{vendor.firstName}</td>
                      <td>{vendor.lastName}</td>
                      <td>{vendor.email}</td>
                      <td>{vendor.employeeNumber}</td>
                      <td>{vendor.phoneNumber}</td>
                      <td>{vendor.tier}</td>
                      <td>{vendor.brandId?.brandName}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            <div className="pagination" style={{ marginTop: "20px" }}>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    backgroundColor:
                      currentPage === index + 1 ? "#6a8452" : "#f2f2f2",
                    color: currentPage === index + 1 ? "white" : "black",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </Box>
        </div>
      </section>
    </div>
  );
};

export default AllEmployees;
