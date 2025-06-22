import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, IconButton, CircularProgress } from "@mui/material";
import { IoIosClose } from "react-icons/io";

const API_URL = "https://api.thedesigngrit.com/api/admin/all-admins";

const OurEmployees = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (admin) => {
    setCurrentAdmin(admin);
    setEditPopupVisible(true);
  };

  const handleEditClose = () => {
    setEditPopupVisible(false);
    setCurrentAdmin(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://api.thedesigngrit.com/api/admin/profile/${currentAdmin._id}`,
        currentAdmin
      );
      setEditPopupVisible(false);
      fetchAdmins();
    } catch (error) {
      console.error("Error updating admin", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    setDeletingId(currentAdmin._id);
    try {
      await axios.delete(
        `https://api.thedesigngrit.com/api/admin/profile/${currentAdmin._id}`
      );
      setEditPopupVisible(false);
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin", error);
    } finally {
      setDeletingId(null);
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
          <h2>Admins</h2>
        </div>
        <p style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
          Home &gt; Admins
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
              Admins List
            </h2>
            <table>
              <thead style={{ backgroundColor: "#f2f2f2", color: "#2d2d2d" }}>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      <CircularProgress style={{ color: "#6b7b58" }} />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        No admins found
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin) => (
                      <tr key={admin._id}>
                        <td>{admin.username}</td>
                        <td>{admin.email}</td>
                        <td>{admin.role}</td>
                        <td>
                          <button
                            onClick={() => handleEditClick(admin)}
                            style={{
                              color: "#e3e3e3",
                              backgroundColor: "#6a8452",
                              marginRight: 8,
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </table>
          </Box>
        </div>
        {editPopupVisible && currentAdmin && (
          <div className="requestInfo-popup-overlay">
            <div className="requestInfo-popup">
              <div className="requestInfo-popup-header">
                <h2>Edit Admin</h2>
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
                  <label>Username</label>
                  <input
                    type="text"
                    value={currentAdmin.username}
                    onChange={(e) =>
                      setCurrentAdmin({
                        ...currentAdmin,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="requestInfo-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={currentAdmin.email}
                    onChange={(e) =>
                      setCurrentAdmin({
                        ...currentAdmin,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="requestInfo-form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={currentAdmin.role}
                    onChange={(e) =>
                      setCurrentAdmin({
                        ...currentAdmin,
                        role: e.target.value,
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
                    Edit Admin
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="requestInfo-submit-button"
                    style={{ backgroundColor: "#DC143C", width: "15%" }}
                    disabled={deletingId === currentAdmin._id}
                  >
                    {deletingId === currentAdmin._id
                      ? "Deleting..."
                      : "Delete Admin"}
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

export default OurEmployees;
