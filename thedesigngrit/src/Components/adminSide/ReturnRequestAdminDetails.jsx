import React, { useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoIosArrowRoundBack } from "react-icons/io";

const ReturnRequestAdminDetails = ({ request, onBack, refreshList }) => {
  const [adminStatus, setAdminStatus] = useState(request.status);
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(
        `https://api.thedesigngrit.com/api/returns-order/returns/${request._id}/admin`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: adminStatus }),
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
    <Box
      className="dashboard-vendor"
      sx={{ background: "#f7f7f7", minHeight: "100vh" }}
    >
      <Paper
        elevation={2}
        sx={{ mb: 3, borderRadius: 3, p: 2, background: "#fff" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Back to Return Requests">
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
              <IoIosArrowRoundBack size={32} />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, fontFamily: "Montserrat" }}
          >
            Return Request Details (Admin)
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 13, color: "#888", mt: 0.5, ml: 6 }}>
          Home &gt; Return Requests &gt; Details
        </Typography>
      </Paper>
      <Paper
        elevation={1}
        sx={{ borderRadius: 3, p: 3, maxWidth: 900, mx: "auto" }}
      >
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Order ID
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {request.orderId?._id}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Brand
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {request.brandId?.brandName}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Customer
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {request.customerId?.firstName} {request.customerId?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {request.customerId?.email}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Status (Admin)
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {request.status}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Brand Status
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {request.brandStatus}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Requested At
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {new Date(request.requestedAt).toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Refund Amount
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {request.totalRefundAmount?.toLocaleString()} E£
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Reason
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {request.reason}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Items
        </Typography>
        <Box sx={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fafafa",
            }}
          >
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th style={{ padding: 10, textAlign: "left" }}>Product Name</th>
                <th style={{ padding: 10, textAlign: "left" }}>Color</th>
                <th style={{ padding: 10, textAlign: "left" }}>Size</th>
                <th style={{ padding: 10, textAlign: "left" }}>Quantity</th>
                <th style={{ padding: 10, textAlign: "left" }}>Price</th>
                <th style={{ padding: 10, textAlign: "left" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {request.items.map((item, idx) => (
                <tr
                  key={item._id}
                  style={{ background: idx % 2 === 0 ? "#fff" : "#f7f7f7" }}
                >
                  <td
                    style={{
                      padding: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {item.name}
                    <Tooltip title="View product details">
                      <IconButton
                        size="small"
                        onClick={() =>
                          window.open(
                            `https://thedesigngrit.com/product/${item.productId}`,
                            "_blank"
                          )
                        }
                        sx={{ ml: 1 }}
                      >
                        <AiOutlineInfoCircle style={{ color: "#6b7b58" }} />
                      </IconButton>
                    </Tooltip>
                  </td>
                  <td style={{ padding: 10 }}>{item.selectedColor}</td>
                  <td style={{ padding: 10 }}>{item.selectedSize}</td>
                  <td style={{ padding: 10 }}>{item.quantity}</td>
                  <td style={{ padding: 10 }}>
                    {item.price?.toLocaleString()} E£
                  </td>
                  <td style={{ padding: 10 }}>
                    {item.totalPrice?.toLocaleString()} E£
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
          <Select
            value={adminStatus}
            onChange={(e) => setAdminStatus(e.target.value)}
            sx={{ minWidth: 180 }}
            disabled={updating}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
          </Select>
          <Button
            variant="contained"
            onClick={handleStatusUpdate}
            disabled={updating || adminStatus === request.status}
            sx={{ backgroundColor: "#6b7b58", color: "white" }}
          >
            {updating ? "Updating..." : "Update Status"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReturnRequestAdminDetails;
