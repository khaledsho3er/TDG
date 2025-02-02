import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import { Box, Button } from "@mui/material";
import VendorPageLayout from "./VendorLayout";
import { IoMdPrint } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiPackage } from "react-icons/fi";

const OrderDetails = () => {
  const { id } = useParams(); // Get order ID from the URL
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state

  // const [status, setStatus] = useState(""); // State to track the status change

  // Fetch order details from the API when the component mounts
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchOrderData();
  }, [id]); // Run this effect only when the order ID changes
  // Handle the status change
  // const handleStatusChange = (event) => {
  //   setStatus(event.target.value); // Update the status when the user selects a new one
  // };

  if (loading) return <p>Loading...</p>; // Show loading text while fetching
  if (error) return <p>Error: {error}</p>; // Show error message if any

  return (
    <VendorPageLayout>
      <div>
        <header className="dashboard-header-vendor">
          <div className="dashboard-header-title">
            <h2>Order List</h2>
            <p style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
              Home &gt; Order List &gt; Order Details
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
                      order.status === "Delivered" ? "#d4edda" : "#f8d7da", // Green for delivered, red for canceled
                    color: order.status === "Delivered" ? "#155724" : "#721c24", // Text color for visibility
                    fontWeight: "500",
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
                  June 12, 2024 - Oct 19, 2024
                </span>
              </div>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              {/* <Select
                sx={{
                  width: "200px",
                  backgroundColor: "#ddd",
                  borderRadius: "5px",
                  padding: "0px",
                  color: "#2d2d2d",
                }}
                value={status} // Bind the value to the status state
                onChange={handleStatusChange} // Handle the change
              >
                <MenuItem value="">Change Status</MenuItem>{" "}
                
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Canceled">Canceled</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>{" "}
              
              </Select>*/}
              <Button
                sx={{
                  marginTop: "10px",
                  backgroundColor: "#ddd",
                  color: "#2d2d2d",
                  borderRadius: "5px",
                  padding: "11px 10px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  "&:hover": {
                    backgroundColor: "#2d2d2d",
                    color: "#fff",
                  },
                }}
              >
                <IoMdPrint />
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "20px", // Adds space between each box
            }}
          >
            {/* Customer Info Box */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "2px solid #ddd",
                borderRadius: "15px",
                width: "30%", // Ensures equal width for each Box
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
                  }}
                >
                  <h4>Customer</h4>
                  <div
                    style={{
                      fontFamily: "Montserrat",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "5px",
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
                        alignItems: "end",
                        gap: "5px",
                      }}
                    >
                      <span> {order.customerId.firstName}</span>
                      <span> {order.customerId.email}</span>
                      <span> {order.customerId.phoneNumber}</span>
                    </div>
                  </div>
                </div>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                {/* <Button
                  sx={{
                    width: "80%",
                    marginTop: "10px",
                    padding: "10px 15px",
                    backgroundColor: "#6c7c59",
                    color: "#fff",
                    borderRadius: "8px",
                    fontFamily: "Montserrat",
                    "&:hover": {
                      backgroundColor: "#2d2d2d",
                      color: "#fff",
                    },
                  }}
                >
                  View Profile
                </Button> */}
              </Box>
            </Box>

            {/* Order Info Box */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "2px solid #ddd",
                borderRadius: "15px",
                width: "30%", // Ensures equal width for each Box
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
                    color: "#fff",
                    fontSize: "20px",
                  }}
                >
                  <MdOutlineShoppingBag />
                </Box>
                <div
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  <h4>Billing Info</h4>
                  <p>Address: {order.billingDetails.address}</p>
                  <p>Country: {order.billingDetails.country}</p>
                  <p>zip Code: {order.billingDetails.zipCode}</p>
                </div>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                {/* <Button
                  sx={{
                    width: "80%",
                    marginTop: "10px",
                    padding: "10px 15px",
                    backgroundColor: "#6c7c59",
                    color: "#fff",
                    borderRadius: "8px",
                    fontFamily: "Montserrat",
                    "&:hover": {
                      backgroundColor: "#2d2d2d",
                      color: "#fff",
                    },
                  }}
                >
                  Download File{" "}
                </Button> */}
              </Box>
            </Box>

            {/* Delivery Info Box */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "2px solid #ddd",
                borderRadius: "15px",
                width: "30%", // Ensures equal width for each Box
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
                  }}
                >
                  <h4>Delivery</h4>
                  <div
                    style={{
                      fontFamily: "Montserrat",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: "5px",
                      }}
                    >
                      <p>Address: </p>
                      <p>Label:</p>
                      <p>Apartment:</p>
                      <p>Floor:</p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "5px",
                      }}
                    >
                      <span> {order.shippingDetails.address} </span>
                      <span> {order.shippingDetails.label} </span>
                      <span> {order.shippingDetails.apartment} </span>
                      <span> {order.shippingDetails.floor} </span>
                    </div>
                  </div>
                </div>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  padding: "10px",
                }}
              >
                {/* <Button
                  sx={{
                    width: "80%",
                    marginTop: "10px",
                    padding: "10px 15px",
                    backgroundColor: "#6c7c59",
                    color: "#fff",
                    borderRadius: "8px",
                    fontFamily: "Montserrat",
                    "&:hover": {
                      backgroundColor: "#2d2d2d",
                      color: "#fff",
                    },
                  }}
                >
                  View Profile
                </Button> */}
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
                <img src="/Assets/icons/visa.png" alt="Visa" />
              </Box>
              <p>Payment Method: {order.paymentDetails.paymentMethod}</p>
              <p>
                Transaction ID:{" "}
                {order.paymentDetails.transactionId || "120002554"}
              </p>
              <p>
                Payment Status:{" "}
                {order.paymentDetails.paymentStatus || "Pending"}
              </p>
            </Box>
            {/* Note Box */}
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "65%" }}
            >
              <h4>Notes</h4>
              <textarea
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "2px solid #ddd",
                  borderRadius: "15px",
                  width: "97%",
                  fontSize: "14px",
                  padding: "10px",
                  height: "150px",
                  fontFamily: "Montserrat",
                  color: "#ddd",
                }}
                placeholder="Type some notes....."
              ></textarea>
            </Box>
          </Box>
        </Box>

        <div className="products-purchases-order" style={{ padding: "20px" }}>
          <h3 style={{ marginTop: "20px" }}>Products</h3>
          <hr></hr>
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
              {order.cartItems.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product._id}</td>
                  <td>{product.quantity} Item</td>
                  <td>
                    {" "}
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "5px",
                        backgroundColor:
                          order.status === "Delivered" ? "#d4edda" : "#f8d7da", // Green for delivered, red for pending
                        color:
                          order.status === "Delivered" ? "#155724" : "#721c24", // Text color for visibility
                        fontWeight: "500",
                        textAlign: "center",
                        minWidth: "80px",
                      }}
                    >
                      {order.orderStatus}
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
      </div>
    </VendorPageLayout>
  );
};

export default OrderDetails;
