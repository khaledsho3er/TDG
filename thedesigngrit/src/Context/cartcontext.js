import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

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
  }, [cartItems]);

  const addToCart = (product) => {
    console.log("Adding product to cart:", product); // Debug log

    setCartItems((prev) => {
      // Check if the product already exists in the cart
      const existingProduct = prev.find((item) => item.id === product.id);
      console.log("Existing product in cart:", existingProduct); // Debug log

      if (existingProduct) {
        // If the product exists, update its quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If the product doesn't exist, add it as a new item
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Function to reset cart (clear localStorage and reset state)
  const resetCart = () => {
    setCartItems([]); // Clear cartItems state
    localStorage.removeItem("cartItems"); // Clear localStorage
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, resetCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
