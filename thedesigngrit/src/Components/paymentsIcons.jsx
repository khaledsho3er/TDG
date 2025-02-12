import React from "react";
import { Box } from "@mui/material";

const PaymentIcons = () => {
  const icons = [
    { src: "Assets/visa-logo.webp", alt: "Visa" },
    { src: "Assets/mastercard-logo.webp", alt: "MasterCard" },
    { src: "Assets/valu-logo.webp", alt: "ValU" },
    { src: "Assets/saholoha-logo.webp", alt: "Saholoha" },
    { src: "Assets/halan-logo.webp", alt: "Halan" },
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
