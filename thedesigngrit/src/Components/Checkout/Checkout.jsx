import React, { useState, useRef } from "react";
import BillingForm from "./Billingform.jsx";
import ShippingForm from "./Shippingform.jsx";
import SummaryForm from "./ordersummary.jsx";
import PaymentForm from "./Paymentmethod.jsx";
// import { useLocation } from "react-router-dom";
import { useCart } from "../../Context/cartcontext.js";
import { useUser } from "../../utils/userContext";
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from "react-router-dom";
import OrderSentPopup from "../successMsgs/orderSubmit.jsx";

function Checkout() {
  const navigate = useNavigate();
  const { userSession } = useUser();
  const { cartItems, resetCart } = useCart(); //  Get cart items from CartContexts
  const [currentStep, setCurrentStep] = useState(1);
  const validateCheckboxRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
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
  const validateBillingData = () => {
    const {
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      country,
      city,
      zipCode,
    } = billingData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !address ||
      !phoneNumber ||
      !country ||
      !city ||
      !zipCode
    ) {
      alert("Please fill in all required billing fields.");
      return false;
    }
    return true;
  };

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
  const validateShippingData = () => {
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

  // const handleNext = () => {
  //   if (validateCheckboxRef.current && !validateCheckboxRef.current()) {
  //     return; // Stop if validation fails
  //   }
  //   console.log("Proceed to next step");
  // };

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
      navigate("/"); // Redirect to home or order confirmation page
      // Redirect or show confirmation
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

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2>{steps[currentStep - 1].label}</h2>
        {React.cloneElement(steps[currentStep - 1].content, {
          billData: { cartItems, subtotal, shippingFee, total },
        })}
        <div className="form-navigation">
          {currentStep < steps.length && (
            <button
              onClick={() => {
                if (currentStep === 1 && !validateBillingData()) return;
                if (currentStep === 2 && !validateShippingData()) return;
                if (
                  currentStep === 3 &&
                  validateCheckboxRef.current &&
                  !validateCheckboxRef.current()
                ) {
                  alert("Please agree to the terms before proceeding.");
                  return;
                }

                setCurrentStep(currentStep + 1);
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
      <OrderSentPopup show={showPopup} closePopup={() => setShowPopup(false)} />
    </div>
  );
}

export default Checkout;
