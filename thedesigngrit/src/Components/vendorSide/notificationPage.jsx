import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoEllipse } from "react-icons/io5"; // For status dots
import { Link } from "react-router-dom";
import VendorPageLayout from "./VendorLayout";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null); // For overlay
  const notificationsPerPage = 8;

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/json/NotificationsData.json");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Open the overlay popup with notification details
  const openNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    markAsRead(notification.id); // Mark it as read when opened
  };

  // Close the overlay
  const closeOverlay = () => {
    setSelectedNotification(null);
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

  return (
    <VendorPageLayout>
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
                <th>Description</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentNotifications.map((notification) => (
                <tr
                  key={notification.id}
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
                  <td>{notification.description}</td>
                  <td>{notification.date}</td>
                  <td>
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
                        e.stopPropagation(); // Prevent opening overlay
                        markAsRead(notification.id);
                      }}
                    >
                      Mark as Read
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

        {/* Overlay Popup */}
        {selectedNotification && (
          <div className="notifiy-overlay-popup">
            <div className="notifiy-overlay-content">
              <h2>{selectedNotification.type}</h2>
              <p>{selectedNotification.description}</p>
              <p>Date: {selectedNotification.date}</p>
              <p>Action Required: {selectedNotification.action}</p>
              <button onClick={closeOverlay}>Close</button>
            </div>
          </div>
        )}
      </div>
    </VendorPageLayout>
  );
};

export default NotificationsPage;
