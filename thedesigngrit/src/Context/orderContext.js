import React, { createContext, useState, useContext } from "react";

const OrderContext = createContext();

export const useOrder = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const [orderData, setOrderData] = useState({
    shipping: {},
    billing: {},
    payment: {},
  });

  const updateShipping = (shippingData) => {
    setOrderData((prevState) => ({
      ...prevState,
      shipping: shippingData,
    }));
  };

  const updateBilling = (billingData) => {
    setOrderData((prevState) => ({
      ...prevState,
      billing: billingData,
    }));
  };

  const updatePayment = (paymentData) => {
    setOrderData((prevState) => ({
      ...prevState,
      payment: paymentData,
    }));
  };

  const submitOrder = async () => {
    try {
      const response = await fetch("/api/submit-order", {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        alert("Order successfully submitted!");
      } else {
        alert("Failed to submit order.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error submitting order.");
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orderData,
        updateShipping,
        updateBilling,
        updatePayment,
        submitOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
