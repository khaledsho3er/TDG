import React from "react";
import { Box } from "@mui/material";

function StepTracker({ currentStep, setCurrentStep }) {
  const steps = [
    { id: 1, icon: "/Assets/Checkout/firsticon.png", label: "Cart" },
    { id: 2, icon: "/Assets/Checkout/secondicon.png", label: "Shipping" },
    { id: 3, icon: "/Assets/Checkout/thirdicon.png", label: "Summary" },
    { id: 4, icon: "/Assets/Checkout/fourthicon.png", label: "Payment" },
  ];

  const handleStepClick = (stepId) => {
    // Update currentStep when a step is clicked
    setCurrentStep(stepId);
  };

  return (
    <Box className="step-tracker">
      {steps.map((step, index) => (
        <Box
          key={step.id}
          className={`step-item ${currentStep === step.id ? "active" : ""}`}
          onClick={() => handleStepClick(step.id)} // Handle click on step
        >
          <Box className="step-circle">
            <span className="step-icon">
              {" "}
              <img
                src={step.icon}
                alt={`${step.label} icon`}
                className="step-icon"
              />
            </span>
          </Box>
          {index < steps.length - 1 && <Box className="step-line"></Box>}
        </Box>
      ))}
    </Box>
  );
}

export default StepTracker;
