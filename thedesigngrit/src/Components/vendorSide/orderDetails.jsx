import React, { useState } from "react";
import { SlCalender } from "react-icons/sl";
import {
  Box,
  Button,
  IconButton,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";
import { IoMdPrint } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
// import { MdOutlineShoppingBag } from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";

import InvoiceDownload from "./invoice";

const OrderDetails = ({ order, onBack }) => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [subDeliveryDate, setSubDeliveryDate] = useState("");

  const [error] = useState(null); // Error state
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const [deliveryDate, setDeliveryDate] = useState(""); // State for delivery date
  const [openFileDialog, setOpenFileDialog] = useState(false); // State for file upload dialog
  const [file, setFile] = useState(null); // State for uploaded file

  if (error) return <p>Error: {error}</p>; // Show error message if any

  const brandId =
    order.cartItems.length > 0 ? order.cartItems[0].brandId : null;

  // Filter products based on brandId
  const filteredProducts = order.cartItems.filter(
    (product) => product.brandId === brandId
  );
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDateChange = (event) => {
    setDeliveryDate(event.target.value);
  };
  const handleFileDialogOpen = () => {
    setOpenFileDialog(true);
  };

  const handleFileDialogClose = () => {
    setOpenFileDialog(false);
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleProductChange = (event) => setSelectedProduct(event.target.value);
  const handleSubDateChange = (event) => setSubDeliveryDate(event.target.value);
  const handleSaveSubDeliveryDate = async () => {
    if (!selectedProduct || !subDeliveryDate) {
      alert("Please select a product and set a delivery date.");
      return;
    }

    try {
      const response = await fetch(
        `https://tdg-db.onrender.com/api/orders/orders/${order._id}/product/${selectedProduct}/update-sub-delivery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subDeliveryDate,
            subOrderStatus: "Scheduled", // Adjust based on your logic
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Delivery Date Updated!");
        setOpen(false);
      } else {
        alert(data.message || "Error updating delivery date");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleSubmitDate = async () => {
    // Make API call to update the delivery date
    try {
      // Replace with your API call
      await fetch(
        `https://tdg-db.onrender.com/api/orders/update-delivery/${order._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deliveryDate }),
        }
      );
      // Close the dialog after successful submission
      handleDialogClose();
      // Optionally, you can refresh the order details or show a success message
    } catch (error) {
      console.error("Error updating delivery date:", error);
    }
  };
  const handleFileUpload = async () => {
    if (!file || !order._id) {
      console.error("File or orderId is missing");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `https://tdg-db.onrender.com/api/orders/upload-file/${order._id}`, // ✅ Use the correct API endpoint
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);

      handleFileDialogClose(); // Close file dialog
      // Optionally, refresh the order details or show a success message
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

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

            <h2>Order List</h2>
          </div>
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
            <InvoiceDownload
              order={order}
              style={{
                marginTop: "10px",
                bgcolor: "#2d2d2d !important", // Using bgcolor instead of backgroundColor
                color: "#2d2d2d",
                borderRadius: "5px",
                padding: "11px 10px",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                "&:hover": {
                  bgcolor: "#2d2d2d",
                  color: "#fff",
                },
              }}
              className="invoice-download-btn"
            >
              <IoMdPrint style={{ color: "#fff", fontSize: "20px" }} />
            </InvoiceDownload>
            {order.orderStatus === "Pending" && (
              <button className="submit-btn" onClick={handleDialogOpen}>
                Set Delivery Date
              </button>
            )}
            {order.orderStatus === "Confirmed" && (
              <button className="submit-btn" onClick={handleFileDialogOpen}>
                Upload File
              </button>
            )}
          </Box>
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Set Delivery Date</DialogTitle>
            <DialogContent>
              <TextField
                type="date"
                value={deliveryDate}
                onChange={handleDateChange}
                fullWidth
                variant="outlined"
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <button onClick={handleDialogClose} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleSubmitDate} className="submit-btn">
                Submit
              </button>
            </DialogActions>
          </Dialog>
          {/* Dialog for File Upload */}
          <Dialog open={openFileDialog} onClose={handleFileDialogClose}>
            <DialogTitle>Upload File</DialogTitle>
            <DialogContent>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ width: "100%" }}
              />
            </DialogContent>
            <DialogActions>
              <button onClick={handleFileDialogClose} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleFileUpload} className="submit-btn">
                Upload
              </button>
            </DialogActions>
          </Dialog>
        </Box>
        <Box
          sx={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "20px", // Adds space between each box
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
              width: "45%", // Ensures equal width for each Box
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
          {/* <Box
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
                </Button> */
          /*} 
            </Box>
          </Box> */}

          {/* Delivery Info Box */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              border: "2px solid #ddd",
              borderRadius: "15px",
              width: "45%", // Ensures equal width for each Box
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
                    // maxWidth: "400px",
                  }}
                >
                  {/* Row 1 */}
                  <p style={{ fontWeight: "bold", margin: 0 }}>Address:</p>
                  <span style={{ margin: 0 }}>
                    {order.shippingDetails.address}
                  </span>

                  {/* Row 2 */}
                  <p style={{ fontWeight: "bold", margin: 0 }}>Label:</p>
                  <span style={{ margin: 0 }}>
                    {order.shippingDetails.label}
                  </span>

                  {/* Row 3 */}
                  <p style={{ fontWeight: "bold", margin: 0 }}>Apartment:</p>
                  <span style={{ margin: 0 }}>
                    {order.shippingDetails.apartment}
                  </span>

                  {/* Row 4 */}
                  <p style={{ fontWeight: "bold", margin: 0 }}>Floor:</p>
                  <span style={{ margin: 0 }}>
                    {order.shippingDetails.floor}
                  </span>
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3>Products</h3>
          <button className="submit-btn" onClick={handleOpen}>
            Set Delivery Date
          </button>
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

        {/* Set Delivery Date Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Set Delivery Date</DialogTitle>
          <DialogContent>
            {/* Product Selection */}
            <Select
              value={selectedProduct}
              onChange={handleProductChange}
              fullWidth
            >
              {filteredProducts.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>

            {/* Delivery Date Input */}
            <TextField
              type="date"
              fullWidth
              margin="normal"
              value={subDeliveryDate}
              onChange={handleSubDateChange}
            />
          </DialogContent>
          <DialogActions>
            <Button className="cancel-btn" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="submit-btn" onClick={handleSaveSubDeliveryDate}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

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
  );
};

export default OrderDetails;
