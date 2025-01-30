import React, { useState } from "react";
import BillingForm from "./Billingform.jsx";
import ShippingForm from "./Shippingform.jsx";
import SummaryForm from "./ordersummary.jsx";
import PaymentForm from "./Paymentmethod.jsx";
import { useLocation } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests

function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    countryCode: "+1",
    country: "",
    city: "",
    zipCode: "",
  });

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    label: "",
    apartment: "",
    floor: "",
    country: "",
    city: "",
    zipCode: "",
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    paymentMethod: "card",
  });

  const handleBillingChange = (data) => {
    setBillingData(data);
  };

  const handleShippingChange = (data) => {
    setShippingData(data);
  };

  const handlePaymentChange = (data) => {
    setPaymentData(data);
  };

  const handlePaymentSubmit = async () => {
    // Extract vendorId from the first product in the cart (or handle multiple vendors if needed)
    const vendorId = cartItems.length > 0 ? cartItems[0].vendorId : null;

    if (!vendorId) {
      console.error("Vendor ID is missing in the cart items.");
      return;
    }

    // Combine all data for the API request
    const orderData = {
      billing: billingData,
      shipping: shippingData,
      payment: paymentData,
      cartItems: cartItems,
      subtotal: subtotal,
      shippingFee: shippingFee,
      total: total,
      vendorId: vendorId, // Include the vendorId in the order data
    };

    try {
      // Make a POST request to the API endpoint
      const response = await axios.post(
        "http://localhost:5000/api/orders/create",
        orderData
      );
      console.log("Order created successfully:", response.data);
      // Handle success (e.g., show a success message or redirect to a confirmation page)
    } catch (error) {
      console.error("Failed to create order:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  // Get the bill data passed from ShoppingCart
  const location = useLocation();
  const { cartItems, subtotal, shippingFee, total } = location.state || {};

  const steps = [
    {
      id: 1,
      label: "Billing Information",
      content: (
        <BillingForm
          billingData={billingData}
          onChange={handleBillingChange}
          billData={{ cartItems, subtotal, shippingFee, total }}
        />
      ),
    },
    {
      id: 2,
      label: "Shipping Information",
      content: (
        <ShippingForm
          shippingData={shippingData}
          onChange={handleShippingChange}
        />
      ),
    },
    {
      id: 3,
      label: "Order Summary",
      content: (
        <SummaryForm billData={{ cartItems, subtotal, shippingFee, total }} />
      ),
    },
    {
      id: 4,
      label: "Payment Method",
      content: (
        <PaymentForm
          onSubmit={handlePaymentSubmit}
          paymentData={paymentData}
          onChange={handlePaymentChange}
          billData={{ cartItems, subtotal, shippingFee, total }}
        />
      ),
    },
  ];

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2>{steps[currentStep - 1].label}</h2>
        {React.cloneElement(steps[currentStep - 1].content, {
          billData: { cartItems, subtotal, shippingFee, total },
        })}
        <div className="form-navigation">
          {currentStep < steps.length && (
            <button onClick={() => setCurrentStep(currentStep + 1)}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
