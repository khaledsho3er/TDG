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
        // Check if billData and billingDetails exist
        if (!billData?.billingDetails) {
          throw new Error(
            "Billing information is missing. Please complete the billing form first."
          );
        }

        // Map the billing details to match the expected format
        const billingDetails = {
          first_name:
            billData.billingDetails.firstName ||
            billData.billingDetails.first_name,
          last_name:
            billData.billingDetails.lastName ||
            billData.billingDetails.last_name,
          email: billData.billingDetails.email,
          street:
            billData.billingDetails.address || billData.billingDetails.street,
          building: billData.billingDetails.building || "NA",
          phone_number:
            billData.billingDetails.phoneNumber ||
            billData.billingDetails.phone_number,
          city: billData.billingDetails.city,
          country: billData.billingDetails.country,
          state: billData.billingDetails.state || "NA",
          floor: billData.billingDetails.floor || "NA",
          apartment: billData.billingDetails.apartment || "NA",
        };

        // Validate required fields
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

        // Initialize Paymob payment
        const paymentData = {
          total: billData.total || 0,
          billingDetails: billingDetails,
        };

        console.log("Sending payment data:", paymentData); // Debug log

        const { iframeUrl } = await paymobService.initializePayment(
          paymentData
        );

        // Create Paymob iframe
        const iframe = document.createElement("iframe");
        iframe.src = iframeUrl;
        iframe.style.width = "100%";
        iframe.style.height = "600px";
        iframe.style.border = "none";

        // Replace the payment form with the iframe
        const paymentContainer = document.querySelector(
          ".paymentmethod-card-details"
        );
        if (paymentContainer) {
          paymentContainer.innerHTML = "";
          paymentContainer.appendChild(iframe);
        }

        // Listen for payment completion
        window.addEventListener("message", (event) => {
          if (event.origin !== "https://accept.paymob.com") return;

          const { success, error_occured } = event.data;
          if (success) {
            onSubmit(); // Trigger the submission in the parent component
          } else if (error_occured) {
            setPaymentError("Payment failed. Please try again.");
          }
        });
      } else if (paymentMethod === "cod") {
        // Handle Cash on Delivery
        onSubmit();
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error.message || "Payment initialization failed. Please try again."
      );
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
                <span className="montserrat-font">Valu, Halan, Saholha</span>
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
