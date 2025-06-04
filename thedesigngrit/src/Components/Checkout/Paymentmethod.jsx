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
// import { useCart } from "../../Context/cartcontext";

function PaymentForm({
  onSubmit,
  paymentData,
  onChange,
  billData,
  errors = {},
  validateOnChange = false,
}) {
  const [cardOptions, setCardOptions] = useState([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: paymentData.cardNumber,
    expiry: paymentData.expiry,
    cvv: paymentData.cvv,
  });
  const [paymentMethod, setPaymentMethod] = useState(paymentData.paymentMethod);
  const [showCOD, setShowCOD] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  // // Add CSS for error styling
  // const errorStyle = {
  //   border: "1px solid red",
  //   backgroundColor: "rgba(255, 0, 0, 0.05)",
  // };

  // const errorMessageStyle = {
  //   color: "red",
  //   fontSize: "12px",
  //   marginTop: "4px",
  //   textAlign: "left",
  // };
  useEffect(() => {
    if (billData && billData.total) {
      setShowCOD(billData.total <= 10000);

      // If COD is selected but no longer available, switch to card payment
      if (paymentMethod === "cod" && billData.total > 10000) {
        setPaymentMethod("card");
        onChange({ ...paymentData, paymentMethod: "card" });
      }
    }
  }, [billData, paymentData, onChange, paymentMethod]);
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
    setPaymentError(null); // Clear any previous errors when changing payment method
  };

  const handlePayNow = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);

      if (paymentMethod === "card") {
        if (!billData?.billingDetails) {
          throw new Error(
            "Billing information is missing. Please complete the billing form first."
          );
        }
        const billingDetails = billData.billingDetails;
        const requiredFields = {
          first_name: "First Name",
          last_name: "Last Name",
          email: "Email",
          phone_number: "Phone Number",
          street: "Street Address",
          city: "City",
          country: "Country",
        };
        const missingFields = Object.entries(requiredFields)
          .filter(([key]) => !billingDetails[key])
          .map(([_, label]) => label);
        if (missingFields.length > 0) {
          throw new Error(
            `Please complete the following billing information: ${missingFields.join(
              ", "
            )}`
          );
        }
        const paymentData = {
          total: billData.total || 0,
          billingDetails: billingDetails,
          cartItems: billData.cartItems || [],
          shippingDetails: billData.shippingDetails || {},
        };
        const { iframeUrl } = await paymobService.initializePayment(
          paymentData
        );
        setIframeUrl(iframeUrl);
        // Optionally, add event listener for payment completion here
        window.addEventListener("message", (event) => {
          if (event.origin !== "https://accept.paymob.com") return;
          const { success, error_occured } = event.data;
          if (success) {
            onSubmit();
          } else if (error_occured) {
            setPaymentError("Payment failed. Please try again.");
          }
        });
      } else if (paymentMethod === "cod") {
        onSubmit();
      }
    } catch (error) {
      setPaymentError(
        error.message || "Payment initialization failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };
  //
  return (
    <Box className="paymentmethod-container">
      {/* Always render the iframe if iframeUrl is set */}
      {iframeUrl ? (
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
      ) : (
        // Show the payment form if iframeUrl is not set
        <Box>
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
                    {paymentError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {paymentError}
                      </Alert>
                    )}
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Card Number"
                      name="cardNumber"
                      InputLabelProps={{ className: "montserrat-font" }}
                      className="montserrat-font"
                      value={cardDetails.cardNumber}
                      onChange={handleCardDetailsChange}
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber}
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
                        error={!!errors.expiry}
                        helperText={errors.expiry}
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
                        error={!!errors.cvv}
                        helperText={errors.cvv}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      className="montserrat-font"
                      onClick={handlePayNow}
                      disabled={isProcessing}
                      sx={{ mt: 2 }}
                    >
                      {isProcessing ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Pay Now"
                      )}
                    </Button>
                  </Box>
                )}

                {/* Other Payment Options */}
                <FormControlLabel
                  sx={{ borderBottom: "1px solid black" }}
                  value="valu"
                  control={<Radio />}
                  label={
                    <span className="montserrat-font">
                      Valu, Halan, Saholha
                    </span>
                  }
                />
                <FormControlLabel
                  sx={{ borderBottom: "1px solid black" }}
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
                  <Box
                    sx={{
                      padding: "8px 0",
                      color: "#888",
                      fontStyle: "italic",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    className="montserrat-font"
                  >
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        display: "inline-block",
                      }}
                    ></span>
                    Cash on Delivery unavailable for orders over 10,000 EGP
                  </Box>
                )}
              </RadioGroup>
            </FormControl>
          </Box>
          <Button onClick={handlePayNow}>Pay Now</Button>
        </Box>
      )}
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
