import React, { useState } from "react";
import { Box, Button, Select, MenuItem } from "@mui/material";

const ReturnRequestDetails = ({ request, onBack, refreshList }) => {
  const [brandStatus, setBrandStatus] = useState(request.brandStatus);
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(
        `https://api.thedesigngrit.com/api/returns-order/returns/${request._id}/brand`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      if (refreshList) refreshList();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="dashboard-vendor">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <Button onClick={onBack}>&larr; Back</Button>
          <h2>Return Request Details</h2>
        </div>
      </header>
      <Box sx={{ background: "#fff", borderRadius: 2, p: 3, m: 2 }}>
        <h3>Order ID: {request.orderId?._id}</h3>
        <p>
          <strong>Customer:</strong> {request.customerId?.firstName}{" "}
          {request.customerId?.lastName} ({request.customerId?.email})
        </p>
        <p>
          <strong>Status:</strong> {request.status}
        </p>
        <p>
          <strong>Brand Status:</strong> {request.brandStatus}
        </p>
        <p>
          <strong>Requested At:</strong>{" "}
          {new Date(request.requestedAt).toLocaleString()}
        </p>
        <p>
          <strong>Refund Amount:</strong> {request.totalRefundAmount} E£
        </p>
        <p>
          <strong>Reason:</strong> {request.reason}
        </p>
        <h4>Items</h4>
        <table style={{ width: "100%", marginBottom: 16 }}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Color</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {request.items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.selectedColor}</td>
                <td>{item.selectedSize}</td>
                <td>{item.quantity}</td>
                <td>{item.price} E£</td>
                <td>{item.totalPrice} E£</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Select
            value={brandStatus}
            onChange={(e) => setBrandStatus(e.target.value)}
            sx={{ minWidth: 180 }}
            disabled={updating}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Returned">Returned</MenuItem>
            <MenuItem value="NotReturned">NotReturned</MenuItem>
          </Select>
          <Button
            variant="contained"
            onClick={handleStatusUpdate}
            disabled={updating || brandStatus === request.brandStatus}
            sx={{ backgroundColor: "#6b7b58", color: "white" }}
          >
            {updating ? "Updating..." : "Update Status"}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default ReturnRequestDetails;
