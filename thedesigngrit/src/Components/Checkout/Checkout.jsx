import React, { useState } from "react";
import BillingForm from "./Billingform.jsx";
import ShippingForm from "./Shippingform.jsx";
import SummaryForm from "./ordersummary.jsx";
import PaymentForm from "./Paymentmethod.jsx";
import { useLocation } from "react-router-dom";

function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);

  // Get the bill data passed from ShoppingCart
  const location = useLocation();
  const { cartItems, subtotal, shippingFee, total } = location.state || {};

  const steps = [
    {
      id: 1,
      label: "Billing Information",
      content: (
        <BillingForm billData={{ cartItems, subtotal, shippingFee, total }} />
      ),
    },
    { id: 2, label: "Shipping Information", content: <ShippingForm /> },
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
        <PaymentForm billData={{ cartItems, subtotal, shippingFee, total }} />
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
