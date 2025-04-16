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
    console.log("Cart items updated:", cartItems); // Debug log
  }, [cartItems]);

  const addToCart = (product) => {
    console.log("Adding product to cart:", product); // Debug log
    console.log(
      "Current sale Price:",
      product.salePrice,
      ">>> price normal:",
      product.price
    ); // Debug log
    setCartItems((prev) => {
      const existingProduct = prev.find((item) => item.id === product.id);
      if (existingProduct) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            brandId: product.brandId || 1,
            quantity: 1,
            unitPrice: product.unitPrice,
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

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
