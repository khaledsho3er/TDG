import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa"; // React Icons
import { useVendor } from "../../utils/vendorContext"; // Vendor context

const NotificationOverlayVendor = ({ onClose, setActivePage }) => {
  // const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { vendor } = useVendor(); // Get vendor data

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!vendor || !vendor.brandId) {
          console.error("Brand ID not found in vendor session");
          return;
        }
        const response = await fetch(
          `https://api.thedesigngrit.com/api/notifications/notifications?brandId=${vendor.brandId}`
        );
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [vendor]); // Re-fetch if vendor data changes

  // Show last 3 notifications
  const latestNotifications = notifications.slice(-3);

  const handleOpenPage = () => {
    setActivePage("notifications"); // Change the active page without changing the URL
    onClose(); // Close the overlay

    // navigate("/notificationsPage");
  };

  return (
    <div className="notification-overlay-vendor">
      <div className="overlay-container-vendor">
        <div className="overlay-header-vendor">
          <h3>Notifications</h3>
          <button className="close-button-vendor" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="overlay-body-vendor">
          {latestNotifications.length > 0 ? (
            latestNotifications.map((notification) => (
              <div key={notification._id} className="notification-item-vendor">
                <div className="notification-details-vendor">
                  <h4>{notification.type}</h4>
                  <p>{notification.description}</p>
                  <span>
                    {new Date(notification.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="notification-status-vendor">
                  {notification.read ? "Read" : "Unread"}
                </div>
              </div>
            ))
          ) : (
            <p>No recent notifications</p>
          )}
        </div>
        <div className="overlay-footer-vendor">
          <button className="view-all-vendor" onClick={handleOpenPage}>
            VIEW ALL NOTIFICATIONS
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationOverlayVendor;
