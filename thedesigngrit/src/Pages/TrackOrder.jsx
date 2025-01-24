import React, { useState, useEffect } from "react";
import Header from "../Components/navBar";
import { Box } from "@mui/material";
import HeroAbout from "../Components/About/heroAbout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { LuPackage } from "react-icons/lu";
import InteractiveStarRating from "../Components/rating";
import Footer from "../Components/Footer";

function TrackOrder() {
  const [ordersData, setOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSubOrder, setSelectedSubOrder] = useState(null);

  // Load JSON data dynamically
  useEffect(() => {
    const fetchOrders = async () => {
      // Replace with actual API call if the data is hosted
      const response = await fetch("/json/order.json");
      const data = await response.json();
      setOrdersData(data);
      setSelectedOrder(data[0]); // Default to the first order
      setSelectedSubOrder(data[0]?.orders[0]); // Default to the first sub-order
    };

    fetchOrders();
  }, []);
  return (
    <Box sx={{ fontFamily: "Montserrat" }}>
      <Header />
      <Box sx={{ paddingBottom: "25rem" }}>
        <Box>
          <HeroAbout
            title="Track Your Order"
            subtitle="Explore thousands of jobs on TDG to reach the next step in your career. Online job vacancies that match your preference. Search, Save, Apply today."
            image={"Assets/trackorder.png"}
          />
        </Box>
        <div className="terms-container">
          {/* Sidebar */}
          <div className="sidebar-track">
            {ordersData.map((order) => (
              <button
                key={order.id}
                className={`sidebar-item ${
                  selectedOrder?.id === order.id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedOrder(order);
                  setSelectedSubOrder(order.orders[0]); // Reset sub-order selection
                }}
              >
                Order No. : {order.name}
              </button>
            ))}
          </div>
          <div className="divider-track"></div>

          {/* Content Section */}
          <div className="order-details">
            {selectedOrder && selectedSubOrder && (
              <>
                {/* Order Info */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <Box>
                    <h3
                      style={{
                        fontWeight: "bold",
                        fontSize: "26px",
                        fontFamily: "Horizon",
                        textAlign: "left",
                      }}
                    >
                      Order :{selectedOrder.name}
                    </h3>
                    <Box
                      sx={{ display: "flex", flexDirection: "row", gap: 23 }}
                    >
                      <p>{selectedOrder.date}</p>
                      <p>{selectedOrder.time}</p>
                    </Box>
                  </Box>
                  {/* Sub-order dropdown */}
                  <select
                    style={{
                      marginTop: "2rem",
                      border: "white",
                      borderRadius: "7px",
                      backgroundColor: "white",
                      color: "black",
                      padding: "0px 15px",
                      fontSize: "18px",
                      height: "40px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      width: "30%",
                    }}
                    value={selectedSubOrder.title}
                    onChange={(e) =>
                      setSelectedSubOrder(
                        selectedOrder.orders.find(
                          (order) => order.title === e.target.value
                        )
                      )
                    }
                  >
                    {selectedOrder.orders.map((subOrder) => (
                      <option key={subOrder.id} value={subOrder.title}>
                        Order: {subOrder.title}
                      </option>
                    ))}
                  </select>
                </Box>

                {/* Order Summary */}
                <div className="order-card">
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <h2>Order Summary</h2>
                      <p style={{ fontSize: "20px", marginTop: "-10px" }}>
                        Order: {selectedSubOrder.title}
                      </p>
                      <span className="status paid">
                        {selectedSubOrder.paymentStatus}
                      </span>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        alignItems: "flex-end",
                      }}
                    >
                      {/* Progress Bar */}
                      <div className="progress-container-track">
                        {selectedSubOrder.timeline.map((step, i) => (
                          <div
                            key={i}
                            className={`progress-step ${
                              step.completed ? "completed" : ""
                            }`}
                          >
                            <div
                              className={`step-circle-track ${
                                step.completed ? "completed" : ""
                              }`}
                            >
                              {step.label === "Purchase" ? (
                                <ShoppingCartIcon />
                              ) : step.label === "Shipping" ? (
                                <LocalShippingIcon />
                              ) : (
                                <LuPackage />
                              )}
                            </div>
                            <span className="step-label-track">
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <img
                        src={selectedSubOrder.brandImage}
                        alt={selectedSubOrder.brandName}
                        style={{
                          width: "100px",
                          height: "40px",
                        }}
                      />
                    </Box>
                  </Box>

                  <Box className="order-pays-subtotal">
                    <p>Subtotal:</p>
                    <p className="middle-pay-table">
                      {selectedSubOrder.quantity} item
                    </p>
                    <p>{selectedSubOrder.subtotal} LE</p>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p>Discount:</p>
                    <p className="middle-pay-table">
                      {selectedSubOrder.discountAmount}
                    </p>
                    <p>{selectedSubOrder.discount}LE</p>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p>Shipping:</p>
                    <p className="middle-pay-table">
                      {selectedSubOrder.ShippmentDesc}
                    </p>
                    <p>{selectedSubOrder.Shipping} LE</p>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p className="total">Total:</p>
                    <p className="total">{selectedSubOrder.total} LE</p>
                  </Box>
                </div>

                {/* Order Items */}
                <div className="order-card">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "10px",
                    }}
                  >
                    <Box>
                      <h3
                        style={{
                          fontSize: "20px",
                        }}
                      >
                        Order Item
                      </h3>
                      <h4
                        style={{
                          fontSize: "14px",
                          fontWeight: "normal",
                          color: "#777",
                          marginBottom: "10px",
                          marginTop: "10px",
                        }}
                      >
                        Order: {selectedSubOrder.title}
                      </h4>
                      <span className="status shipped">
                        {selectedSubOrder.orderStatus}
                      </span>
                    </Box>
                    <Box
                      sx={{
                        paddingTop: "26px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        alignItems: "flex-end",
                      }}
                    >
                      <InteractiveStarRating />
                      <img
                        src={selectedSubOrder.brandImage}
                        alt={selectedSubOrder.brandName}
                        style={{
                          width: "100px",
                          height: "40px",
                        }}
                      />
                    </Box>
                  </Box>
                  <div className="item">
                    <img
                      src={selectedSubOrder.productImage}
                      alt={selectedSubOrder.productName}
                      style={{
                        width: "150px",
                        height: "75px",
                        border: "2px solid black",
                      }}
                    />
                    <div className="item-details">
                      <Box>
                        <h5>{selectedSubOrder.productName}</h5>
                        <p
                          style={{
                            fontSize: "12px",
                            width: "30%",
                          }}
                        >
                          {selectedSubOrder.productDescrption}
                        </p>
                      </Box>
                      <p style={{ width: "10%" }}>
                        {" "}
                        {selectedSubOrder.productTotal} LE
                      </p>
                      <p> {selectedSubOrder.productQuantity} </p>
                      <div className="item-price">
                        {selectedSubOrder.productTotal} LE
                      </div>
                    </div>
                  </div>
                  <div className="actions">
                    <button className="cancel-btn">Cancel</button>
                    <button className="reorder-btn">Re-Order</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Box>
      <Footer />
    </Box>
  );
}

export default TrackOrder;
