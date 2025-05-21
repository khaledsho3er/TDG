import React, { useState, useEffect } from "react";
import { useVendor } from "../../utils/vendorContext";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { IoIosArrowRoundBack } from "react-icons/io";

const OrderDetails = ({ order, onBack }) => {
  const { vendor } = useVendor(); // Get vendor data including brandId
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [subDeliveryDate, setSubDeliveryDate] = useState("");
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [file, setFile] = useState(null);
  const [note, setNote] = useState(order?.note || "");
  const [notePostedAt, setNotePostedAt] = useState(order?.notePostedAt || null);
  const [isReadOnly, setIsReadOnly] = useState(!!order?.note);
  const [showButton, setShowButton] = useState(!!order?.note);

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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setSubDeliveryDate("");
  };

  const handleSubDateChange = (e) => {
    setSubDeliveryDate(e.target.value);
  };

  const handleSaveSubDeliveryDate = async () => {
    if (!selectedProduct || !subDeliveryDate) {
      alert("Please select a product and set a delivery date.");
      return;
    }

    try {
      const response = await axios.put(
        `https://api.thedesigngrit.com/api/orders/${order._id}/product/${selectedProduct._id}/update-sub-delivery`,
        {
          subDeliveryDate,
          subOrderStatus: "Confirmed",
        }
      );

      alert(response.data.message);
      handleClose();
      // Refresh the order data
      window.location.reload();
    } catch (error) {
      console.error("Error updating sub-delivery date:", error);
      alert("Failed to update sub-delivery date.");
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDateChange = (e) => {
    setDeliveryDate(e.target.value);
  };

  const handleSaveDeliveryDate = async () => {
    if (!deliveryDate) {
      alert("Please set a delivery date.");
      return;
    }

    try {
      const response = await axios.put(
        `https://api.thedesigngrit.com/api/orders/${order._id}/update-delivery`,
        {
          deliveryDate,
          orderStatus: "Confirmed",
        }
      );

      alert(response.data.message);
      handleDialogClose();
      // Refresh the order data
      window.location.reload();
    } catch (error) {
      console.error("Error updating delivery date:", error);
      alert("Failed to update delivery date.");
    }
  };

  const handleFileDialogOpen = () => {
    setOpenFileDialog(true);
  };

  const handleFileDialogClose = () => {
    setOpenFileDialog(false);
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `https://api.thedesigngrit.com/api/orders/${order._id}/upload-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      handleFileDialogClose();
      // Refresh the order data
      window.location.reload();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleNoteSubmit = async () => {
    if (!note.trim()) {
      alert("Please enter a note.");
      return;
    }

    try {
      const response = await axios.put(
        `https://api.thedesigngrit.com/api/orders/${order._id}/add-note`,
        {
          note,
        }
      );

      alert(response.data.message);
      setIsReadOnly(true);
      setShowButton(false);
      setNotePostedAt(new Date().toISOString());
      // Refresh the order data
      // window.location.reload();
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add note.");
    }
  };

  if (error) return <p>Error: {error}</p>;

  if (!order) return <div>Order not found</div>;

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
            <IoIosArrowRoundBack
              size={"50px"}
              onClick={onBack}
              style={{ cursor: "pointer" }}
            />
            <h2>Order Details</h2>
          </div>
          <p style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
            Home &gt; Orders &gt; Order Details
          </p>
        </div>
      </header>

      <div className="order-details-container">
        <div className="order-details-header">
          <div className="order-id">
            <h3>Order ID: {order._id}</h3>
            <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
          <div className="order-status">
            <span
              style={{
                display: "inline-block",
                padding: "8px 16px",
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
              }}
            >
              {order.orderStatus}
            </span>
          </div>
        </div>

        <div className="order-details-content">
          <div className="customer-info">
            <h3>Customer Information</h3>
            <p>
              <strong>Name:</strong>{" "}
              {order.customerId
                ? `${order.customerId.firstName} ${order.customerId.lastName}`
                : `${order.billingDetails.firstName} ${order.billingDetails.lastName}`}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {order.customerId
                ? order.customerId.email
                : order.billingDetails.email}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {order.customerId
                ? order.customerId.phoneNumber
                : order.billingDetails.phoneNumber}
            </p>
          </div>

          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <p>
              <strong>Address:</strong> {order.shippingDetails.address}
            </p>
            <p>
              <strong>City:</strong> {order.shippingDetails.city}
            </p>
            <p>
              <strong>Country:</strong> {order.shippingDetails.country}
            </p>
            <p>
              <strong>Zip Code:</strong> {order.shippingDetails.zipCode}
            </p>
          </div>

          <div className="payment-info">
            <h3>Payment Information</h3>
            <p>
              <strong>Method:</strong> {order.paymentDetails.paymentMethod}
            </p>
            <p>
              <strong>Card Number:</strong>{" "}
              {order.paymentDetails.cardNumber
                ? `**** **** **** ${order.paymentDetails.cardNumber.slice(-4)}`
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="order-products">
          <h3>Products</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.productId?._id || product.productId}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No products found for this brand.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>{order.subtotal} LE</span>
          </div>
          <div className="summary-item">
            <span>Shipping Fee:</span>
            <span>{order.shippingFee} LE</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>{order.total} LE</span>
          </div>
        </div>

        <div className="order-actions">
          <button className="action-btn" onClick={handleOpen}>
            Set Sub-Delivery Date
          </button>
          <button className="action-btn" onClick={handleDialogOpen}>
            Set Delivery Date
          </button>
          {filteredProducts.every(
            (item) => item.subOrderStatus === "Confirmed"
          ) && (
            <button className="submit-btn" onClick={handleFileDialogOpen}>
              Upload File
            </button>
          )}
        </div>

        <div className="order-notes">
          <h3>Order Notes</h3>
          <textarea
            value={note}
            onChange={handleNoteChange}
            placeholder="Add a note about this order..."
            readOnly={isReadOnly}
          />
          {notePostedAt && (
            <p className="note-timestamp">
              Posted on: {new Date(notePostedAt).toLocaleString()}
            </p>
          )}
          {!isReadOnly && (
            <button className="submit-btn" onClick={handleNoteSubmit}>
              Submit Note
            </button>
          )}
        </div>
      </div>

      {/* Set Sub-Delivery Date Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set Sub-Delivery Date</DialogTitle>
        <DialogContent>
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
            style={{ marginTop: "16px", marginBottom: "16px" }}
          >
            {filteredProducts.map((product) => (
              <MenuItem key={product._id} value={product._id}>
                {product.name} - {product.productId?._id || product.productId}
              </MenuItem>
            ))}
          </Select>

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

      {/* Set Delivery Date Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Set Delivery Date</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            fullWidth
            margin="normal"
            value={deliveryDate}
            onChange={handleDateChange}
          />
        </DialogContent>
        <DialogActions>
          <Button className="cancel-btn" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button className="submit-btn" onClick={handleSaveDeliveryDate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload File Dialog */}
      <Dialog open={openFileDialog} onClose={handleFileDialogClose}>
        <DialogTitle>Upload File</DialogTitle>
        <DialogContent>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ margin: "16px 0" }}
          />
        </DialogContent>
        <DialogActions>
          <Button className="cancel-btn" onClick={handleFileDialogClose}>
            Cancel
          </Button>
          <Button className="submit-btn" onClick={handleFileUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderDetails;
