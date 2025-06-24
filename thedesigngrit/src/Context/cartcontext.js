import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useUser } from "../utils/userContext"; // Import user context to access user data
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [lastAddedItem, setLastAddedItem] = useState(null); // Track last added item for highlighting
  const [cartTimeoutId, setCartTimeoutId] = useState(null); // Abandoned cart timer
  const { user } = useUser(); // Access user data from user context
  // Load cart items from localStorage if available
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Update localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log("Cart items updated:", cartItems); // Debug log
  }, [cartItems]);
  // ⏰ Setup abandoned cart timer
  useEffect(() => {
    if (cartTimeoutId) clearTimeout(cartTimeoutId);

    if (cartItems.length && user?.email && user?.emailConsent) {
      console.log(
        `🕒 Starting abandoned cart timer for ${user.email} (30 minutes)`
      );

      const timeout = setTimeout(() => {
        axios.post("/api/mailchimp/abandoned-cart", {
          email: user.email,
        });
        console.log("📧 Abandoned cart email trigger sent for:", user.email);
      }, 1 * 60 * 1000); // 30 minutes

      setCartTimeoutId(timeout);
    }

    return () => {
      if (cartTimeoutId) {
        console.log("🛑 Clearing previous abandoned cart timer");
        clearTimeout(cartTimeoutId);
      }
    };
  }, [cartItems]);
  const addToCart = (product) => {
    console.log("Adding product to cart:", product); // Debug log
    console.log("Current unit Price:", product.unitPrice); // Debug log

    // Store the last added item for highlighting in cart
    setLastAddedItem(product);

    setCartItems((prev) => {
      // Check if this exact product/variant combination exists in cart
      const existingProduct = prev.find((item) =>
        product.variantId
          ? item.id === product.id && item.variantId === product.variantId
          : item.id === product.id
      );

      if (existingProduct) {
        // Update quantity if product already exists
        return prev.map((item) =>
          (
            product.variantId
              ? item.id === product.id && item.variantId === product.variantId
              : item.id === product.id
          )
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new product with all necessary fields
        return [
          ...prev,
          {
            ...product,
            brandId: product.brandId || 1,
            quantity: 1,
            unitPrice:
              product.unitPrice || product.salePrice || product.price || 0,
            shippingFee: product.brandId.fees || 0,
            // Add variant information if present
            variantId: product.variantId || null,
            productId: product.productId || product._id, // Use productId from variant if available
          },
        ];
      }
    });
  };

  // Add updateQuantity function
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantities less than 1

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              // Make sure totalPrice is updated correctly
              totalPrice: item.unitPrice * newQuantity,
            }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetCart = () => {
    setCartItems([]); // Clear cartItems state
    localStorage.removeItem("cartItems"); // Clear localStorage
    setLastAddedItem(null); // Reset last added item
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        resetCart,
        updateQuantity,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
