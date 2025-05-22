import { Box, FormControlLabel, Checkbox, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useCart } from "../../Context/cartcontext"; // Import CartContext
import BillSummary from "./billingSummary"; // Assuming you have a BillSummary component
function SummaryForm({ billData, onValidate }) {
  const { cartItems } = useCart(); // Get cart items from context
  const { subtotal, shippingFee, total } = billData;
  const [isChecked, setIsChecked] = useState(false);

  // ✅ Pass checkbox validation function to parent
  useEffect(() => {
    if (onValidate) {
      onValidate(() => isChecked);
    }
  }, [isChecked, onValidate]);

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
                {cartItems.map((product) => (
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
                        src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.image}`}
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
                          }}
                        >
                          Color: {product.color}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#777",
                            margin: "2px 0",
                            textAlign: "left",
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
                      {product.unitPrice} LE
                    </span>

                    <span
                      className="quantity"
                      style={{
                        fontSize: "14px",
                        color: "#555",
                        fontWeight: 500,
                      }}
                    >
                      {product.quantity}
                    </span>

                    <span
                      className="total-price"
                      style={{
                        fontSize: "14px",
                        color: "#333",
                        fontWeight: 600,
                      }}
                    >
                      {(product.unitPrice * product.quantity).toLocaleString()}{" "}
                      LE
                    </span>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Shipping Details */}
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
                  <span style={{ color: "#6b7b58" }}>•</span> Shipping to Egypt
                </li>
                <li
                  style={{
                    marginBottom: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ color: "#6b7b58" }}>•</span> Ship in 1-2 weeks
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ color: "#6b7b58" }}>•</span> Sold and shipped
                  by <strong>{cartItems[0].brandName}</strong>
                </li>
              </ul>
              <FormControlLabel
                style={{
                  marginTop: "10px",
                  marginLeft: "-20px",
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
                  columnGap: "16px",
                  paddingLeft: "20px",
                  "& .MuiFormControlLabel-label": {
                    fontFamily: "Montserrat, san-serif",
                    fontSize: "13px",
                    color: "#333",
                    textAlign: "left",
                  },
                }}
              />
            </Box>
          </Box>
          {/* <Box className="Ordersummary-thirdrow">
            
          </Box> */}
        </Box>
        {/* Cart Summary */}
        <BillSummary
          cartItems={cartItems}
          subtotal={subtotal}
          shippingFee={shippingFee}
          total={total}
        />
      </Box>

      {/* Terms and Conditions */}
    </Box>
  );
}

export default SummaryForm;
