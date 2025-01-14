import React, { useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { LuPackage } from "react-icons/lu";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Box } from "@mui/material";

const OrdersPopUp = () => {
  const [expandedOrder, setExpandedOrder] = useState(null); // To track which order is expanded
  const orderData = [
    {
      orderNumber: "23345465182",
      itemName: "WOODEN TABLE",
      date: "01/01/2023",
      price: "8,600 LE",
      image: "Assets/productimg1.png",
      deliveryDate: "01/02/2023",

      timeline: [
        { label: "Purchase", completed: true, icon: <ShoppingCartIcon /> },
        { label: "Shipping", completed: true, icon: <LocalShippingIcon /> },
        { label: "Delivered", completed: false, icon: <LuPackage /> },
      ],
    },
    {
      orderNumber: "1234567890",
      itemName: "SOFA",
      date: "01/01/2023",
      price: "12,000 LE",
      image: "Assets/prodImg1.jpg",
      deliveryDate: "01/02/2023",

      timeline: [
        { label: "Purchase", completed: true, icon: <ShoppingCartIcon /> },
        { label: "Shipping", completed: false, icon: <LocalShippingIcon /> },
        { label: "Delivered", completed: false, icon: <LuPackage /> },
      ],
    },
    {
      orderNumber: "1234567890",
      itemName: "SOFA",
      date: "01/01/2023",
      price: "12,000 LE",
      image: "Assets/prodImg1.jpg",
      deliveryDate: "01/02/2023",
      timeline: [
        { label: "Purchase", completed: true, icon: <ShoppingCartIcon /> },
        { label: "Shipping", completed: false, icon: <LocalShippingIcon /> },
        { label: "Delivered", completed: false, icon: <LuPackage /> },
      ],
    },
    {
      orderNumber: "1234567890",
      itemName: "SOFA",
      date: "01/01/2023",
      price: "12,000 LE",
      image: "Assets/prodImg1.jpg",
      deliveryDate: "01/02/2023",

      timeline: [
        { label: "Purchase", completed: true, icon: <ShoppingCartIcon /> },
        { label: "Shipping", completed: false, icon: <LocalShippingIcon /> },
        { label: "Delivered", completed: false, icon: <LuPackage /> },
      ],
    },
  ];

  const toggleOrderDetails = (index) => {
    setExpandedOrder(expandedOrder === index ? null : index);
  };

  // const calculateProgress = (timeline) => {
  //   const totalSteps = timeline.length;
  //   const completedSteps = timeline.filter((step) => step.completed).length;
  //   return (completedSteps / totalSteps) * 100;
  // };

  return (
    <div className="orders-popup">
      {orderData.map((order, index) => (
        <div key={index} className="order-card-popup">
          {/* Order Header Section */}
          <div className="order-header">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <span className="order-number">
                Order No: {order.orderNumber}
              </span>
              <span
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "12px",
                }}
              >
                {order.date}
              </span>
            </Box>
            <button
              className="arrow-button"
              onClick={() => toggleOrderDetails(index)}
            >
              {expandedOrder === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
          </div>

          {/* Dropdown Box (Only shown when expanded) */}
          {expandedOrder === index && (
            <div className="order-dropdown">
              {/* Order Info Section */}
              <div className="order-info">
                <div className="order-info-headers">
                  <h3>{order.itemName}</h3>
                  <p>{order.price}</p>
                  <p>Delivery Date: {order.deliveryDate}</p>
                </div>
                <img src={order.image} alt="Product" />
              </div>

              {/* Progress Timeline Section */}
              <div className="progress-container">
                {order.timeline.map((step, i) => (
                  <div
                    key={i}
                    className={`progress-step ${
                      step.completed ? "completed" : ""
                    }`}
                  >
                    <div className="step-circle">{step.icon}</div>
                    <span className="step-label">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdersPopUp;
