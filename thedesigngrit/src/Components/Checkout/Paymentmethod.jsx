import {
  Box,
  FormControl,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  FormControlLabel,
  Button,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import BillSummary from "./billingSummary";
import { useCart } from "../../Context/cartcontext";

function PaymentForm({ billData }) {
  const [cardOptions, setCardOptions] = useState([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Fetch card options from the database
  useEffect(() => {
    const fetchCardOptions = async () => {
      try {
        const response = await fetch("/api/card-options"); // Adjust the endpoint
        const data = await response.json();
        setCardOptions(data);
      } catch (error) {
        console.error("Failed to fetch card options:", error);
      }
    };

    fetchCardOptions();
  }, []);

  const { cartItems } = useCart(); // Get cart items from context
  const { subtotal, shippingFee, total } = billData; // Destructure the billData

  return (
    <Box className="paymentmethod-container">
      <Box className="paymentmethod-firstrow-firstcolumn">
        <FormControl fullWidth>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {/* Card Payment Option */}
            <Box className="paymentmethod-radio-dropdown">
              <FormControlLabel
                value="card"
                control={<Radio />}
                label={<span className="horizon-font">Card</span>}
              />
              {paymentMethod === "card" && (
                <FormControl className="paymentmethod-dropdown">
                  <Select
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    displayEmpty
                    className="montserrat-font"
                  >
                    <MenuItem value="" disabled>
                      Card Type
                    </MenuItem>
                    {cardOptions.map((card, index) => (
                      <MenuItem key={index} value={card.type}>
                        {card.type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>

            {paymentMethod === "card" && (
              <Box className="paymentmethod-card-details">
                <TextField
                  fullWidth
                  margin="normal"
                  label="Card Number"
                  InputLabelProps={{ className: "montserrat-font" }}
                  className="montserrat-font"
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, number: e.target.value })
                  }
                />
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="MM/YY"
                    InputLabelProps={{ className: "montserrat-font" }}
                    className="montserrat-font"
                    value={cardDetails.expiry}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, expiry: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="CVV"
                    type="password"
                    InputLabelProps={{ className: "montserrat-font" }}
                    className="montserrat-font"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvv: e.target.value })
                    }
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  className="montserrat-font"
                >
                  Pay Now
                </Button>
              </Box>
            )}

            {/* Other Payment Options */}
            <FormControlLabel
              sx={{ borderBottom: "1px solid black" }}
              value="valu"
              control={<Radio />}
              label={
                <span className="montserrat-font">Valu, Halan, Saholha</span>
              }
            />
            <FormControlLabel
              sx={{ borderBottom: "1px solid black" }}
              value="fawry"
              control={<Radio />}
              label={<span className="montserrat-font">Fawry Pay</span>}
            />
            <FormControlLabel
              value="cod"
              control={<Radio />}
              label={<span className="montserrat-font">Cash on Delivery</span>}
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <BillSummary
        cartItems={cartItems}
        subtotal={subtotal}
        shippingFee={shippingFee}
        total={total}
      />
    </Box>
  );
}

export default PaymentForm;
