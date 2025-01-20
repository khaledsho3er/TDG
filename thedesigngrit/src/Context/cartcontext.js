import React, { createContext, useState, useContext, useEffect } from "react";

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
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const formatPrice = (price) => {
    // Ensure price is a string before applying replace
    if (typeof price === "string") {
      return parseFloat(price.replace(",", ""));
    }
    // If price is already a number, return it as-is
    if (typeof price === "number") {
      return price;
    }
    // Fallback for unexpected types
    console.warn("Invalid price type:", price);
    return 0; // Default fallback value
  };

  const addToCart = (product) => {
    const formattedPrice = formatPrice(product.price);

    setCartItems((prev) => {
      const existingProduct = prev.find((item) => item.id === product.id);
      if (existingProduct) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, price: formattedPrice, quantity: 1 }];
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
