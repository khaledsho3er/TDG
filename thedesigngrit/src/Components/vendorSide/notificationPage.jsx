import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoEllipse } from "react-icons/io5"; // For status dots
import { Link } from "react-router-dom";
import { useVendor } from "../../utils/vendorContext"; // Import your vendor context
import OrderDetails from "./orderDetails";

const NotificationsPage = () => {
  const { vendor } = useVendor(); // Access vendor data from context
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null); // For overlay
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 8;
  const fetchNotifications = useCallback(async () => {
    try {
      if (!vendor || !vendor.brandId) {
        console.error("Brand ID not found in vendor session");
        return;
      }
      const brandId = vendor.brandId;
      const response = await fetch(
        `https://tdg-db.onrender.com/api/notifications/notifications?brandId=${brandId}`
      );
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [vendor]); // تثبيت الدالة مع vendor كـ dependency

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]); // استدعاء الدالة عند تغيّر vendor
  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short", // 'Mon'
      year: "numeric", // '2025'
      month: "short", // 'Feb'
      day: "numeric", // '2'
    });
  };

  // Mark a notification as read (Frontend and Backend update)
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

      // Send request to the backend to persist the change
      await fetch(
        `https://tdg-db.onrender.com/api/notifications/${id}/mark-as-read`,
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
      markAsRead(notification._id); // Mark it as read when opened, but only if not read
    }
  };

  // Close the overlay
  const closeOverlay = () => {
    setSelectedNotification(null);
  };
  if (selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }
  return (
    <>
      <div className="dashboard-vendor">
        <header className="dashboard-header-vendor">
          <div className="dashboard-header-title">
            <h2>Notifications</h2>
            <p>
              <Link to="/vendorpanel">Home</Link> &gt; Notifications
            </p>
          </div>
        </header>

        <div className="recent-purchases">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Recent Notifications</h3>
            <BsThreeDotsVertical />
          </Box>
          <hr />
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Type</th>
                <th>Id</th>
                <th>Description</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentNotifications.map((notification) => (
                <tr
                  key={notification._id}
                  onClick={() => openNotificationDetails(notification)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <IoEllipse
                      color={notification.read ? "grey" : "red"}
                      style={{
                        fontSize: "1rem",
                        border: notification.read ? "1px solid grey" : "none",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td>{notification.type}</td>
                  <td>{notification.orderId || notification._id}</td>
                  <td>{notification.description}</td>
                  <td>{formatDate(notification.date)}</td>{" "}
                  {/* Formatted date */}
                  <td>
                    {!notification.read ? (
                      <button
                        style={{
                          backgroundColor: "#2d2d2d",
                          color: "white",
                          border: "none",
                          padding: "15px 10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification._id);
                        }}
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <button
                        style={{
                          backgroundColor: "grey",
                          color: "white",
                          border: "none",
                          padding: "15px 10px",
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
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {selectedNotification && (
          <div className="notifiy-overlay-popup">
            <div className="notifiy-overlay-content">
              <h2>{selectedNotification.type}</h2>
              <p>{selectedNotification.description}</p>
              <p>Date: {formatDate(selectedNotification.date)}</p>{" "}
              {/* Formatted date */}
              <div className="notifiy-overlay-buttons">
                {/* {selectedNotification.type === "order" ? (
                  <button
                    onClick={(e) => {
                      console.log("Order ID:", selectedNotification.orderId);
                      e.stopPropagation();
                      setSelectedOrder(selectedNotification.orderId); // Make sure this is the correct property name
                    }}
                  >
                    View Order Details
                  </button>
                ) : (
                  <button>View Quotation Details</button>
                )} */}
                <button onClick={closeOverlay}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsPage;
