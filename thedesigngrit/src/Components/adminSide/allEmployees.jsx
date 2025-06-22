import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { IoIosClose } from "react-icons/io";

import CircularProgress from "@mui/material/CircularProgress";
const AllEmployees = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(""); // "" = All brands
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    employeeNumber: "",
    tier: "",
  });

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

  const handleEdit = (vendor) => {
    setCurrentEmployee(vendor);
    setFormData({
      firstName: vendor.firstName || "",
      lastName: vendor.lastName || "",
      email: vendor.email || "",
      phoneNumber: vendor.phoneNumber || "",
      employeeNumber: vendor.employeeNumber || "",
      tier: vendor.tier || "1",
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitUpdate = async () => {
    try {
      const response = await axios.put(
        `https://api.thedesigngrit.com/api/vendors/${currentEmployee._id}`,
        formData
      );

      // Update the vendors list with the updated employee
      setVendors(
        vendors.map((vendor) =>
          vendor._id === currentEmployee._id
            ? { ...vendor, ...formData }
            : vendor
        )
      );

      setEditDialogOpen(false);
      alert("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee. Please try again.");
    }
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
            <div
              style={{
                display: "flex",
                marginBottom: "20px",
                gap: "20px",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <p style={{ marginRight: "10px" }}>Filter by Brand:</p>

              <div>
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
                    padding: "6px",
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
                  <th>Actions</th>
                </tr>
              </thead>
              {vendors.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      <CircularProgress style={{ color: "#6b7b58" }} />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {currentEmployees.map((vendor) => (
                    <tr key={vendor?._id}>
                      <td>{vendor?.firstName || "N/A"}</td>
                      <td>{vendor?.lastName || "N/A"}</td>
                      <td>{vendor?.email || "N/A"}</td>
                      <td>{vendor?.employeeNumber || "N/A"}</td>
                      <td>{vendor?.phoneNumber || "N/A"}</td>
                      <td>{vendor?.tier || "N/A"}</td>
                      <td>{vendor?.brandId?.brandName || "N/A"}</td>
                      <td style={{ display: "flex", gap: "5px" }}>
                        <button
                          onClick={() => handleEdit(vendor)}
                          style={{
                            backgroundColor: "#6a8452",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(vendor?._id)}
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

      {/* Edit Employee Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "bold", fontFamily: "Horizon" }}>
              Update Employee
            </span>
            <IoIosClose
              size={30}
              onClick={handleCloseEditDialog}
              style={{ cursor: "pointer" }}
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Employee Number"
                name="employeeNumber"
                value={formData.employeeNumber}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="tier-label">Authority Level (Tier)</InputLabel>
                <Select
                  labelId="tier-label"
                  name="tier"
                  value={formData.tier}
                  onChange={handleInputChange}
                  label="Authority Level (Tier)"
                >
                  <MenuItem value="1">
                    Tier 1 - Notification Page, Orders List
                  </MenuItem>
                  <MenuItem value="2">
                    Tier 2 - Notifications Page, Orders List, all Products,
                    Promotion, brand profile
                  </MenuItem>
                  <MenuItem value="3">
                    Tier 3 - Full Access + Financials
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseEditDialog}
            variant="outlined"
            sx={{
              color: "#2d2d2d",
              borderColor: "#2d2d2d",
              "&:hover": { borderColor: "#2d2d2d", backgroundColor: "#f5f5f5" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitUpdate}
            variant="contained"
            sx={{
              backgroundColor: "#6a8452",
              color: "white",
              "&:hover": { backgroundColor: "#5a7342" },
            }}
          >
            Update Employee
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllEmployees;
