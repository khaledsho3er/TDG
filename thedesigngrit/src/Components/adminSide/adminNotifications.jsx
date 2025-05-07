import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoEllipse } from "react-icons/io5";
import { useAdmin } from "../../utils/adminContext";

const AdminNotificationPage = () => {
  const { admin } = useAdmin();
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const notificationsPerPage = 8;

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.thedesigngrit.com/api/notifications/admin/all-notifications"
      );
      const data = await response.json();
      setAllNotifications(data);
      setNotifications(data);

      // Extract unique brands from notifications
      const uniqueBrands = Array.from(
        new Set(
          data
            .filter((notification) => notification.brandId)
            .map((notification) =>
              JSON.stringify({
                _id: notification.brandId._id,
                brandName: notification.brandId.brandName,
              })
            )
        )
      ).map((str) => JSON.parse(str));

      setBrands(uniqueBrands);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    setCurrentPage(1); // Reset to first page when filter changes

    if (brandId) {
      // Filter notifications by selected brand
      const filtered = allNotifications.filter(
        (notification) =>
          notification.brandId && notification.brandId._id === brandId
      );
      setNotifications(filtered);
    } else {
      // If no brand selected, show all notifications
      setNotifications(allNotifications);
    }
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      // Update the read status locally
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      // Also update in the allNotifications array
      setAllNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      // Send request to the backend to persist the change
      await fetch(
        `https://api.thedesigngrit.com/api/notifications/${id}/mark-as-read`,
        {
          method: "PATCH",
        }
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Pagination Logic
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  // Open the overlay popup with notification details
  const openNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification._id);
    }
  };

  // Close the overlay
  const closeOverlay = () => {
    setSelectedNotification(null);
  };

  return (
    <>
      <div className="dashboard-vendor">
        <header className="dashboard-header-vendor">
          <div className="dashboard-header-title">
            <h2>Admin Notifications</h2>
            <p>Admin Dashboard &gt; Notifications</p>
          </div>
        </header>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" fontWeight="600">
              All Notifications
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                marginBottom: "20px",
              }}
            >
              {/* Brand Filter */}
              <FormControl sx={{ m: 1 }}>
                <InputLabel id="brand-select-label">Filter by Brand</InputLabel>
                <Select
                  labelId="brand-select-label"
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  sx={{
                    width: "200px",
                    color: "#2d2d2d",
                    backgroundColor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2d2d2d",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2d2d2d",
                    },
                  }}
                  size="small"
                >
                  <MenuItem value="">All Brands</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand._id} value={brand._id}>
                      {brand.brandName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Box>

          {notifications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No notifications found
                {selectedBrand && " for the selected brand"}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 8px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f5f5f5" }}>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        borderRadius: "8px 0 0 8px",
                      }}
                    >
                      Status
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Type
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Id
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Brand
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Description
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Date
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        borderRadius: "0 8px 8px 0",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentNotifications.map((notification) => (
                    <tr
                      key={notification._id}
                      onClick={() => openNotificationDetails(notification)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: notification.read
                          ? "#ffffff"
                          : "#f9f9f9",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(0,0,0,0.1)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 2px 4px rgba(0,0,0,0.05)")
                      }
                    >
                      <td
                        style={{ padding: "16px", borderRadius: "8px 0 0 8px" }}
                      >
                        <IoEllipse
                          color={notification.read ? "grey" : "#e74c3c"}
                          style={{
                            fontSize: "1rem",
                            border: notification.read
                              ? "1px solid grey"
                              : "none",
                            borderRadius: "50%",
                          }}
                        />
                      </td>
                      <td style={{ padding: "16px" }}>
                        <Chip
                          label={notification.type}
                          size="small"
                          color={
                            notification.type === "order"
                              ? "primary"
                              : notification.type === "quote"
                              ? "secondary"
                              : "default"
                          }
                          variant="outlined"
                        />
                      </td>
                      <td style={{ padding: "16px" }}>
                        {notification.orderId || notification._id}
                      </td>
                      <td style={{ padding: "16px" }}>
                        {notification.brandId?.brandName || "N/A"}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          maxWidth: "300px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {notification.description}
                      </td>
                      <td style={{ padding: "16px" }}>
                        {formatDate(notification.date)}
                      </td>
                      <td
                        style={{ padding: "16px", borderRadius: "0 8px 8px 0" }}
                      >
                        {!notification.read ? (
                          <button
                            style={{
                              backgroundColor: "#2d2d2d",
                              color: "white",
                              border: "none",
                              padding: "10px 15px",
                              borderRadius: "5px",
                              cursor: "pointer",
                              transition: "background-color 0.3s",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor = "#444")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#2d2d2d")
                            }
                          >
                            Mark as Read
                          </button>
                        ) : (
                          <button
                            style={{
                              backgroundColor: "#e0e0e0",
                              color: "#757575",
                              border: "none",
                              padding: "10px 15px",
                              borderRadius: "5px",
                              cursor: "not-allowed",
                            }}
                            disabled
                          >
                            Read
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </Paper>

        {notifications.length > 0 && (
          <div
            className="pagination"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              margin: "20px 0",
            }}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  padding: "8px 16px",
                  border: currentPage === index + 1 ? "none" : "1px solid #ddd",
                  backgroundColor:
                    currentPage === index + 1 ? "#2d2d2d" : "white",
                  color: currentPage === index + 1 ? "white" : "#333",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (currentPage !== index + 1) {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                  }
                }}
                onMouseOut={(e) => {
                  if (currentPage !== index + 1) {
                    e.currentTarget.style.backgroundColor = "white";
                  }
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {selectedNotification && (
          <div
            className="notifiy-overlay-popup"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={closeOverlay}
          >
            <div
              className="notifiy-overlay-content"
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                width: "500px",
                maxWidth: "90%",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                {selectedNotification.brandId?.brandlogo && (
                  <Avatar
                    src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedNotification.brandId.brandlogo}`}
                    alt={
                      selectedNotification.brandId?.brandName || "Brand Logo"
                    }
                    sx={{
                      width: 60,
                      height: 60,
                      mr: 2,
                      border: "1px solid #eee",
                    }}
                  />
                )}
                <Box>
                  <Typography variant="h5" fontWeight="600">
                    {selectedNotification.type.charAt(0).toUpperCase() +
                      selectedNotification.type.slice(1)}{" "}
                    Notification
                  </Typography>
                  {selectedNotification.brandId?.brandName && (
                    <Typography variant="subtitle1" color="text.secondary">
                      {selectedNotification.brandId.brandName}
                    </Typography>
                  )}
                  {selectedNotification.brandId?.email && (
                    <Typography
                      variant="body2"
                      sx={{ color: "#2d2d2d !important" }}
                    >
                      {selectedNotification.brandId.email}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Details
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ color: "#2d2d2d !important" }}
                  >
                    {selectedNotification.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#2d2d2d !important" }}
                  >
                    Date: {formatDate(selectedNotification.date)}
                  </Typography>
                  {selectedNotification.orderId && (
                    <Typography
                      variant="body2"
                      sx={{ color: "#2d2d2d !important" }}
                    >
                      Order ID: {selectedNotification.orderId}
                    </Typography>
                  )}
                </Paper>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <button
                  onClick={closeOverlay}
                  style={{
                    backgroundColor: "#2d2d2d",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#444")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2d2d2d")
                  }
                >
                  Close
                </button>
              </Box>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminNotificationPage;
