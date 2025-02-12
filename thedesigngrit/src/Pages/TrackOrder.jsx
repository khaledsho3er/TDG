import React, { useState, useEffect, useContext } from "react";
import { Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { LuPackage } from "react-icons/lu";
import InteractiveStarRating from "../Components/rating";
import { UserContext } from "../utils/userContext";
import LoadingScreen from "./loadingScreen";

function TrackOrder() {
  const [ordersData, setOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSubOrder, setSelectedSubOrder] = useState(null);
  const { userSession } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  // Fetch orders based on userSession.id
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userSession?.id) return; // Ensure userSession is available

      try {
        const response = await fetch(
          `https://tdg-db.onrender.com/api/orders/orders/customer/${userSession.id}`
        ); // Adjust API endpoint as needed
        const data = await response.json();

        // Filter orders for the logged-in user
        const userOrders = data.filter(
          (order) => order.customerId._id === userSession.id
        );

        setOrdersData(userOrders);
        setSelectedOrder(userOrders[0] || null); // Default to the first order if available
        setSelectedSubOrder(userOrders[0]?.cartItems[0] || null); // Default to the first cart item
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userSession]);
  if (loading) return <LoadingScreen />;
  return (
    <Box sx={{ fontFamily: "Montserrat" }}>
      <Box sx={{ paddingBottom: "25rem" }}>
        <FormControl fullWidth sx={{ marginBottom: "20px" }}>
          <InputLabel>Select Order</InputLabel>
          <Select
            value={selectedOrder?._id || ""}
            onChange={(e) => {
              const order = ordersData.find(
                (order) => order._id === e.target.value
              );
              setSelectedOrder(order);
              setSelectedSubOrder(order?.cartItems[0] || null);
            }}
          >
            {ordersData.map((order) => (
              <MenuItem key={order._id} value={order._id}>
                Order No. : {order._id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="terms-container">
          {/* Sidebar */}

          {/* Content Section */}
          <div className="order-details">
            {selectedOrder && selectedSubOrder && (
              <>
                {/* Order Info */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                  className="order-card-title"
                >
                  <Box>
                    <h3
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        fontFamily: "Montserrat",
                      }}
                    >
                      Order: {selectedOrder._id}
                    </h3>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <p>
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </Box>
                  </Box>
                  <select
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "5px",
                      width: "30%",
                      height: "40px",
                    }}
                    value={selectedSubOrder.productId.name}
                    onChange={(e) =>
                      setSelectedSubOrder(
                        selectedOrder.cartItems.find(
                          (item) => item.productId.name === e.target.value
                        )
                      )
                    }
                  >
                    {selectedOrder.cartItems.map((item) => (
                      <option key={item._id} value={item.productId.name}>
                        {item.productId.name}
                      </option>
                    ))}
                  </select>
                </Box>

                {/* Order Summary */}
                <div className="order-card">
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                    className="order-card-title"
                  >
                    <Box>
                      <h2>Order Summary</h2>
                      <span className="status paid">
                        {selectedOrder.orderStatus}
                      </span>
                    </Box>
                    <div className="progress-container-track">
                      {["Pending", "Shipping", "Delivered"].map((step, i) => {
                        const isCompleted =
                          (selectedOrder.orderStatus === "Pending" &&
                            i === 0) ||
                          (selectedOrder.orderStatus === "Shipped" && i <= 1) ||
                          selectedOrder.orderStatus === "Delivered";

                        return (
                          <div
                            key={i}
                            className={`progress-step ${
                              isCompleted ? "completed" : ""
                            }`}
                          >
                            <div
                              className={`step-circle-track ${
                                isCompleted ? "completed" : ""
                              }`}
                            >
                              {step === "Pending" ? (
                                <ShoppingCartIcon />
                              ) : step === "Shipping" ? (
                                <LocalShippingIcon />
                              ) : (
                                <LuPackage />
                              )}
                            </div>
                            <span className="step-label-track">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p>Subtotal:</p>
                    <p>{selectedOrder.subtotal} LE</p>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p>Shipping:</p>
                    <p>{selectedOrder.shippingFee} LE</p>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p className="total">Total:</p>
                    <p className="total">{selectedOrder.total} LE</p>
                  </Box>
                </div>

                {/* Order Items */}
                <div className="order-card">
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <h3>Order Item</h3>
                      <h4>{selectedSubOrder.productId.name}</h4>
                      <span className="status shipped">
                        {selectedOrder.orderStatus}
                      </span>
                    </Box>
                    <Box sx={{ paddingTop: "26px", display: "flex", gap: 2 }}>
                      <InteractiveStarRating />
                    </Box>
                  </Box>
                  <div className="item">
                    <div className="item-details">
                      <Box
                        className="suborder-item-details"
                        sx={{
                          display: "flex",
                          gap: "10px",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          marginTop: "10px",
                          margin: "auto",
                        }}
                      >
                        <h5>{selectedSubOrder.productId.name}</h5>
                        <p>{selectedSubOrder.totalPrice} LE</p>
                        <p>Quantity: {selectedSubOrder.quantity}</p>
                      </Box>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default TrackOrder;
