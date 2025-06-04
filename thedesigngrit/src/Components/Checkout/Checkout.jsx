import React, { useState, useRef, useEffect } from "react";
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
    apartment: "",
    floor: "",
    building: "",
    state: "",
  });
  const [billingErrors, setBillingErrors] = useState({});
  const validateBillingData = () => {
    const errors = {};
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

    if (!firstName) errors.firstName = "First name is required";
    if (!lastName) errors.lastName = "Last name is required";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";
    if (!address) errors.address = "Address is required";
    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else {
      const digitsOnly = phoneNumber.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        errors.phoneNumber = "Phone number must have at least 10 digits";
      }
    }
    if (!country) errors.country = "Country is required";
    if (!city) errors.city = "City is required";
    if (!zipCode) {
      errors.zipCode = "Zip code is required";
    } else {
      const digitsOnly = zipCode.replace(/\D/g, "");
      if (digitsOnly.length !== 5) {
        errors.zipCode = "Zip Code Must be 5 digits";
      }
    }

    setBillingErrors(errors);
    return Object.keys(errors).length === 0;
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
  const [shippingErrors, setShippingErrors] = useState({});
  const validateShippingData = () => {
    const errors = {};
    const { firstName, lastName, address, city, zipCode } = shippingData;

    if (!firstName) errors.firstName = "First name is required";
    if (!lastName) errors.lastName = "Last name is required";
    if (!address) errors.address = "Address is required";
    if (!city) errors.city = "City is required";
    if (!zipCode) {
      errors.zipCode = "Zip code is required";
    } else {
      const digitsOnly = zipCode.replace(/\D/g, "");
      if (digitsOnly.length !== 5) {
        errors.zipCode = "Zip Code Must be 5 digits";
      }
    }

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    paymentMethod: "card",
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const validatePaymentData = () => {
    const errors = {};
    const { cardNumber, expiry, cvv } = paymentData;

    if (paymentData.paymentMethod === "card") {
      if (!cardNumber) errors.cardNumber = "Card number is required";
      else if (cardNumber.replace(/\s/g, "").length !== 16)
        errors.cardNumber = "Card number must be 16 digits";

      if (!expiry) errors.expiry = "Expiry date is required";
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry))
        errors.expiry = "Invalid format (MM/YY)";

      if (!cvv) errors.cvv = "CVV is required";
      else if (!/^\d{3,4}$/.test(cvv)) errors.cvv = "CVV must be 3 or 4 digits";
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
        productId: item.productId || item.id, // Use productId if available (for variants), otherwise use id
        variantId: item.variantId || null, // Include variantId if it exists
        name: item.name,
        price: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.unitPrice * item.quantity,
        shippingFee: item.shippingFee,
        color: item.color || "default", // Add color information
        size: item.size || "default", // Add size information
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

  // Add useEffect to recalculate totals when cartItems change
  useEffect(() => {
    // Recalculate subtotal and total when cart items change
    const newSubtotal = cartItems?.length
      ? cartItems.reduce(
          (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
          0
        )
      : 0;

    // const newTotal = newSubtotal + (shippingFee || 0);

    // Update state if needed
    if (subtotal !== newSubtotal) {
      // If you have state variables for these, update them
      // setSubtotal(newSubtotal);
      // setTotal(newTotal);
    }
  }, [cartItems, subtotal]);

  const steps = [
    {
      id: 1,
      label: "Shipping Information",
      content: (
        <ShippingForm
          shippingData={shippingData}
          onChange={handleShippingChange}
          errors={shippingErrors}
          validateOnChange={true}
        />
      ),
    },
    {
      id: 2,
      label: "Billing Information",
      content: (
        <BillingForm
          billingData={billingData}
          onChange={handleBillingChange}
          billData={{ cartItems, subtotal, shippingFee, total }}
          errors={billingErrors}
          validateOnChange={true}
          shippingData={shippingData} // Pass shipping data to BillingForm
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
          errors={paymentErrors}
          billData={{
            cartItems,
            subtotal,
            shippingFee,
            total,
            billingDetails: {
              apartment: billingData.apartment || "NA",
              first_name: billingData.firstName,
              last_name: billingData.lastName,
              street: billingData.address,
              building: billingData.building || "NA",
              phone_number: billingData.phoneNumber,
              city: billingData.city,
              country: billingData.country,
              email: billingData.email,
              floor: billingData.floor || "NA",
              state: billingData.state || "NA",
            },
          }}
        />
      ),
    },
  ];

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <h2>{steps[currentStep - 1].label}</h2>
        {React.cloneElement(steps[currentStep - 1].content, {
          billData:
            currentStep === 4
              ? {
                  cartItems,
                  subtotal,
                  shippingFee,
                  total,
                  billingDetails: {
                    apartment: billingData.apartment || "NA",
                    first_name: billingData.firstName,
                    last_name: billingData.lastName,
                    street: billingData.address,
                    building: billingData.building || "NA",
                    phone_number: billingData.phoneNumber,
                    city: billingData.city,
                    country: billingData.country,
                    email: billingData.email,
                    floor: billingData.floor || "NA",
                    state: billingData.state || "NA",
                  },
                }
              : { cartItems, subtotal, shippingFee, total },
        })}
        <div className="form-navigation">
          {currentStep < steps.length && (
            <button
              onClick={() => {
                if (currentStep === 1 && !validateShippingData()) return;
                if (currentStep === 2 && !validateBillingData()) return;
                if (
                  currentStep === 3 &&
                  validateCheckboxRef.current &&
                  !validateCheckboxRef.current()
                ) {
                  alert("Please agree to the terms before proceeding.");
                  return;
                }
                if (currentStep === 4 && !validatePaymentData()) return;

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
