import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    console.log("Adding product to cart:", product); // Debug log
    console.log("Current unit Price:", product.unitPrice); // Debug log

    // Set this as the last added item
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

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Calculate total number of items in cart
  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        totalCartItems,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
