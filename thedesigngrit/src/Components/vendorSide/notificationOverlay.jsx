import React from "react";
import { FaTimes } from "react-icons/fa"; // React Icons
import { useNavigate } from "react-router-dom";

const NotificationOverlayVendor = ({ onClose }) => {
  const notifications = [
    {
      id: 1,
      title: "Lorem Ipsum",
      price: "₹140",
      date: "Nov 15, 2023",
      status: "Sold",
    },
    {
      id: 2,
      title: "Lorem Ipsum",
      price: "₹140",
      date: "Nov 15, 2023",
      status: "Sold",
    },
    {
      id: 3,
      title: "Lorem Ipsum",
      price: "₹140",
      date: "Nov 15, 2023",
      status: "Sold",
    },
    {
      id: 4,
      title: "Lorem Ipsum",
      price: "₹140",
      date: "Nov 15, 2023",
      status: "Sold",
    },
  ];
  const navigate = useNavigate();

  const handleOpenPage = () => {
    navigate("/notificationsPage");
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
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-item-vendor">
              <div className="notification-image-vendor"></div>
              <div className="notification-details-vendor">
                <h4>{notification.title}</h4>
                <p>{notification.price}</p>
                <span>{notification.date}</span>
              </div>
              <div className="notification-status-vendor">
                {notification.status}
              </div>
            </div>
          ))}
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
