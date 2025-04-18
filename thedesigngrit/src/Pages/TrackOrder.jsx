import React, { useState, useEffect, useContext } from "react";
import { Box, MenuItem, Select, FormControl } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { LuPackage } from "react-icons/lu";
import InteractiveStarRating from "../Components/rating";
import { UserContext } from "../utils/userContext";
import LoadingScreen from "./loadingScreen";
import { GiConfirmed } from "react-icons/gi";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import InvoicePDF from "../Components/invoiceOrderCustomer";

function TrackOrder() {
  const [ordersData, setOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSubOrder, setSelectedSubOrder] = useState(null);
  const { userSession } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

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
  const openInvoiceInNewTab = async () => {
    const blob = await pdf(<InvoicePDF order={selectedOrder} />).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };
  if (loading) return <LoadingScreen />;
  return (
    <Box sx={{ fontFamily: "Montserrat" }}>
      <Box sx={{ paddingBottom: "25rem" }}>
        <p
          style={{
            fontWeight: "normal",
            fontSize: "15px",
            fontFamily: "Montserrat",
          }}
        >
          Select Order
        </p>
        <FormControl fullWidth sx={{ marginBottom: "20px" }}>
          <Select
            labelId="order-select-label"
            id="order-select"
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
                    <Box
                      sx={{ display: "flex", gap: 1, flexDirection: "column" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: "column",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat",
                            color: "#ccc",
                          }}
                        >
                          {" "}
                          Order Date:
                        </span>{" "}
                        <p style={{ fontWeight: "bold" }}>
                          {new Date(
                            selectedOrder.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: "column",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat",
                            color: "#ccc",
                          }}
                        >
                          {" "}
                          Delivery Date:{" "}
                        </span>
                        <p style={{ fontWeight: "bold" }}>
                          {selectedOrder.orderStatus === "Pending"
                            ? "Not specified yet"
                            : selectedOrder.orderStatus === "Delivered"
                            ? "Already Delivered"
                            : new Date(
                                selectedOrder.deliveryDate
                              ).toLocaleDateString()}
                        </p>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    style={{ display: "flex", gap: 1, flexDirection: "column" }}
                  >
                    <select
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "5px",
                        width: "100%",
                        height: "40px",
                      }}
                      value={selectedSubOrder?.productId?.name || ""}
                      onChange={(e) =>
                        setSelectedSubOrder(
                          selectedOrder.cartItems.find(
                            (item) => item.productId.name === e.target.value
                          )
                        )
                      }
                    >
                      {selectedOrder.cartItems.map((item) => (
                        <option
                          key={item._id}
                          value={item?.productId?.name || "Unknown"}
                        >
                          {item?.productId?.name || "Unknown"}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={openInvoiceInNewTab}
                      className="submit-btn"
                    >
                      View Invoice
                    </button>
                    {/* Download Invoice Button */}
                    <PDFDownloadLink
                      document={<InvoicePDF order={selectedOrder} />}
                      fileName={`invoice_${selectedOrder._id}.pdf`}
                    >
                      {({ loading }) =>
                        loading ? (
                          "Loading..."
                        ) : (
                          <button className="submit-btn">
                            Download Invoice
                          </button>
                        )
                      }
                    </PDFDownloadLink>
                  </Box>
                </Box>

                {/* Order Summary */}
                <div className="order-card">
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                    className="order-card-title"
                  >
                    <Box>
                      <h2>Order Summary</h2>
                      <span
                        className="status paid"
                        style={{
                          backgroundColor:
                            selectedOrder.orderStatus === "Pending"
                              ? "#f8d7da"
                              : selectedOrder.orderStatus === "Delivered"
                              ? "#d4edda"
                              : "#FFE5B4",
                          color:
                            selectedOrder.orderStatus === "Pending"
                              ? "#721c24"
                              : selectedOrder.orderStatus === "Delivered"
                              ? "#155724"
                              : "#FF7518",
                        }}
                      >
                        {selectedOrder.orderStatus}
                      </span>
                    </Box>
                    <div className="progress-container-track">
                      {["Pending", "Confirmed", "Shipping", "Delivered"].map(
                        (step, i) => {
                          const isCompleted =
                            (selectedOrder.orderStatus === "Pending" &&
                              i === 0) ||
                            selectedOrder.orderStatus === "Shipped" ||
                            (selectedOrder.orderStatus === "Confirmed" &&
                              i <= 1) ||
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
                                ) : step === "Confirmed" ? (
                                  <GiConfirmed />
                                ) : step === "Shipping" ? (
                                  <LocalShippingIcon />
                                ) : (
                                  <LuPackage />
                                )}
                              </div>
                              <span className="step-label-track">{step}</span>
                            </div>
                          );
                        }
                      )}
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
                      <span
                        className="status shipped"
                        style={{
                          marginTop: "10px",
                          backgroundColor:
                            selectedOrder.orderStatus === "Pending"
                              ? "#f8d7da"
                              : selectedOrder.orderStatus === "Delivered"
                              ? "#d4edda"
                              : "#FFE5B4",
                          color:
                            selectedOrder.orderStatus === "Pending"
                              ? "#721c24"
                              : selectedOrder.orderStatus === "Delivered"
                              ? "#155724"
                              : "#FF7518",
                        }}
                      >
                        {selectedOrder.orderStatus}
                      </span>
                    </Box>
                    <Box
                      sx={{
                        paddingTop: "26px",
                        display: "flex",
                        gap: 2,
                        flexDirection: "column",
                      }}
                    >
                      <a
                        href="mailto:getsupport@thedesigngrit.com?subject=Support Request for Order {selectedOrder._id}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#6b7b58",
                          padding: "10px",
                          borderRadius: "5px",
                          alignItems: "end",
                        }}
                      >
                        Get Support?
                      </a>
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
                        {/* <img
                          src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedSubOrder.productId.mainImage}`}
                          alt={selectedSubOrder.productId.name}
                          style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "5px",
                          }}
                        /> */}
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
      {/* Show Invoice in Modal or Full Screen */}
      {showInvoice && (
        <div className="invoice-modal">
          <PDFViewer width="600" height="700">
            <InvoicePDF order={selectedOrder} />
          </PDFViewer>
          <button onClick={() => setShowInvoice(false)}>Close</button>
        </div>
      )}
    </Box>
  );
}

export default TrackOrder;
