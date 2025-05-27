import React, { useState, useEffect, useContext, createContext } from "react";
import { FaTimes } from "react-icons/fa";
import { UserContext } from "../../src/utils/userContext";
import { useNavigate } from "react-router-dom";

// Create a context for favorite updates
export const FavoritesContext = createContext({
  favoritesUpdated: false,
  updateFavorites: () => {},
  favoriteCount: 0,
  setFavoriteCount: () => {},
});

export const FavoritesProvider = ({ children }) => {
  const [favoritesUpdated, setFavoritesUpdated] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const { userSession } = useContext(UserContext);

  const updateFavorites = () => {
    setFavoritesUpdated((prev) => !prev); // Toggle to trigger useEffect
  };

  // Fetch favorite count whenever favorites are updated
  useEffect(() => {
    const fetchFavoriteCount = async () => {
      if (!userSession) {
        setFavoriteCount(0);
        return;
      }

      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/favorites/${userSession.id}`
        );
        if (response.ok) {
          const favoritesData = await response.json();
          setFavoriteCount(favoritesData.length);
        }
      } catch (error) {
        console.error("Error fetching favorite count:", error);
      }
    };

    fetchFavoriteCount();
  }, [userSession, favoritesUpdated]);

  return (
    <FavoritesContext.Provider
      value={{
        favoritesUpdated,
        updateFavorites,
        favoriteCount,
        setFavoriteCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

const FavoritesOverlay = ({ open, onClose }) => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const { userSession } = useContext(UserContext);
  const navigate = useNavigate();
  const { favoritesUpdated, updateFavorites, setFavoriteCount } =
    useContext(FavoritesContext);

  // Fetch favorite products when the component is mounted or when userSession or favoritesUpdated changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userSession) return;

      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/favorites/${userSession.id}`
        );
        if (response.ok) {
          const favoritesData = await response.json();
          setFavoriteProducts(favoritesData);
          // Update the count in the context
          setFavoriteCount(favoritesData.length);
        } else {
          console.error("Failed to fetch favorites");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    if (userSession) {
      fetchFavorites();
    }
  }, [userSession, favoritesUpdated, open, setFavoriteCount]);

  // Function to remove item from favorites
  const removeFavorite = async (productId) => {
    if (!userSession) return;

    try {
      const response = await fetch(
        `https://api.thedesigngrit.com/api/favorites/remove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userSession,
            productId,
          }),
        }
      );

      if (response.ok) {
        // Update the local state to remove the product
        setFavoriteProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );

        // Update the count in the context
        setFavoriteCount((prev) => Math.max(0, prev - 1));

        // Trigger update to refresh other components
        updateFavorites();
      } else {
        console.error("Failed to remove favorite");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (!open) return null; // Do not render if not open

  const navigateToWishlistPage = () => {
    navigate("/myaccount", { state: { section: "wishlist" } });
    onClose(); // Close the overlay when navigating
  };

  return (
    <div className="overlay-container-vendor" style={{ right: "30px" }}>
      {/* Header */}
      <div className="overlay-header-vendor">
        <h3>Favorites ({favoriteProducts.length})</h3>
        <button
          className="close-button-vendor"
          onClick={onClose}
          style={{
            color: "#2d2d2d",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "transparent",
              color: "#2d2d2d",
            },
          }}
        >
          <FaTimes />
        </button>
      </div>

      {/* Body */}
      <div className="overlay-body-vendor">
        {favoriteProducts.length > 0 ? (
          favoriteProducts.map((product) => (
            <div key={product._id} className="notification-item-vendor">
              <div
                className="notification-image-vendor"
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ cursor: "pointer" }}
              >
                {/* Assuming `product.mainImage` is the image path */}
                <img
                  src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                  alt={product.title}
                  className="notification-image-vendor-image"
                />
              </div>
              <div
                className="notification-details-vendor"
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ cursor: "pointer" }}
              >
                <h4>{product.name}</h4>
                {product.salePrice ? (
                  <p
                    style={{
                      textDecoration: "line-through",
                      marginRight: "8px",
                      color: "#ccc",
                    }}
                  >
                    {product.price.toLocaleString()} E£
                  </p>
                ) : (
                  <p> {product.price.toLocaleString()} E£</p>
                )}
                {product.salePrice && (
                  <p style={{ color: "red" }}>
                    {product.salePrice.toLocaleString()} E£
                  </p>
                )}
                <span>
                  {product.description.split(" ").slice(0, 10).join(" ") +
                    (product.description.split(" ").length > 10 ? "..." : "")}
                </span>
              </div>
              <div className="notification-actions-vendor">
                <div
                  className="notification-status-vendor"
                  style={{
                    backgroundColor:
                      product.stock === 0
                        ? "#f44336"
                        : product.stock > 0 && product.stock < 5
                        ? "#ff9800"
                        : "#6c7c59",
                  }}
                >
                  {product.stock === 0
                    ? "Unavailable"
                    : product.stock > 0 && product.stock < 5
                    ? "Hurry! Only " + product.stock + " left"
                    : "Available"}
                </div>
                <button
                  className="remove-favorite-button"
                  onClick={() => removeFavorite(product._id)}
                  aria-label="Remove from favorites"
                >
                  <FaTimes />
                </button>
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
        {!userSession ? (
          <button
            className="view-all-vendor"
            onClick={() => navigate("/login")}
          >
            VIEW WISHLIST
          </button>
        ) : (
          <button className="view-all-vendor" onClick={navigateToWishlistPage}>
            VIEW WISHLIST
          </button>
        )}
      </div>
    </div>
  );
};

export default FavoritesOverlay;
