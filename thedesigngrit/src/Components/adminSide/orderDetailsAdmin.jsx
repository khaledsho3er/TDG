import React, { useState } from "react";
import { SlCalender } from "react-icons/sl";
import { Box, Button, IconButton, Snackbar, Alert } from "@mui/material";
import { IoMdPrint } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import { FiPackage } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";

const InvoiceDownload = React.lazy(() => import("../vendorSide/invoice"));

const AdminOrderDetails = ({ order, onBack }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePingBrand = async () => {
    try {
      // Get the brandId from the first cart item
      const brandId = order.cartItems[0]?.brandId;

      if (!brandId) {
        setSnackbar({
          open: true,
          message: "Brand ID not found in order",
          severity: "error",
        });
        return;
      }

      await axios.post("https://api.thedesigngrit.com/api/orders/ping-brand", {
        orderId: order._id,
        brandId: brandId,
      });

      setSnackbar({
        open: true,
        message: "Brand has been notified successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error pinging brand:", err);
      setSnackbar({
        open: true,
        message: "Failed to notify brand. Please try again.",
        severity: "error",
      });
    }
  };

  if (!order) return <div>Order not found</div>;

  // Filter products based on brandId

  const filteredProducts = order.cartItems;

  return (
    <div>
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: "10px",
            }}
          >
            <IconButton>
              <IoIosArrowRoundBack size={"50px"} onClick={onBack} />
            </IconButton>

            <h2>Order Details</h2>
          </div>
          <p style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
            Home &gt; Orders &gt; Order Details
          </p>
        </div>
      </header>

      <Box
        sx={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "16px",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              <h4>Order ID: #{order._id}</h4>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 4px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  backgroundColor:
                    order.orderStatus === "Pending"
                      ? "#f8d7da"
                      : order.orderStatus === "Delivered"
                      ? "#d4edda"
                      : "#FFE5B4",
                  color:
                    order.orderStatus === "Pending"
                      ? "#721c24"
                      : order.orderStatus === "Delivered"
                      ? "#155724"
                      : "#FF7518",
                  textAlign: "center",
                  minWidth: "80px",
                }}
              >
                {order.orderStatus}
              </span>
            </Box>
            <div className="dashboard-date-vendor">
              <SlCalender />
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "baseline",
              flexDirection: "row",
            }}
          >
            <InvoiceDownload
              order={order}
              style={{
                marginTop: "10px",
                backgroundColor: "#2d2d2d !important",
                color: "white !important",
                borderRadius: "5px",
                padding: "11px 10px",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                "&:hover": {
                  backgroundColor: "#1a1a1a !important",
                  color: "white !important",
                },
              }}
              className="invoice-download-btn"
            >
              <IoMdPrint style={{ color: "#fff", fontSize: "20px" }} />
            </InvoiceDownload>

            <Button
              className="submit-btn"
              onClick={handlePingBrand}
              sx={{
                backgroundColor: "#6c7c59",
                color: "white",
                "&:hover": {
                  backgroundColor: "#5a6a47",
                },
                padding: "7px 20px",
                borderRadius: "5px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "bold",
              }}
            >
              Ping Brand
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "20px",
            padding: "6px 22px 0px 0px",
          }}
        >
          {/* Customer Info Box */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              border: "2px solid #ddd",
              borderRadius: "15px",
              width: "45%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                padding: "10px",
                alignItems: "start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  backgroundColor: "#6c7c59",
                  borderRadius: "5px",
                  width: "40px",
                  height: "40px",
                }}
              >
                <FaRegUser
                  style={{
                    color: "#efebe8",
                    padding: "5px",
                    fontSize: "20px",
                  }}
                />
              </Box>
              <div
                style={{
                  fontFamily: "Montserrat",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <h4>Customer</h4>
                <div
                  style={{
                    fontFamily: "Montserrat",
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      gap: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    <p>Full Name:</p>
                    <p>Email:</p>
                    <p>Phone:</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <span> {order.customerId.firstName}</span>
                    <span> {order.customerId.email}</span>
                    <span> {order.customerId.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </Box>
          </Box>
          {/* Delivery Info Box */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              border: "2px solid #ddd",
              borderRadius: "15px",
              width: "45%",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                padding: "10px",
                alignItems: "start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  backgroundColor: "#6c7c59",
                  borderRadius: "5px",
                  width: "45px",
                  height: "40px",
                }}
              >
                <FiPackage
                  style={{
                    color: "#efebe8",
                    padding: "5px",
                    fontSize: "20px",
                  }}
                />
              </Box>
              <div
                style={{
                  fontFamily: "Montserrat",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <h4>Delivery</h4>
                <div
                  style={{
                    fontFamily: "Montserrat",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px 20px",
                    alignItems: "center",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <p style={{ fontWeight: "bold", margin: 0 }}>Address:</p>
                  <span style={{ margin: 0 }}>
                    {order.shippingDetails.address}
                  </span>

                  <p style={{ fontWeight: "bold", margin: 0 }}>Label:</p>
                  <span style={{ margin: 0 }}>
                    {order.shippingDetails.label}
                  </span>

                  <p style={{ fontWeight: "bold", margin: 0 }}>Apartment:</p>
                  <span style={{ margin: 0 }}>
                    {order.shippingDetails.apartment}
                  </span>

                  <p style={{ fontWeight: "bold", margin: 0 }}>Floor:</p>
                  <span style={{ margin: 0 }}>
                    {order.shippingDetails.floor}
                  </span>
                </div>
              </div>
            </Box>
          </Box>
        </Box>
        {/*3rd Row*/}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            gap: "20px",
            paddingTop: "20px",
          }}
        >
          {/* Payment Box */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              border: "2px solid #ddd",
              borderRadius: "15px",
              fontFamily: "Montserrat",
              width: "30%",
              padding: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4>Payment Info</h4>
              <img src="/Assets/visa-logo.webp" alt="Visa" />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "15px",
                fontFamily: "Montserrat",
                padding: "10px",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <p>Payment Method:</p>
                  <p>Transaction ID:</p>
                  <p>Payment Status:</p>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <p>{order.paymentDetails.paymentMethod}</p>
                  <p>{order.paymentDetails.transactionId || "120002554"}</p>
                  <p>{order.paymentDetails.paymentStatus || "Pending"}</p>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Note Box */}
          <Box sx={{ display: "flex", flexDirection: "column", width: "65%" }}>
            <h4>Notes</h4>
            <div style={{ position: "relative", width: "97%" }}>
              {order.notePostedAt && (
                <div
                  style={{
                    position: "absolute",
                    top: "123px",
                    right: "31px",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  {new Date(order.notePostedAt).toLocaleString()}
                </div>
              )}
              <textarea
                style={{
                  border: "2px solid #ddd",
                  borderRadius: "15px",
                  width: "97%",
                  fontSize: "14px",
                  padding: "10px",
                  height: "150px",
                  fontFamily: "Montserrat",
                  color: "#666",
                  backgroundColor: "#f5f5f5",
                  cursor: "not-allowed",
                }}
                placeholder="No notes available"
                value={order.note || ""}
                readOnly
              ></textarea>
            </div>
          </Box>
        </Box>
      </Box>

      <div className="products-purchases-order" style={{ padding: "20px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3>Products</h3>
        </Box>
        <hr />

        {/* Products Table */}
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Order ID</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product._id}</td>
                <td>{product.quantity} Item</td>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "5px",
                      backgroundColor:
                        product.subOrderStatus === "Pending"
                          ? "#f8d7da"
                          : product.subOrderStatus === "Delivered"
                          ? "#d4edda"
                          : "#FFE5B4",
                      color:
                        product.subOrderStatus === "Pending"
                          ? "#721c24"
                          : product.subOrderStatus === "Delivered"
                          ? "#155724"
                          : "#FF7518",
                      fontWeight: "500",
                      textAlign: "center",
                      minWidth: "80px",
                    }}
                  >
                    {product.subOrderStatus}
                  </span>
                </td>
                <td>{product.totalPrice} LE</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: "30px",
            textAlign: "right",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            gap: "40px",
          }}
        >
          <Box>
            <p>Subtotal:</p>
            <p>Tax (20%):</p>
            <p>Discount:</p>
            <p>Shipping Rate:</p>
            <h4>Total:</h4>
          </Box>
          <Box>
            <p>LE {order.subtotal}</p>
            <p> {order.tax || 20}%</p>
            <p> LE {order.discount || 0}</p>
            <p> LE {order.shippingFee}</p>
            <h4> LE {order.total}</h4>
          </Box>
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminOrderDetails;
