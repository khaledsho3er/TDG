import {
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useCart } from "../../Context/cartcontext"; // Import CartContext
import BillSummary from "./billingSummary"; // Assuming you have a BillSummary component
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function SummaryForm({ billData, onValidate }) {
  const { cartItems, updateQuantity, removeFromCart } = useCart(); // Add removeFromCart
  const { subtotal, shippingFee, total } = billData;
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // ✅ Pass checkbox validation function to parent
  useEffect(() => {
    if (onValidate) {
      onValidate(() => isChecked);
    }
  }, [isChecked, onValidate]);

  // Add handler for quantity changes
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    } else if (newQuantity === 0) {
      // Remove item if quantity would be 0
      removeFromCart(itemId);
    }
  };

  // Function to navigate to home page
  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <Box className="Ordersummary-bigcontainer">
      {/* First Row */}
      <Box className="Ordersummary-firstrow">
        <Box
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Product Details */}
          <Box
            className="Ordersummary-firstrow-firstcolumn"
            sx={{
              width: "95%",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#fff",
              border: "1px solid #f0f0f0",
            }}
          >
            <Box className="product-details">
              <Box
                className="product-header"
                sx={{
                  padding: "16px 20px",
                  backgroundColor: "#f9f9f9",
                  borderBottom: "1px solid #eee",
                  fontWeight: 600,
                  color: "#555",
                  fontSize: "14px",
                }}
              >
                <span>Product</span>
                <span>Unit Price</span>
                <span>Qty.</span>
                <span>Total Price</span>
              </Box>
              <Box
                className="product-content"
                sx={{
                  padding: "10px 20px",
                  maxHeight: "142px",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f0f0f0",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#6b7b58",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "#4e5b44",
                  },
                }}
              >
                {cartItems.length > 0 ? (
                  cartItems.map((product) => (
                    <Box
                      className="product-row"
                      key={product.id}
                      sx={{
                        padding: "12px 0",
                        borderBottom: "1px solid #f0f0f0",
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <Box
                        className="product-info"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <img
                          src={
                            `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.image}` ||
                            `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`
                          }
                          alt={product.name}
                          className="product-image"
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #f0f0f0",
                          }}
                        />
                        <Box>
                          <h4
                            className="product-title"
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              marginBottom: "4px",
                              color: "#333",
                            }}
                          >
                            {product.name}
                          </h4>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#777",
                              margin: "2px 0",
                              textAlign: "left",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            Color: {product.color}
                            <AiOutlineInfoCircle
                              style={{ cursor: "pointer" }}
                              title="View product details"
                              onClick={() =>
                                window.open(
                                  `https://thedesigngrit.com/product/${
                                    product._id ||
                                    product.productId ||
                                    product.id
                                  }`,
                                  "_blank"
                                )
                              }
                            />
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#777",
                              margin: "2px 0",
                              textAlign: "left",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            Size: {product.size}
                          </p>
                        </Box>
                      </Box>

                      <span
                        className="unit-price"
                        style={{
                          fontSize: "14px",
                          color: "#555",
                          fontWeight: 500,
                        }}
                      >
                        {product.unitPrice.toLocaleString()} E£
                      </span>

                      {/* Quantity with +/- controls */}
                      <Box
                        className="quantity-controls"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            product.quantity === 1
                              ? removeFromCart(product.id)
                              : handleQuantityChange(
                                  product.id,
                                  product.quantity - 1
                                )
                          }
                          sx={{
                            padding: "2px",
                            backgroundColor:
                              product.quantity === 1
                                ? "transparent"
                                : "#6B7B58",
                            color: product.quantity === 1 ? "#ccc" : "white",
                            "&:hover": {
                              backgroundColor:
                                product.quantity === 1
                                  ? "transparent"
                                  : "#5a6a47",
                            },
                            width: "20px",
                            height: "20px",
                            minWidth: "20px",
                          }}
                        >
                          {product.quantity === 1 ? (
                            <DeleteIcon fontSize="small" color="#ccc" />
                          ) : (
                            <RemoveIcon fontSize="small" />
                          )}
                        </IconButton>

                        <span
                          style={{
                            fontSize: "14px",
                            color: "#555",
                            fontWeight: 500,
                            margin: "0 8px",
                          }}
                        >
                          {product.quantity}
                        </span>

                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              product.id,
                              product.quantity + 1
                            )
                          }
                          sx={{
                            padding: "2px",
                            backgroundColor: "#6B7B58",
                            color: "white",
                            "&:hover": { backgroundColor: "#5a6a47" },
                            width: "20px",
                            height: "20px",
                            minWidth: "20px",
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <span
                        className="total-price"
                        style={{
                          fontSize: "14px",
                          color: "#333",
                          fontWeight: 600,
                        }}
                      >
                        {(
                          product.unitPrice * product.quantity
                        ).toLocaleString()}
                        E£
                      </span>
                    </Box>
                  ))
                ) : (
                  // Empty cart message and Go Home button
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "30px 0",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Montserrat",
                        color: "#555",
                        marginBottom: "16px",
                      }}
                    >
                      Your cart is empty now
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleGoHome}
                      sx={{
                        backgroundColor: "#6B7B58",
                        color: "white",
                        fontFamily: "Montserrat",
                        textTransform: "none",
                        padding: "8px 24px",
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "#5a6a47",
                        },
                      }}
                    >
                      Go Home
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Shipping Details - Only show if cart has items */}
            {cartItems.length > 0 && (
              <Box
                className="shipping-details"
                sx={{
                  padding: "16px 20px",
                  backgroundColor: "#f9f9f9",
                  borderTop: "1px solid #eee",
                }}
              >
                <ul
                  style={{
                    listStyleType: "none",
                    padding: 0,
                    margin: 0,
                    fontSize: "13px",
                    color: "#666",
                  }}
                >
                  <li
                    style={{
                      marginBottom: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ color: "#6b7b58" }}>•</span> Shipping to
                    Egypt
                  </li>
                  <li
                    style={{
                      marginBottom: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ color: "#6b7b58" }}>•</span> Ship in 1-2
                    weeks
                  </li>
                  {cartItems.length > 0 && (
                    <li
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ color: "#6b7b58" }}>•</span> Sold and
                      shipped by <strong>{cartItems[0].brandName}</strong>
                    </li>
                  )}
                </ul>
                <FormControlLabel
                  style={{
                    marginTop: "10px",
                  }}
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "4px",
                        fontFamily: "Montserrat",
                        fontSize: "13px",
                        "& a": {
                          textDecoration: "underline",
                          color: "#2962ff",
                        },
                      }}
                    >
                      I have read and accept the{" "}
                      <a
                        href="/policy?section=Full Terms of Service Agreement"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        terms and conditions
                      </a>
                      .
                    </Typography>
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    "& .MuiFormControlLabel-label": {
                      fontFamily: "Montserrat, san-serif",
                      fontSize: "13px",
                      color: "#333",
                      textAlign: "left",
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
        {/* Cart Summary - Always show, even if cart is empty */}
        <BillSummary
          cartItems={cartItems}
          subtotal={subtotal}
          shippingFee={shippingFee}
          total={total}
        />
      </Box>
    </Box>
  );
}

export default SummaryForm;
