import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box } from "@mui/system";
import { IconButton } from "@mui/material";
import { IoIosClose } from "react-icons/io";
import { useVendor } from "../../utils/vendorContext";
import { CiCirclePlus } from "react-icons/ci";
import VendorSignup from "./Addemployee"; // Import the VendorSignup component

const EmployeePage = () => {
  const { vendor } = useVendor();
  const [vendors, setVendors] = useState([]);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [signupPopupVisible, setSignupPopupVisible] = useState(false); // Add state for VendorSignup popup
  const [currentVendor, setCurrentVendor] = useState(null);

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
  }, [vendor?.brandId]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleEditClick = (vendor) => {
    setCurrentVendor(vendor);
    setEditPopupVisible(true);
  };

  const handleEditClose = () => {
    setEditPopupVisible(false);
    setCurrentVendor(null);
  };

  const handleSignupClose = () => {
    setSignupPopupVisible(false);
  };

  return (
    <div style={{ padding: "70px" }}>
      <div className="dashboard-date-vendor">
        <button
          onClick={() => setSignupPopupVisible(true)} // Open signup popup
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
                        style={{ color: "#e3e3e3", backgroundColor: "#6a8452" }}
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
          <div className="popup-overlay-employee">
            <div className="popup-content-employee">
              <IconButton
                onClick={handleSignupClose}
                sx={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  color: "#2d2d2d",
                }}
              >
                <IoIosClose size={30} />
              </IconButton>
              <VendorSignup onClose={handleSignupClose} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default EmployeePage;
