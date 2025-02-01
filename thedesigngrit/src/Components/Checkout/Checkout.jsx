import React, { useState, useContext } from "react";
import BillingForm from "./Billingform.jsx";
import ShippingForm from "./Shippingform.jsx";
import SummaryForm from "./ordersummary.jsx";
import PaymentForm from "./Paymentmethod.jsx";
import { useLocation } from "react-router-dom";
import { useCart } from "../../Context/cartcontext.js";
import { UserContext, useUser } from "../../utils/userContext";
import axios from "axios"; // Import axios for making HTTP requests

function Checkout() {
  const { userSession, setUserSession, logout } = useUser();
  const { cartItems, resetCart } = useCart(); //  Get cart items from CartContexts
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

  const shippingFee = 200;

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
    if (!cartItems || cartItems.length === 0) {
      console.error("Cart is empty.");
      return;
    }

    // ✅ Group items by brand ID
    const groupedOrders = cartItems.reduce((acc, item) => {
      const brandId = item.brandId;
      if (!acc[brandId]) {
        acc[brandId] = [];
      }
      acc[brandId].push({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      });
      return acc;
    }, {});
    // Parent order reference (for tracking user purchases)
    const parentOrderId = `ORDER-${Date.now()}`;

    try {
      // Loop through each vendor's order and send a request
      const orderRequests = Object.keys(groupedOrders).map(async (brandId) => {
        const orderData = {
          parentOrderId, // Single order ID for user tracking
          customerId: userSession.id, // Ensure this is taken from the authenticated use
          billingDetails: billingData,
          shippingDetails: shippingData,
          paymentDetails: paymentData,
          cartItems: groupedOrders[brandId], // Only this vendor's items
          subtotal: groupedOrders[brandId].reduce(
            (sum, item) => sum + item.totalPrice,
            0
          ),
          shippingFee, // Modify if each vendor has different shipping fees
          total:
            groupedOrders[brandId].reduce(
              (sum, item) => sum + item.totalPrice,
              0
            ) + shippingFee,
          orderStatus: "Pending",
        };
        console.log("Creating order:", orderData);

        return axios.post("http://localhost:5000/api/orders/", orderData);
      });

      // Wait for all orders to be sent
      const responses = await Promise.all(orderRequests);
      console.log(
        "Orders created successfully:",
        responses.map((res) => res.data)
      );

      // Reset the cart after successful order placement
      resetCart();
      // Redirect or show confirmation
    } catch (error) {
      console.error("Failed to create orders:", error);
    }
  };

  // Get the bill data passed from ShoppingCart
  // const location = useLocation();
  // const { cartItems, subtotal, shippingFee, total, resetCart } =
  //   location.state || {};

  const subtotal = cartItems?.length
    ? cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      )
    : 0;

  const total = subtotal + (shippingFee || 0);

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
