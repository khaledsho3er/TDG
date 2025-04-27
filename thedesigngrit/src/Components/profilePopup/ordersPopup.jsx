import React, { useState, useContext, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios from "axios";
import { Box } from "@mui/material";
import { UserContext } from "../../utils/userContext";
const OrdersPopUp = () => {
  const { userSession } = useContext(UserContext);
  const [expandedOrder, setExpandedOrder] = useState(null); // To track which order is expanded
  const [orderData, setOrderData] = useState([]); // State to hold fetched orders
  useEffect(() => {
    // Fetch orders by customerId from the session
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://api.thedesigngrit.com/api/orders/orders/customer/${userSession.id}`
        ); // Make API call to fetch orders
        setOrderData(response.data); // Set the fetched orders in state
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders(); // Call the function when the component mounts
  }, [userSession.id]);

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
              <span className="order-number">Order No: {order._id}</span>
              <span
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "12px",
                }}
              >
                {new Date(order.orderDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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
                  <h3>{order.cartItems.name}</h3>
                  <h3>{order.cartItems.price}</h3>

                  <p>{order.total}</p>
                </div>
                <img src={order.cartItems.productId} alt="Product" />
              </div>

              {/* Progress Timeline Section
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
              </div> */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdersPopUp;
