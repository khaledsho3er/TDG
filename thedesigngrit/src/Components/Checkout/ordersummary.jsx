import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import PaymentIcons from "../paymentsIcons";

function SummaryForm() {
  const [product, setProduct] = useState(null);

  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Fetch data from product.json
    const fetchCartDetails = async () => {
      try {
        const response = await fetch("/json/product.json");
        const data = await response.json();

        const fetchedSubtotal = data.subtotal || 0;
        const fetchedShipping = data.shipping || 0;

        setSubtotal(fetchedSubtotal);
        setShipping(fetchedShipping);
        setTotal(fetchedSubtotal + fetchedShipping);
      } catch (error) {
        console.error("Failed to fetch cart details:", error);
      }
    };

    fetchCartDetails();
  }, []);

  useEffect(() => {
    // Fetch product data from the JSON file
    const fetchData = async () => {
      try {
        const response = await fetch("/json/product.json");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchData();
  }, []);

  if (!product) {
    return <div>Loading...</div>; // Add a loading state
  }

  return (
    <Box className="Ordersummary-bigcontainer">
      {/* first box row */}
      <Box className="Ordersummary-firstrow">
        {/* 2 boxes in a row */}
        <Box className="Ordersummary-firstrow-firstcolumn">
          {/* Product Details */}
          <Box className="product-details">
            <Box className="product-header">
              <span>Product</span>
              <span>Unit Price</span>
              <span>Qty.</span>
              <span>Total Price</span>
            </Box>
            <Box className="product-content">
              {/* Product Row */}
              <Box className="product-row">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <Box className="product-info">
                  <h4 className="product-title">{product.name}</h4>
                  <p className="product-description">{product.description}</p>
                  <p>Upholstery: {product.upholstery}</p>
                  <p>Colour: {product.colour}</p>
                </Box>
                <span className="unit-price">{product.unitPrice} LE</span>
                <span className="quantity">{product.quantity}</span>
                <span className="total-price">
                  {product.unitPrice * product.quantity} LE
                </span>
              </Box>
            </Box>
          </Box>

          {/* Shipping Details */}
          <Box className="shipping-details">
            <ul>
              <li>Shipping to Egypt</li>
              <li>Ship in {product.shippingTime} weeks</li>
              <li>
                Sold and shipped by <strong>{product.seller}</strong>
              </li>
            </ul>
          </Box>
        </Box>
        <Box className="Ordersummary-firstrow-secondcolumn">
          {/* 2 boxes in a column */}
          <Box className="Ordersummary-firstrow-secondcolumn-firstrow">
            {/* Cart Summary */}
            <Box className="ordersummary-total">
              <h1 className="ordersummary-cart-title">Your Cart</h1>
              <div className="ordersummary-cart-summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="ordersummary-cart-summary-row">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="ordersummary-cart-summary-total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </Box>
          </Box>
          <Box className="Ordersummary-firstrow-secondcolumn-secondrow">
            <PaymentIcons />
          </Box>
        </Box>
      </Box>
      {/* second box have two boxes in a row */}
      <Box className="Ordersummary-secondrow">
        <Box className="Ordersummary-secondrow-firstcolumn">
          <h1>Billing Information</h1>
          <p>hena el ba2y</p>
        </Box>
        <Box className="Ordersummary-secondrow-secondcolumn">
          <h1>Shipping Information</h1>
          <p>hena el ba2y</p>
        </Box>
      </Box>
      {/* one row box */}
      <Box className="Ordersummary-thirdrow">
        <FormControlLabel
          control={<Checkbox />}
          label="I have read, understand and accept the Terms and Conditions of Sale. I hereby accept that the data associated with this account I have registered will be stored and applied to my future orders on TheDesignGrit.com. I understand that I will be able to review these data before my next orders. Should the General Conditions of Sale change, I will be explicitly asked to accept the new terms."
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "16px", // Adjust spacing between checkbox and label
            paddingLeft: "20px",
            "& .MuiFormControlLabel-label": {
              fontFamily: "Montserrat, san-sarif", // Change to your desired font
              fontSize: "13px", // Adjust font size
              color: "#333", // Adjust font color
              textAlign: "left",
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default SummaryForm;
