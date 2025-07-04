import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  IconButton,
} from "@mui/material";
import BillSummary from "./billingSummary";
import paymobService from "../../services/paymobService";
import { useUser } from "../../utils/userContext";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";

function PaymentForm({
  onSubmit,
  onSuccess,
  onFailed,
  resetCart,
  paymentData,
  onChange,
  billData,
  errors = {},
}) {
  const [paymentMethod, setPaymentMethod] = useState(paymentData.paymentMethod);
  const [showCOD, setShowCOD] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const { userSession } = useUser();
  const [iframeModalOpen, setIframeModalOpen] = useState(false);
  const location = useLocation();

  // Check URL for payment success
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get("order");
    const status = searchParams.get("status");

    if (orderId && status === "success") {
      onSuccess(); // ✅ Trigger success popup in parent
      // Clear the URL parameters without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location, onSuccess]);
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

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://accept.paymob.com") return;
      const { success, error_occured } = event.data;
      if (success) {
        onSubmit();
        onSuccess(); // ✅ Trigger success popup in parent
        resetCart(); // Reset cart after successful payment
      } else if (error_occured) {
        setPaymentError("Payment failed. Please try again.");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSubmit, onSuccess, resetCart]);

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
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
        const shippingDetails = billData.shippingDetails;
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

        // Check if cart items have the required properties
        if (!billData.cartItems || billData.cartItems.length === 0) {
          throw new Error("Your cart is empty. Please add items to your cart.");
        }

        // Validate cart items have the necessary properties
        const invalidItems = billData.cartItems.filter(
          (item) => !item.name || typeof item.unitPrice === "undefined"
        );

        if (invalidItems.length > 0) {
          console.error("Invalid cart items:", invalidItems);
          throw new Error(
            "Some items in your cart are invalid. Please try again or contact support."
          );
        }
        // Ensure each cart item has productId and brandId
        const enhancedCartItems = billData.cartItems.map((item) => {
          // Extract the correct productId
          const productId = item.productId || item.id;

          // Extract the correct brandId
          let brandId;
          if (typeof item.brandId === "object" && item.brandId !== null) {
            brandId = item.brandId._id || item.brandId.id;
          } else {
            brandId = item.brandId;
          }

          return {
            ...item,
            productId,
            brandId,
          };
        });

        console.log("Enhanced cart items with proper IDs:", enhancedCartItems);
        console.log("Billing details in paymentMethod:", billingDetails);
        console.log("Shipping details in paymentMethod:", shippingDetails);
        const subtotal = billData.subtotal || 0;
        const shippingFee = billData.shippingFee || 0;
        const taxAmount = +(subtotal * 0.14).toFixed(2);
        const finalTotal = +(subtotal + taxAmount + shippingFee).toFixed(2);
        const paymentData = {
          total: finalTotal,
          billingDetails: billingDetails,
          cartItems: enhancedCartItems || [],
          shippingDetails: shippingDetails || {},
          subtotal,
          taxAmount,
          shippingFee,
        };

        console.log("Sending payment data:", paymentData);

        try {
          const result = await paymobService.initializePayment(
            paymentData,
            userSession
          );
          console.log("Result from initializePayment:", result);

          // Check if we got a valid iframe URL
          if (!result || !result.iframeUrl) {
            throw new Error(
              "Payment gateway URL not received. Please try again later."
            );
          }

          // Set the iframe URL
          setIframeUrl(result.iframeUrl);
          setIframeModalOpen(true);
          onSuccess(); // ✅ Trigger success popup in parent
          resetCart();
          console.log("Setting iframe URL to:", result.iframeUrl);
        } catch (paymentError) {
          console.error("Payment initialization failed:", paymentError);
          throw new Error(
            paymentError.message ||
              "Failed to connect to payment gateway. Please try again later."
          );
        }
      } else if (paymentMethod === "cod") {
        // Handle Cash on Delivery
        console.log("COD selected, calling onSubmit()");
        await onSubmit();
        console.log("onSubmit finished, setting showSuccessPopup");
        onSuccess(); // ✅ Trigger success popup in parent
      }
    } catch (error) {
      setPaymentError(
        error.message || "Payment initialization failed. Please try again."
      );
      if (onFailed) onFailed(); // <-- show the failed popup

      console.error("Payment error details:", {
        error: error,
        message: error.message,
        stack: error.stack,
        billData: billData,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // const handleClosePopup = () => {
  //   setShowSuccessPopup(false);
  //   navigate("/");
  // };

  const handleCloseIframeModal = () => {
    setIframeModalOpen(false);
    setIframeUrl(null); // This will unmount the iframe
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
            <FormControlLabel
              value="card"
              control={<Radio />}
              label={<span className="horizon-font">Pay with Card</span>}
              sx={{ borderBottom: "1px solid black", pb: 1 }}
            />
            {/* Display payment errors prominently */}
            {paymentError && (
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  bgcolor: "rgba(244, 67, 54, 0.1)",
                  color: "#f44336",
                  borderRadius: "8px",
                  borderLeft: "4px solid #f44336",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <Typography variant="body1">{paymentError}</Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: "0.85rem" }}>
                  If this problem persists, please contact our support team.
                </Typography>
              </Box>
            )}

            {/* Paymob iframe for card payments */}
            {paymentMethod === "card" && iframeUrl && (
              <Box className="payment-iframe-container">
                <Typography
                  variant="subtitle2"
                  sx={{ p: 1, bgcolor: "#f5f5f5" }}
                >
                  Payment Gateway
                </Typography>
                <iframe
                  src={iframeUrl}
                  style={{
                    width: "100%",
                    height: "600px",
                    border: "none",
                    display: "block",
                  }}
                  allow="camera; microphone; accelerometer; gyroscope; payment"
                  allowFullScreen
                  title="Paymob Payment"
                  id="paymob-iframe"
                  onLoad={() => console.log("Iframe loaded")}
                  onError={(e) => console.error("Iframe error:", e)}
                  referrerPolicy="origin"
                  sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
                />
              </Box>
            )}

            {/* Payment buttons */}
            {paymentMethod === "card" && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  className="montserrat-font"
                  onClick={handlePayNow}
                  disabled={isProcessing || iframeUrl}
                  sx={{
                    mt: 2,
                    backgroundColor: "#6B7B58",
                    "&:hover": { backgroundColor: "#5a6a47" },
                    display: iframeUrl ? "none" : "inline-flex",
                  }}
                >
                  {isProcessing ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Pay Now"
                  )}
                </Button>
                {isProcessing && !iframeUrl && (
                  <Typography sx={{ mt: 2 }}>
                    Preparing payment gateway...
                  </Typography>
                )}
              </Box>
            )}

            {/* COD button */}
            {paymentMethod === "cod" && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  className="montserrat-font"
                  onClick={handlePayNow}
                  sx={{
                    mt: 2,
                    backgroundColor: "#6B7B58",
                    "&:hover": { backgroundColor: "#5a6a47" },
                  }}
                >
                  Complete Order
                </Button>
              </Box>
            )}
            {/* Cash on Delivery Option */}
            {showCOD ? (
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label={
                  <span className="montserrat-font">Cash on Delivery</span>
                }
                sx={{ pt: 1 }}
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
                  pt: 1,
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
      <Dialog
        open={iframeModalOpen}
        onClose={handleCloseIframeModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Complete Payment
          <IconButton onClick={handleCloseIframeModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ p: 2 }}>
          <iframe
            src={iframeUrl}
            style={{
              width: "100%",
              height: "600px",
              border: "none",
              display: "block",
            }}
            allow="camera; microphone; accelerometer; gyroscope; payment"
            allowFullScreen
            title="Paymob Payment"
            id="paymob-iframe"
            referrerPolicy="origin"
            sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
          />
        </Box>
      </Dialog>
    </Box>
  );
}

export default PaymentForm;
