// paymentMethod.jsx
import React, { useState, useEffect } from "react";
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
  Alert,
  CircularProgress,
} from "@mui/material";
import BillSummary from "./billingSummary";
import paymobService from "../../services/paymobService";

function PaymentForm({
  onSubmit,
  paymentData,
  onChange,
  billData,
  errors = {},
}) {
  const [cardOptions, setCardOptions] = useState([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: paymentData.cardNumber || "",
    expiry: paymentData.expiry || "",
    cvv: paymentData.cvv || "",
  });
  const [paymentMethod, setPaymentMethod] = useState(
    paymentData.paymentMethod || "card"
  );
  const [showCOD, setShowCOD] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);

  useEffect(() => {
    if (billData && billData.total) {
      setShowCOD(billData.total <= 10000);
      if (paymentMethod === "cod" && billData.total > 10000) {
        setPaymentMethod("card");
        onChange({ ...paymentData, paymentMethod: "card" });
      }
    }
  }, [billData, paymentData, onChange, paymentMethod]);

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...cardDetails, [name]: value };
    setCardDetails(updated);
    onChange({ ...paymentData, ...updated, paymentMethod });
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setCardOptions(["card", "fawry", "valu", "cod"]);
    setPaymentMethod(method);
    onChange({ ...paymentData, paymentMethod: method });
    setPaymentError(null);
  };

  const handlePayNow = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);

      if (paymentMethod === "card") {
        if (!billData?.billingDetails) {
          throw new Error("Please complete the billing form first.");
        }

        const billing = billData.billingDetails;
        const required = [
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "street",
          "city",
          "country",
        ];

        const missing = required.filter((field) => !billing[field]);
        if (missing.length > 0) {
          throw new Error(`Missing billing fields: ${missing.join(", ")}`);
        }

        const { iframeUrl } = await paymobService.initializePayment({
          total: billData.total,
          billingDetails: billing,
          cartItems: billData.cartItems,
          shippingDetails: billData.shippingDetails,
        });

        setIframeUrl(iframeUrl);

        window.addEventListener("message", (event) => {
          if (event.origin !== "https://accept.paymob.com") return;
          const { success, error_occured } = event.data;
          if (success) onSubmit();
          else if (error_occured) setPaymentError("Payment failed.");
        });
      } else if (paymentMethod === "cod") {
        onSubmit();
      }
    } catch (error) {
      setPaymentError(error.message || "Payment failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box className="paymentmethod-container">
      <Box className="paymentmethod-firstrow-firstcolumn">
        <FormControl fullWidth>
          <RadioGroup
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          >
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
                {paymentError && <Alert severity="error">{paymentError}</Alert>}
                <TextField
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  margin="normal"
                />
                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    label="MM/YY"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleCardDetailsChange}
                    error={!!errors.expiry}
                    helperText={errors.expiry}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="CVV"
                    name="cvv"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    error={!!errors.cvv}
                    helperText={errors.cvv}
                    margin="normal"
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  sx={{ mt: 2 }}
                >
                  {isProcessing ? <CircularProgress size={24} /> : "Pay Now"}
                </Button>
              </Box>
            )}
            <FormControlLabel
              value="valu"
              control={<Radio />}
              label={
                <span className="montserrat-font">Valu, Halan, Saholha</span>
              }
            />
            <FormControlLabel
              value="fawry"
              control={<Radio />}
              label={<span className="montserrat-font">Fawry Pay</span>}
            />
            {showCOD ? (
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label={
                  <span className="montserrat-font">Cash on Delivery</span>
                }
              />
            ) : (
              <Box sx={{ color: "#888", fontStyle: "italic", mt: 1 }}>
                Cash on Delivery unavailable for orders over 10,000 EGP
              </Box>
            )}
          </RadioGroup>
        </FormControl>
      </Box>
      <BillSummary
        cartItems={billData.cartItems}
        subtotal={billData.subtotal}
        shippingFee={billData.shippingFee}
        total={billData.total}
      />
      {iframeUrl && (
        <iframe
          src={iframeUrl}
          style={{
            width: "100%",
            height: "600px",
            border: "none",
            marginTop: "20px",
          }}
          allow="camera *; microphone *"
          title="Paymob Payment"
        />
      )}
    </Box>
  );
}

export default PaymentForm;
