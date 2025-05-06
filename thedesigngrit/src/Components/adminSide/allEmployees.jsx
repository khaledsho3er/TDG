import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box } from "@mui/system";

import CircularProgress from "@mui/material/CircularProgress";
const AllEmployees = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(""); // "" = All brands
  const [searchQuery, setSearchQuery] = useState("");
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
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      await axios.delete(`https://api.thedesigngrit.com/api/vendors/${id}`);
      setVendors((prevVendors) =>
        prevVendors.filter((vendor) => vendor._id !== id)
      );
      alert("Employee deleted successfully.");
    } catch (error) {
      console.error("Error deleting vendor:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setCurrentPage(1); // Reset to page 1 when brand changes
  };

  // Filter vendors
  const filteredVendors = vendors.filter((vendor) => {
    if (selectedBrand && vendor.brandId?.brandName !== selectedBrand) {
      return false;
    }
    const fullName = `${vendor.firstName} ${vendor.lastName}`.toLowerCase();
    const email = vendor.email?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return (
      fullName.includes(query) ||
      vendor.firstName?.toLowerCase().includes(query) ||
      vendor.lastName?.toLowerCase().includes(query) ||
      email.includes(query)
    );
  });

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredVendors.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filteredVendors.length / employeesPerPage);
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
            {/* Brand Filter and Search Input */}
            <div style={{ display: "flex", marginBottom: "20px", gap: "20px" }}>
              <div>
                <label htmlFor="brandFilter" style={{ marginRight: "10px" }}>
                  Filter by Brand:
                </label>
                <select
                  id="brandFilter"
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  style={{
                    padding: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">All Brands</option>
                  {Array.from(new Set(vendors.map((v) => v.brandId?.brandName)))
                    .filter(Boolean)
                    .map((brandName, index) => (
                      <option key={index} value={brandName}>
                        {brandName}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  style={{
                    padding: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    width: "250px",
                  }}
                />
              </div>
            </div>
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
                  <th>Action</th>
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
                      <td>
                        <button
                          onClick={() => handleDelete(vendor._id)}
                          style={{
                            backgroundColor: "#d9534f",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
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
