import React, { useState, useEffect } from "react";
import { SlCalender } from "react-icons/sl";
import { useVendor } from "../../utils/vendorContext";

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
import axios from "axios";
// import { MdOutlineShoppingBag } from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { LuInfo } from "react-icons/lu";

const InvoiceDownload = React.lazy(() => import("./invoice"));
const OrderDetails = ({ order, onBack }) => {
  const { vendor } = useVendor(); // Get vendor data including brandId

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [subDeliveryDate, setSubDeliveryDate] = useState("");
  const [error] = useState(null); // Error state
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const [deliveryDate, setDeliveryDate] = useState(""); // State for delivery date
  const [openFileDialog, setOpenFileDialog] = useState(false); // State for file upload dialog
  const [file, setFile] = useState(null); // State for uploaded file
  const [note, setNote] = useState(order?.note || "");
  const [notePostedAt, setNotePostedAt] = useState(order?.notePostedAt || null);
  const [isReadOnly, setIsReadOnly] = useState(!!order?.note);
  const [showButton, setShowButton] = useState(!!order?.note);
  const [paymentStatus, setPaymentStatus] = useState(
    order.paymentDetails.paymentStatus || "Pending"
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [openQuotationDialog, setOpenQuotationDialog] = useState(false);
  const [selectedQuotationDetails, setSelectedQuotationDetails] =
    useState(null);

  // Filter products based on vendor's brandId
  const filteredProducts = order.cartItems.filter((product) => {
    // Get the brandId from the product
    const productBrandId =
      product.brandId && typeof product.brandId === "object"
        ? product.brandId._id
        : product.brandId;

    // Get the vendor's brandId
    const vendorBrandId = vendor.brandId;

    // Compare them
    return productBrandId === vendorBrandId;
  });

  useEffect(() => {
    if (order.note) {
      setNote(order.note);
      setNotePostedAt(order.notePostedAt || null);
      setIsReadOnly(true);
      setShowButton(false);
    }
  }, [order.note, order.notePostedAt]);

  useEffect(() => {
    if (filteredProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(filteredProducts[0]);
    }
  }, [filteredProducts, selectedProduct]);

  // Debug logging effect
  useEffect(() => {
    console.log("Order:", order);
    console.log("Vendor:", vendor);
    console.log("Vendor BrandId:", vendor.brandId);
    console.log("Cart Items:", order.cartItems);

    // Log the structure of brandId in each cart item
    order.cartItems.forEach((item, index) => {
      const itemBrandId =
        item.brandId && typeof item.brandId === "object"
          ? item.brandId._id
          : item.brandId;

      console.log(`Item ${index} brandId:`, item.brandId);
      console.log(`Item ${index} extracted brandId:`, itemBrandId);
      console.log(
        `Item ${index} matches vendor brandId:`,
        itemBrandId === vendor.brandId
      );
    });

    console.log("Filtered Products:", filteredProducts);
  }, [order, vendor, filteredProducts]);

  useEffect(() => {
    setPaymentStatus(order.paymentDetails.paymentStatus || "Pending");
  }, [order.paymentDetails.paymentStatus]);

  if (error) return <p>Error: {error}</p>; // Show error message if any

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
  const handleSubDateChange = (event) => setSubDeliveryDate(event.target.value);

  const handleSaveSubDeliveryDate = async () => {
    if (!selectedProduct || !subDeliveryDate) {
      alert("Please select a product and a delivery date.");
      return;
    }

    const parentOrderId = order._id; // Main order ID
    const cartItemId = selectedProduct._id; // Selected cartItem ID
    try {
      const response = await fetch(
        `https://api.thedesigngrit.com/api/orders/orders/${parentOrderId}/cart-items/${cartItemId}/delivery-date`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subDeliveryDate }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Sub-delivery date updated successfully!");
        setOpen(false);
      } else {
        alert(data.message || "Error updating sub-delivery date");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update sub-delivery date.");
    }
  };

  const handleSubmitDate = async () => {
    // Make API call to update the delivery date
    try {
      // Replace with your API call
      await fetch(
        `https://api.thedesigngrit.com/api/orders/update-delivery/${order._id}`,
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
        `https://api.thedesigngrit.com/api/orders/upload-file/${order._id}`, // ✅ Use the correct API endpoint
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

  const handleChange = (e) => {
    setNote(e.target.value);
    setShowButton(e.target.value.trim() !== ""); // Show button when user starts typing
  };

  const handlePostNote = async () => {
    try {
      await axios.put(
        `https://api.thedesigngrit.com/api/orders/orders/${order._id}/note`,
        {
          note,
        }
      );
      const now = new Date();
      setNotePostedAt(now);
      setIsReadOnly(true);
      setShowButton(false);
    } catch (error) {
      console.error("Error posting note:", error);
    }
  };

  const handlePaymentStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(
        `https://api.thedesigngrit.com/api/orders/${order._id}/payment-status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentStatus: newStatus }),
        }
      );
      if (!response.ok) throw new Error("Failed to update payment status");
      setPaymentStatus(newStatus);
    } catch (err) {
      alert("Failed to update payment status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const subtotal = order.subtotal ?? "N/A";
  const tax = order.taxAmount ?? order.tax ?? "N/A"; // Use taxAmount if available, else tax, else N/A
  const shippingFee = order.shippingFee ?? "N/A";
  const discount = order.discount ?? 0;
  const total = order.total ?? "N/A";

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

            {order.orderStatus === "Delivered"
              ? order.POD && (
                  <button
                    className="submit-btn"
                    onClick={() =>
                      window.open(
                        `https://pub-64ea2c5c4ba5460991425897a370f20c.r2.dev/${order.POD}`,
                        "_blank"
                      )
                    }
                  >
                    View POD
                  </button>
                )
              : filteredProducts.every(
                  (item) => item.subOrderStatus === "Confirmed"
                ) && (
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
                    <span> {order?.customerId?.firstName || "N/A"}</span>
                    <span> {order?.customerI?.email || "N/A"}</span>
                    <span> {order?.billingDetails?.phoneNumber || "N/A"}</span>
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
            ></Box>
          </Box>
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
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                  }}
                >
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
                      {order?.shippingDetails?.address || "N/A"}
                    </span>

                    {/* Row 2 */}
                    <p style={{ fontWeight: "bold", margin: 0 }}>Label:</p>
                    <span style={{ margin: 0 }}>
                      {order?.shippingDetails?.label || "N/A"}
                    </span>

                    {/* Row 3 */}
                    <p style={{ fontWeight: "bold", margin: 0 }}>Apartment:</p>
                    <span style={{ margin: 0 }}>
                      {order?.shippingDetails?.apartment || "N/A"}
                    </span>

                    {/* Row 4 */}
                    <p style={{ fontWeight: "bold", margin: 0 }}>Floor:</p>
                    <span style={{ margin: 0 }}>
                      {order?.shippingDetails?.floor || "N/A"}
                    </span>
                  </div>

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
                    <p style={{ fontWeight: "bold", margin: 0 }}></p>
                    <span style={{ margin: 0 }}></span>
                    {/* Row 1 */}
                    <p style={{ fontWeight: "bold", margin: 0 }}>Country:</p>
                    <span style={{ margin: 0 }}>
                      {order?.shippingDetails?.country || "N/A"}
                    </span>

                    {/* Row 2 */}
                    <p style={{ fontWeight: "bold", margin: 0 }}>City:</p>
                    <span style={{ margin: 0 }}>
                      {order?.shippingDetails?.city || "N/A"}
                    </span>

                    {/* Row 3 */}
                    <p style={{ fontWeight: "bold", margin: 0 }}>Zip Code:</p>
                    <span style={{ margin: 0 }}>
                      {order?.shippingDetails?.zipCode || "N/A"}
                    </span>
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
            ></Box>
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
              <img
                src={
                  order.paymentDetails.paymentMethod?.toLowerCase() === "paymob"
                    ? "/Assets/paymobpng.png"
                    : order.paymentDetails.paymentMethod?.toLowerCase() ===
                      "cod"
                    ? "/Assets/cashondelpng.png"
                    : "/Assets/visa-logo.webp"
                }
                alt={
                  order.paymentDetails.paymentMethod?.toLowerCase() === "paymob"
                    ? "Paymob"
                    : order.paymentDetails.paymentMethod?.toLowerCase() ===
                      "cod"
                    ? "Cash on Delivery"
                    : "Visa"
                }
                width={"50px"}
                height={"35px"}
              />
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
                  <p>{order.paymentDetails.paymentMethod || "N/A"}</p>
                  <p>
                    {order.paymentDetails.transactionId || "Cash Dont Have ID"}
                  </p>
                  <p>
                    {order.paymentDetails.paymentMethod === "cod" &&
                    paymentStatus === "Pending" ? (
                      <select
                        value={paymentStatus}
                        onChange={handlePaymentStatusChange}
                        disabled={isUpdatingStatus}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontFamily: "Montserrat",
                          fontWeight: "bold",
                          background: "#f5f5f5",
                          color: "#2d2d2d",
                          border: "1px solid #6b7b58",
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    ) : (
                      <span>{paymentStatus || "N/A"}</span>
                    )}
                  </p>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Note Box */}
          <Box sx={{ display: "flex", flexDirection: "column", width: "65%" }}>
            <h4>Notes</h4>
            <div style={{ position: "relative", width: "97%" }}>
              {notePostedAt && (
                <div
                  style={{
                    position: "absolute",
                    top: "123px",
                    right: "31px",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  {new Date(notePostedAt).toLocaleString()}
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
                  color: isReadOnly ? "#2d2d2d" : "#2d2d2d",
                  backgroundColor: isReadOnly ? "#f5f5f5" : "white",
                  cursor: isReadOnly ? "not-allowed" : "text",
                }}
                placeholder="Type some notes..."
                value={note}
                onChange={handleChange}
                readOnly={isReadOnly}
              ></textarea>
            </div>
            {showButton && !isReadOnly && (
              <Button
                sx={{
                  marginTop: "10px",
                  width: "150px",
                  backgroundColor: "#2d2d2d",
                  color: "#fff",
                  ":hover": { backgroundColor: "#2d2d2d" },
                }}
                onClick={handlePostNote}
              >
                Post Note
              </Button>
            )}
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
              <th>Color</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Total</th>
              <th>Quotation Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product?.name}</td>
                  <td>{product?._id}</td>
                  <td>{product?.selectedColor || "Default"}</td>
                  <td>{product?.selectedSize || "Default"}</td>
                  <td>{product?.quantity} Item</td>
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
                      {product?.subOrderStatus}
                    </span>
                  </td>
                  <td>{product?.totalPrice} E£</td>
                  <td style={{ textAlign: "center" }}>
                    {product?.fromQuotation && product?.quotationId ? (
                      <IconButton
                        onClick={() => {
                          setSelectedQuotationDetails({
                            color: product.color,
                            size: product.size,
                            material: product.material,
                            customization: product.customization,
                          });
                          setOpenQuotationDialog(true);
                        }}
                        size="small"
                        aria-label="View Quotation Details"
                      >
                        <LuInfo color="#6b7b58" size={22} />
                      </IconButton>
                    ) : (
                      <span style={{ color: "#aaa" }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No products found for this brand.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Set Delivery Date Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: "rgba(107, 123, 88, 0.97)", // Brand green with opacity
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              backdropFilter: "blur(8px)",
              minWidth: 400,
              color: "#fff",
              fontFamily: "Montserrat",
              p: 2,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: "Horizon, Montserrat",
              fontWeight: "bold",
              color: "#fff",
              background: "rgba(107, 123, 88, 0.85)",
              borderRadius: "16px 16px 0 0",
              fontSize: "1.5rem",
              letterSpacing: "1px",
              textAlign: "center",
              mb: 1,
              p: 2,
            }}
          >
            Set Sub-Delivery Date
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Select
              value={selectedProduct ? selectedProduct._id : ""}
              onChange={(e) => {
                const product = filteredProducts.find(
                  (p) => p._id === e.target.value
                );
                setSelectedProduct(product);
              }}
              fullWidth
              margin="normal"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontFamily: "Montserrat",
              }}
            >
              {filteredProducts.map((product) => (
                <MenuItem key={product?._id} value={product?._id}>
                  {product?.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              type="date"
              fullWidth
              margin="normal"
              value={subDeliveryDate}
              onChange={handleSubDateChange}
              sx={{
                background: "#fff",
                borderRadius: 2,
                fontFamily: "Montserrat",
              }}
              InputLabelProps={{
                style: { color: "#6b7b58" },
              }}
              inputProps={{
                style: { color: "#2d2d2d" },
              }}
            />
          </DialogContent>
          <DialogActions
            sx={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "0 0 16px 16px",
              p: 2,
              justifyContent: "center",
              gap: 2,
            }}
          >
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
            <p>Tax (14%):</p>
            <p>Discount:</p>
            <p>Shipping Rate:</p>
            <h4>Total:</h4>
          </Box>
          <Box>
            <p>{subtotal !== "N/A" ? `E£ ${subtotal}` : "N/A"}</p>
            <p>{tax !== "N/A" ? `E£ ${tax}` : "N/A"}</p>
            <p>{discount !== 0 ? `E£ ${discount}` : "E£ 0"}</p>
            <p>{shippingFee !== "N/A" ? `E£ ${shippingFee}` : "N/A"}</p>
            <h4>{total !== "N/A" ? `E£ ${total}` : "N/A"}</h4>
          </Box>
        </div>
      </div>

      {/* Quotation Details Dialog */}
      <Dialog
        open={openQuotationDialog}
        onClose={() => setOpenQuotationDialog(false)}
        sx={{
          zIndex: 9999,
          position: "fixed",
          backdropFilter: "blur(4px)",
          "& .MuiPaper-root": {
            borderRadius: "16px",
            backdropFilter: "blur(5px)",
            backgroundColor: "#6b7b58",
          },
        }}
      >
        <DialogTitle
          style={{
            fontWeight: "normal",
            backgroundColor: "#6b7b58",
            color: "white",
            paddingLeft: "16px",
            border: "none",
          }}
        >
          Quotation Details
        </DialogTitle>
        <DialogContent
          style={{
            fontWeight: "bold",
            backgroundColor: "#6b7b58",
            color: "white",
          }}
        >
          {selectedQuotationDetails ? (
            <Box sx={{ fontFamily: "Montserrat", minWidth: 300 }}>
              <p>
                <strong>Color:</strong>{" "}
                {selectedQuotationDetails?.selectedColor || "N/A"}
              </p>
              <p>
                <strong>Size:</strong>{" "}
                {selectedQuotationDetails?.selectedSize || "N/A"}
              </p>
              <p>
                <strong>Material:</strong>{" "}
                {selectedQuotationDetails?.material || "N/A"}
              </p>
              <p>
                <strong>Customization:</strong>{" "}
                {selectedQuotationDetails?.customization ||
                  "No specific customization"}
              </p>
            </Box>
          ) : (
            <p>No details available.</p>
          )}
        </DialogContent>
        <DialogActions
          style={{
            fontWeight: "bold",
            backgroundColor: "#6b7b58",
          }}
        >
          <Button
            onClick={() => setOpenQuotationDialog(false)}
            sx={{
              color: "white",
              border: "none",
              "&:hover": {
                backgroundColor: "#2d2d2d",
                border: "none",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderDetails;
