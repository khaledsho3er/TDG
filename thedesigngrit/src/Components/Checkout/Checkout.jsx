import React, { useState, useRef, useContext } from "react";
import BillingForm from "./Billingform.jsx";
import ShippingForm from "./Shippingform.jsx";
import SummaryForm from "./ordersummary.jsx";
import PaymentForm from "./Paymentmethod.jsx";
// import { useLocation } from "react-router-dom";
import { useCart } from "../../Context/cartcontext.js";
import { useUser } from "../../utils/userContext";
import axios from "axios"; // Import axios for making HTTP requests
import OrderSentPopup from "../successMsgs/orderSubmit.jsx";

function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const { cartItems, resetCart } = useCart();
  const { userSession } = useUser();
  const validateCheckboxRef = useRef(null);

  // Add state to track form submission attempts
  const [attemptedSubmit, setAttemptedSubmit] = useState({
    billing: false,
    shipping: false,
    summary: false,
  });

  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userCountryCode: "eg",
    country: "",
    city: "",
    address: "",
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

  const validateBillingData = async () => {
    // Mark billing form as attempted
    setAttemptedSubmit((prev) => ({ ...prev, billing: true }));

    // Get a reference to the BillingForm component's validateForm function
    if (billingFormRef.current && billingFormRef.current.validateForm) {
      return await billingFormRef.current.validateForm();
    }

    // Fallback validation
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      city,
      address,
      zipCode,
    } = billingData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !country ||
      !city ||
      !address ||
      !zipCode
    ) {
      alert("Please fill in all required billing fields.");
      return false;
    }
    return true;
  };

  const validateShippingData = async () => {
    // Mark shipping form as attempted
    setAttemptedSubmit((prev) => ({ ...prev, shipping: true }));

    // Get a reference to the ShippingForm component's validateForm function
    if (shippingFormRef.current && shippingFormRef.current.validateForm) {
      return await shippingFormRef.current.validateForm();
    }

    // Fallback validation
    const {
      firstName,
      lastName,
      address,
      label,
      apartment,
      floor,
      country,
      city,
      zipCode,
    } = shippingData;

    if (
      !firstName ||
      !lastName ||
      !address ||
      !label ||
      !apartment ||
      !floor ||
      !country ||
      !city ||
      !zipCode
    ) {
      alert("Please fill in all required shipping fields.");
      return false;
    }
    return true;
  };

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    paymentMethod: "card",
  });

  const shippingFee = 100;

  const handleBillingChange = (data) => {
    setBillingData(data);
  };

  const handleShippingChange = (data) => {
    setShippingData(data);
  };

  const handlePaymentChange = (data) => {
    setPaymentData(data);
  };

  // Pass the attempted submit state to the form components
  const billingFormRef = useRef(null);
  const shippingFormRef = useRef(null);

  const steps = [
    {
      id: 1,
      label: "Billing Information",
      content: (
        <BillingForm
          ref={billingFormRef}
          billingData={billingData}
          onChange={handleBillingChange}
          billData={{ cartItems, subtotal, shippingFee, total }}
          attemptedSubmit={attemptedSubmit.billing}
        />
      ),
    },
    {
      id: 2,
      label: "Shipping Information",
      content: (
        <ShippingForm
          ref={shippingFormRef}
          shippingData={shippingData}
          onChange={handleShippingChange}
        />
      ),
    },
    {
      id: 3,
      label: "Order Summary",
      content: (
        <SummaryForm
          billData={{ cartItems, subtotal, shippingFee, total }}
          onValidate={(fn) => (validateCheckboxRef.current = fn)}
        />
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
        productId: item.productId || item.id, // Use productId if available (for variants), otherwise use id
        variantId: item.variantId || null, // Include variantId if it exists
        name: item.name,
        price: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.unitPrice * item.quantity,
        shippingFee: item.shippingFee,
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
          customerId: userSession.id, // Ensure this is taken from the authenticated user
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

        return axios.post(
          "https://api.thedesigngrit.com/api/orders/",
          orderData
        );
      });

      // Wait for all orders to be sent
      const responses = await Promise.all(orderRequests);
      console.log(
        "Orders created successfully:",
        responses.map((res) => res.data)
      );

      // Reset the cart after successful order placement
      resetCart();
      setShowPopup(true); // Show the popup
    } catch (error) {
      console.log("Error creating orders:", error);
      console.error("Failed to create orders:", error);
    }
  };

  // Get the bill data passed from ShoppingCart
  // const location = useLocation();
  // const { cartItems, subtotal, shippingFee, total, resetCart } =
  //   location.state || {};

  const subtotal = cartItems?.length
    ? cartItems.reduce(
        (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
        0
      )
    : 0;

  const total = subtotal + (shippingFee || 0);

  // Update the Next button click handler
  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await validateBillingData();
      if (!isValid) return;
    }
    if (currentStep === 2) {
      const isValid = await validateShippingData();
      if (!isValid) return;
    }
    if (currentStep === 3) {
      setAttemptedSubmit((prev) => ({ ...prev, summary: true }));
      if (validateCheckboxRef.current && !validateCheckboxRef.current()) {
        alert("Please agree to the terms before proceeding.");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2>{steps[currentStep - 1].label}</h2>
        {React.cloneElement(steps[currentStep - 1].content, {
          billData: { cartItems, subtotal, shippingFee, total },
          attemptedSubmit:
            attemptedSubmit[
              currentStep === 1
                ? "billing"
                : currentStep === 2
                ? "shipping"
                : "summary"
            ],
        })}
        <div className="form-navigation">
          {currentStep < steps.length && (
            <button onClick={handleNextStep}>Next</button>
          )}
        </div>
      </div>
      <OrderSentPopup show={showPopup} closePopup={() => setShowPopup(false)} />
    </div>
  );
}

export default Checkout;
