import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { IoEllipse } from "react-icons/io5";
// import { useAdmin } from "../../utils/adminContext";

const AdminNotificationPage = () => {
  // const { admin } = useAdmin();
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const notificationsPerPage = 8;

  // Fetch brand notifications
  const fetchBrandNotifications = useCallback(async () => {
    setIsLoading(true);
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
      console.error("Error fetching brand notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch admin notifications
  const fetchAdminNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://api.thedesigngrit.com/api/admin-notifications/"
      );
      const data = await response.json();
      setAdminNotifications(data);
    } catch (error) {
      console.error("Error fetching admin notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrandNotifications();
    fetchAdminNotifications();
  }, [fetchBrandNotifications, fetchAdminNotifications]);

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

  // Mark a brand notification as read
  const markBrandNotificationAsRead = async (id) => {
    setIsMarkingAsRead(true);
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
      console.error("Error marking brand notification as read:", error);
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  // Mark an admin notification as read
  const markAdminNotificationAsRead = async (id) => {
    setIsMarkingAsRead(true);
    try {
      // Update the read status locally
      setAdminNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      // Send request to the backend to persist the change
      await fetch(
        `https://api.thedesigngrit.com/api/admin-notifications/${id}/mark-as-read`,
        {
          method: "PATCH",
        }
      );
    } catch (error) {
      console.error("Error marking admin notification as read:", error);
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  // Pagination Logic for brand notifications
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;
  const currentBrandNotifications = notifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );
  const totalBrandPages = Math.ceil(
    notifications.length / notificationsPerPage
  );

  // Pagination Logic for admin notifications
  const currentAdminNotifications = adminNotifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );
  const totalAdminPages = Math.ceil(
    adminNotifications.length / notificationsPerPage
  );

  // Open the overlay popup with notification details
  const openNotificationDetails = (
    notification,
    isAdminNotification = false
  ) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      if (isAdminNotification) {
        markAdminNotificationAsRead(notification._id);
      } else {
        markBrandNotificationAsRead(notification._id);
      }
    }
  };

  // Close the overlay
  const closeOverlay = () => {
    setSelectedNotification(null);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Render notification table
  const renderNotificationTable = (
    notifications,
    isAdminNotification = false
  ) => {
    if (isLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            width: "100%",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#6b7b58" }} />
        </Box>
      );
    }

    return (
      <>
        {notifications.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No notifications found
              {!isAdminNotification &&
                selectedBrand &&
                " for the selected brand"}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              overflowX: "auto",
              width: "100%",
              maxWidth: "100vw", // Ensures it doesn't overflow the viewport
              minWidth: "600px", // Optional: set a min width for usability
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 8px",
                minWidth: "900px",
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
                  {!isAdminNotification && (
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>
                      Brand
                    </th>
                  )}
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
                {notifications.map((notification) => (
                  <tr
                    key={notification._id}
                    onClick={() =>
                      openNotificationDetails(notification, isAdminNotification)
                    }
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
                          border: notification.read ? "1px solid grey" : "none",
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
                    {!isAdminNotification && (
                      <td style={{ padding: "16px" }}>
                        {notification.brandId?.brandName || "N/A"}
                      </td>
                    )}
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "120px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            isAdminNotification
                              ? markAdminNotificationAsRead(notification._id)
                              : markBrandNotificationAsRead(notification._id);
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.backgroundColor = "#444")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.backgroundColor = "#2d2d2d")
                          }
                          disabled={isMarkingAsRead}
                        >
                          {isMarkingAsRead &&
                          notification._id === selectedNotification?._id ? (
                            <CircularProgress
                              size={20}
                              thickness={4}
                              sx={{ color: "#fff" }}
                            />
                          ) : (
                            "Mark as Read"
                          )}
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
                            minWidth: "120px",
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
      </>
    );
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
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="notification tabs"
              textColor="inherit"
              TabIndicatorProps={{
                style: { backgroundColor: "#2d2d2d", height: 3 },
              }}
            >
              <Tab
                label="Admin Notifications"
                sx={{
                  color: "#2d2d2d",
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              />
              <Tab
                label="Brand Notifications"
                sx={{
                  color: "#2d2d2d",
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              />
            </Tabs>
          </Box>

          {activeTab === 0 ? (
            // Admin Notifications Tab
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h5" fontWeight="600">
                  Admin Notifications
                </Typography>
              </Box>
              {renderNotificationTable(currentAdminNotifications, true)}

              {!isLoading && adminNotifications.length > 0 && (
                <div
                  className="pagination"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    margin: "20px 0",
                  }}
                >
                  {Array.from({ length: totalAdminPages }, (_, index) => (
                    <button
                      key={index}
                      className={currentPage === index + 1 ? "active" : ""}
                      onClick={() => setCurrentPage(index + 1)}
                      style={{
                        padding: "8px 16px",
                        border:
                          currentPage === index + 1 ? "none" : "1px solid #ddd",
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
            </>
          ) : (
            // Brand Notifications Tab
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <Typography variant="h5" fontWeight="600">
                  Brand Notifications
                </Typography>

                {/* Brand Filter */}
                {!isLoading && (
                  <FormControl
                    sx={{ m: 1, border: "1px solid #ddd", borderRadius: "4px" }}
                  >
                    <InputLabel
                      id="brand-select-label"
                      sx={{
                        position: "relative",
                        top: "-8px",
                        backgroundColor: "#fff",
                      }}
                    >
                      Brand
                    </InputLabel>
                    <Select
                      labelId="brand-select-label"
                      value={selectedBrand}
                      onChange={handleBrandChange}
                      sx={{
                        width: "200px",
                        color: "#2d2d2d",
                        backgroundColor: "#fff",
                      }}
                    >
                      <MenuItem value="">All Brands</MenuItem>
                      {brands.map((brand) => (
                        <MenuItem key={brand._id} value={brand._id}>
                          {brand.brandName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </div>

              {renderNotificationTable(currentBrandNotifications)}

              {!isLoading && notifications.length > 0 && (
                <div
                  className="pagination"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    margin: "20px 0",
                  }}
                >
                  {Array.from({ length: totalBrandPages }, (_, index) => (
                    <button
                      key={index}
                      className={currentPage === index + 1 ? "active" : ""}
                      onClick={() => setCurrentPage(index + 1)}
                      style={{
                        padding: "8px 16px",
                        border:
                          currentPage === index + 1 ? "none" : "1px solid #ddd",
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
            </>
          )}
        </Paper>

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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                }}
              >
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
