import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import { IconButton } from "@mui/material";
import { IoIosClose } from "react-icons/io";
import { useVendor } from "../../utils/vendorContext";
import { CiCirclePlus } from "react-icons/ci";
import VendorSignup from "./Addemployee";
const EmployeePage = () => {
  const { vendor } = useVendor(); // Get vendor data, including brandId
  const [vendors, setVendors] = useState([]);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [signupPopupVisible, setSignupPopupVisible] = useState(false);

  const handleOpenSignup = () => {
    setSignupPopupVisible(true);
  };

  const handleCloseSignup = () => {
    setSignupPopupVisible(false);
  };
  // Define fetchVendors function and memoize it
  const fetchVendors = useCallback(async () => {
    try {
      if (vendor?.brandId) {
        const response = await axios.get(
          `https://tdg-db.onrender.com/api/vendors/vendors/byBrand/${vendor.brandId}`
        );
        setVendors(response.data);
      } else {
        console.error("BrandId not found in session");
      }
    } catch (error) {
      console.error("Error fetching vendors", error);
    }
  }, [vendor?.brandId]); // Add vendor.brandId as a dependency

  // Fetch vendors when the component mounts or vendor changes
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]); // Include fetchVendors in dependency array

  const handleEditClick = (vendor) => {
    setCurrentVendor(vendor);
    setEditPopupVisible(true);
  };

  const handleEditClose = () => {
    setEditPopupVisible(false);
    setCurrentVendor(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://tdg-db.onrender.com/api/vendors/${currentVendor._id}`,
        currentVendor
      );
      setEditPopupVisible(false);
      fetchVendors();
    } catch (error) {
      console.error("Error updating vendor", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://tdg-db.onrender.com/api/vendors/${currentVendor._id}`
      );
      setEditPopupVisible(false);
      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor", error);
    }
  };

  return (
    <div style={{ padding: "70px" }}>
      <div className="dashboard-date-vendor">
        <button
          onClick={handleOpenSignup} // Show popup on click
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "#2d2d2d",
            color: "white",
            padding: "15px 15px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          <CiCirclePlus /> Add Employee
        </button>
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
            <h2 style={{ color: "#2d2d2d", textAlign: "left" }}>Vendor List</h2>
            <table>
              <thead style={{ backgroundColor: "#f2f2f2", color: "#2d2d2d" }}>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Employee Number</th>
                  <th>Phone Number</th>
                  <th>Tier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor._id}>
                    <td>{vendor.firstName}</td>
                    <td>{vendor.lastName}</td>
                    <td>{vendor.email}</td>
                    <td>{vendor.employeeNumber}</td>
                    <td>{vendor.phoneNumber}</td>
                    <td>{vendor.tier}</td>
                    <td>
                      <button
                        onClick={() => handleEditClick(vendor)}
                        style={{
                          color: "#e3e3e3",
                          backgroundColor: "#6a8452",
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </div>
        {signupPopupVisible && (
          <>
            <div className="popup-header">
              <h2>Add Employee</h2>
              <IconButton
                onClick={() => setSignupPopupVisible(false)}
                sx={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  color: "#2d2d2d",
                }}
              >
                <IoIosClose size={30} />
              </IconButton>
            </div>
            <VendorSignup
              open={signupPopupVisible}
              onClose={handleCloseSignup}
            />
          </>
        )}
        {editPopupVisible && currentVendor && (
          <div className="requestInfo-popup-overlay">
            <div className="requestInfo-popup">
              <div className="requestInfo-popup-header">
                <h2>Edit Vendor</h2>
                <IconButton
                  onClick={handleEditClose}
                  sx={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    color: "#2d2d2d",
                  }}
                >
                  <IoIosClose size={30} />
                </IconButton>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="requestInfo-form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={currentVendor.firstName}
                    onChange={(e) =>
                      setCurrentVendor({
                        ...currentVendor,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="requestInfo-form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={currentVendor.lastName}
                    onChange={(e) =>
                      setCurrentVendor({
                        ...currentVendor,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="requestInfo-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={currentVendor.email}
                    onChange={(e) =>
                      setCurrentVendor({
                        ...currentVendor,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="requestInfo-form-group">
                  <label>Employee Number</label>
                  <input
                    type="text"
                    value={currentVendor.employeeNumber}
                    onChange={(e) =>
                      setCurrentVendor({
                        ...currentVendor,
                        employeeNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="requestInfo-form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={currentVendor.phoneNumber}
                    onChange={(e) =>
                      setCurrentVendor({
                        ...currentVendor,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="requestInfo-form-group">
                  <label>Tier</label>
                  <input
                    type="text"
                    value={currentVendor.tier}
                    onChange={(e) =>
                      setCurrentVendor({
                        ...currentVendor,
                        tier: e.target.value,
                      })
                    }
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: "auto",
                  }}
                >
                  <button
                    type="submit"
                    className="requestInfo-submit-button"
                    style={{ width: "15%" }}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="requestInfo-submit-button"
                    style={{ backgroundColor: "#DC143C", width: "15%" }}
                  >
                    Delete Vendor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default EmployeePage;
