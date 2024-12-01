import React from "react";
import { Box } from "@mui/material";

const PaymentIcons = () => {
  const icons = [
    { src: "Assets/visa-logo.png", alt: "Visa" },
    { src: "Assets/mastercard-logo.png", alt: "MasterCard" },
    { src: "Assets/valu-logo.png", alt: "ValU" },
    { src: "Assets/saholoha-logo.png", alt: "Saholoha" },
    { src: "Assets/halan-logo.png", alt: "Halan" },
  ];

  return (
    <Box className="payment-icons">
      {icons.map((icon, index) => (
        <img key={index} src={icon.src} alt={icon.alt} />
      ))}
    </Box>
  );
};

export default PaymentIcons;
