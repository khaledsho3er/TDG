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
  FormControl,
} from "@mui/material";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from "axios";

const ReturnRequestDetails = ({ request, onBack, refreshList }) => {
  const [brandStatus, setBrandStatus] = useState(request.brandStatus);
  const [updating, setUpdating] = useState(false);
  const [notReceivedReason, setNotReceivedReason] = useState("");

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const url = `https://api.thedesigngrit.com/api/returns-order/returns/${request._id}/brand`;
      const data =
        brandStatus === "Not Received"
          ? { brandStatus, notReceivedReason }
          : { brandStatus };
      await axios.put(url, data, {
        headers: { "Content-Type": "application/json" },
      });
      if (refreshList) refreshList();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box className="dashboard-vendor" sx={{ minHeight: "100vh" }}>
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

            <h2>Return Request</h2>
          </div>
          <p style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
            Home &gt; Return List &gt; Return Request
          </p>
        </div>
      </header>

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
              Status
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
            value={brandStatus}
            onChange={(e) => {
              setBrandStatus(e.target.value);
              if (e.target.value !== "Not Received") setNotReceivedReason("");
            }}
            sx={{ minWidth: 180 }}
            disabled={updating}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Received">Received</MenuItem>
            <MenuItem value="Not Received">Not Received</MenuItem>
          </Select>
          {brandStatus === "Not Received" && (
            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={notReceivedReason}
                onChange={(e) => setNotReceivedReason(e.target.value)}
                displayEmpty
                disabled={updating}
              >
                <MenuItem value="" disabled>
                  <em>Select a reason</em>
                </MenuItem>
                <MenuItem value="Customer did not ship">
                  Customer did not ship
                </MenuItem>
                <MenuItem value="Wrong item returned">
                  Wrong item returned
                </MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button
            variant="contained"
            onClick={handleStatusUpdate}
            disabled={
              updating ||
              brandStatus === request.brandStatus ||
              (brandStatus === "Not Received" && !notReceivedReason)
            }
            sx={{ backgroundColor: "#6b7b58", color: "white" }}
          >
            {updating ? "Updating..." : "Update Status"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReturnRequestDetails;
