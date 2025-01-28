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
import React, { useState } from "react";
import BillSummary from "./billingSummary";
// import { useCart } from "../../Context/cartcontext";

function PaymentForm({ onSubmit, paymentData, onChange, billData }) {
  const [cardOptions, setCardOptions] = useState([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: paymentData.cardNumber,
    expiry: paymentData.expiry,
    cvv: paymentData.cvv,
  });
  const [paymentMethod, setPaymentMethod] = useState(paymentData.paymentMethod);

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    const updatedCardDetails = { ...cardDetails, [name]: value };

    setCardDetails(updatedCardDetails);
    onChange({ ...paymentData, ...updatedCardDetails, paymentMethod });
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setCardOptions(["card", "fawry", "valu", "cod"]);
    setPaymentMethod(method);
    onChange({ ...paymentData, paymentMethod: method });
  };

  const handlePayNow = () => {
    onSubmit(); // Trigger the submission in the parent component
  };

  return (
    <Box className="paymentmethod-container">
      <Box className="paymentmethod-firstrow-firstcolumn">
        <FormControl fullWidth>
          <RadioGroup
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
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
                  name="number"
                  InputLabelProps={{ className: "montserrat-font" }}
                  className="montserrat-font"
                  value={cardDetails.number}
                  onChange={handleCardDetailsChange}
                />
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="MM/YY"
                    name="expiry"
                    InputLabelProps={{ className: "montserrat-font" }}
                    className="montserrat-font"
                    value={cardDetails.expiry}
                    onChange={handleCardDetailsChange}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="CVV"
                    name="cvv"
                    type="password"
                    InputLabelProps={{ className: "montserrat-font" }}
                    className="montserrat-font"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  className="montserrat-font"
                  onClick={handlePayNow}
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
        cartItems={billData.cartItems}
        subtotal={billData.subtotal}
        shippingFee={billData.shippingFee}
        total={billData.total}
      />
    </Box>
  );
}

export default PaymentForm;
