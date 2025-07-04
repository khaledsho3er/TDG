import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import { IconButton } from "@mui/material";
import { IoIosClose } from "react-icons/io";
import { useVendor } from "../../utils/vendorContext";
import { CiCirclePlus } from "react-icons/ci";
import VendorSignup from "./Addemployee";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmationDialog from "../confirmationMsg";

const EmployeePage = () => {
  const { vendor } = useVendor(); // Get vendor data, including brandId
  const [vendors, setVendors] = useState([]);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [signupPopupVisible, setSignupPopupVisible] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
          `https://api.thedesigngrit.com/api/vendors/vendors/byBrand/${vendor.brandId}`
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
    setConfirmEditOpen(true);
  };

  const handleEditConfirm = async () => {
    try {
      await axios.put(
        `https://api.thedesigngrit.com/api/vendors/${currentVendor._id}`,
        currentVendor
      );
      setEditPopupVisible(false);
      fetchVendors();
    } catch (error) {
      console.error("Error updating vendor", error);
    } finally {
      setConfirmEditOpen(false);
    }
  };

  const handleDelete = () => {
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `https://api.thedesigngrit.com/api/vendors/${currentVendor._id}`
      );
      setEditPopupVisible(false);
      fetchVendors();
    } catch (error) {
      console.error("Error deleting vendor", error);
    } finally {
      setConfirmDeleteOpen(false);
    }
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
          <h2>Employees</h2>
        </div>
        <p style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
          Home &gt; Employees
        </p>
      </div>
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
            <h2
              style={{
                color: "#2d2d2d",
                textAlign: "left",
                marginBottom: "20px",
              }}
            >
              Employees List
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
                  <th>Actions</th>
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
              )}
            </table>
          </Box>
        </div>
        {signupPopupVisible && (
          <>
            <div className="popup-header">
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
              refreshList={fetchVendors}
            />
          </>
        )}
        {editPopupVisible && currentVendor && (
          <div className="requestInfo-popup-overlay">
            <div
              className="requestInfo-popup"
              style={{
                backgroundColor: "white",
              }}
            >
              <div className="requestInfo-popup-header">
                <h2 style={{ color: "#2d2d2d" }}>Edit Vendor</h2>
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
                  <select
                    value={currentVendor.tier}
                    onChange={(e) =>
                      setCurrentVendor({
                        ...currentVendor,
                        tier: e.target.value,
                      })
                    }
                  >
                    <option value="1">
                      {" "}
                      Tier 1 - Notification Page, Orders List
                    </option>
                    <option value="2">
                      {" "}
                      Tier 2 - Notifications Page, Orders List, all Products,
                      Promotion, brand profile
                    </option>
                    <option value="3">
                      {" "}
                      Tier 3 - Full Access + Financials
                    </option>
                  </select>
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
                    Edit Employee
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="requestInfo-submit-button"
                    style={{ backgroundColor: "#DC143C", width: "15%" }}
                  >
                    Delete Employee
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
      <ConfirmationDialog
        open={confirmEditOpen}
        title="Confirm Edit"
        content="Are you sure you want to submit these changes?"
        onConfirm={handleEditConfirm}
        onCancel={() => setConfirmEditOpen(false)}
      />
      <ConfirmationDialog
        open={confirmDeleteOpen}
        title="Confirm Delete"
        content="Are you sure you want to delete this employee?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
};

export default EmployeePage;
