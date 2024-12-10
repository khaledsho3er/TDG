import React, { useState } from "react";
import { Box } from "@mui/material";
import BillingForm from "./Billingform.jsx";
import ShippingForm from "./Shippingform.jsx";
import SummaryForm from "./ordersummary.jsx";
import PaymentForm from "./Paymentmethod.jsx";
import StepTracker from "./stepTracker.jsx";

function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, label: "Billing Information", content: <BillingForm /> },
    { id: 2, label: "Shipping Information", content: <ShippingForm /> },
    { id: 3, label: "Order Summary", content: <SummaryForm /> },
    { id: 4, label: "Payment Method", content: <PaymentForm /> },
  ];

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <Box className="checkout_image_container">
          <img
            src="/Assets/TDG_Icon_Black.png"
            alt="image"
            className="checkout_logo_icon"
          />
        </Box>
        {/* Pass setCurrentStep to StepTracker */}
        <StepTracker
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
        <h2>{steps[currentStep - 1].label}</h2>
        {steps[currentStep - 1].content}
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
