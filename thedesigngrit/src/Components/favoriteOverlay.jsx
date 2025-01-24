import React from "react";
import { FaTimes } from "react-icons/fa";
const FavoritesOverlay = ({ open, onClose }) => {
  if (!open) return null; // Do not render if not open

  const favoriteProducts = [
    {
      id: 1,
      title: "Modern Chair",
      price: "LE 500",
      date: "Dec 20, 2023",
      status: "Available",
    },
    {
      id: 2,
      title: "Wooden Table",
      price: "LE 1200",
      date: "Dec 19, 2023",
      status: "Available",
    },
    {
      id: 3,
      title: "Decorative Lamp",
      price: "LE 300",
      date: "Dec 18, 2023",
      status: "Out of Stock",
    },
  ];

  return (
    <div className="overlay-container-vendor" style={{ right: "50px" }}>
      {/* Header */}
      <div className="overlay-header-vendor">
        <h3>Favorites</h3>
        <button className="close-button-vendor" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      {/* Body */}
      <div className="overlay-body-vendor">
        {favoriteProducts.length > 0 ? (
          favoriteProducts.map((product) => (
            <div key={product.id} className="notification-item-vendor">
              <div className="notification-image-vendor"></div>
              <div className="notification-details-vendor">
                <h4>{product.title}</h4>
                <p>{product.price}</p>
                <span>{product.date}</span>
              </div>
              <div
                className="notification-status-vendor"
                style={{
                  backgroundColor:
                    product.status === "Available" ? "#6a8452" : "#f44336",
                }}
              >
                {product.status}
              </div>
            </div>
          ))
        ) : (
          <p style={{ padding: "16px", textAlign: "center", color: "#888" }}>
            No favorites added yet.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="overlay-footer-vendor">
        <button className="view-all-vendor">VIEW ALL FAVORITES</button>
      </div>
    </div>
  );
};

export default FavoritesOverlay;
