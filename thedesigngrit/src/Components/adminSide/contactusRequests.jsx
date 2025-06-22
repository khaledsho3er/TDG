import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";

const API_URL = "https://api.thedesigngrit.com/api/contactus/admin/messages";
const DELETE_URL = "https://api.thedesigngrit.com/api/contactus/admin/message/";

const ContactUsRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching contactus requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleCloseView = () => {
    setViewDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
    setDeletingId(id);
    try {
      await axios.delete(`${DELETE_URL}${id}`);
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      alert("Failed to delete request. Please try again.");
      console.error("Error deleting request:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: "40px 0" }}>
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>ContactUs Requests</h2>
          <p>Admin Dashboard &gt; ContactUs Requests</p>
        </div>
      </header>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="600">
            ContactUs Requests
          </Typography>
        </Box>
        <Box sx={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 8px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    borderRadius: "8px 0 0 8px",
                  }}
                >
                  Name
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  Email
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  Subject
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  Message
                </th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>
                  Date
                </th>
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    borderRadius: "0 8px 8px 0",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    <CircularProgress style={{ color: "#6b7b58" }} />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      No requests found
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr
                      key={req._id}
                      style={{
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      <td
                        style={{ padding: "16px", borderRadius: "8px 0 0 8px" }}
                      >
                        {req.name}
                      </td>
                      <td style={{ padding: "16px" }}>{req.email}</td>
                      <td style={{ padding: "16px" }}>{req.subject}</td>
                      <td
                        style={{
                          padding: "16px",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {req.message}
                      </td>
                      <td style={{ padding: "16px" }}>
                        {new Date(req.createdAt).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          display: "flex",
                          gap: 8,
                          borderRadius: "0 8px 8px 0",
                        }}
                      >
                        <button
                          style={{
                            backgroundColor: "#6a8452",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: 500,
                            transition: "background-color 0.3s",
                          }}
                          onClick={() => handleView(req)}
                        >
                          View
                        </button>
                        <button
                          style={{
                            backgroundColor: "#d9534f",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "5px",
                            cursor:
                              deletingId === req._id
                                ? "not-allowed"
                                : "pointer",
                            fontWeight: 500,
                            opacity: deletingId === req._id ? 0.6 : 1,
                            transition: "background-color 0.3s",
                          }}
                          onClick={() => handleDelete(req._id)}
                          disabled={deletingId === req._id}
                        >
                          {deletingId === req._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            )}
          </table>
        </Box>
      </Paper>
      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseView}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>ContactUs Request Details</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="h6">Name: {selectedRequest.name}</Typography>
              <Typography variant="body1">
                Email: {selectedRequest.email}
              </Typography>
              <Typography variant="body1">
                Subject: {selectedRequest.subject}
              </Typography>
              <Typography variant="body1">Message:</Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="body2">
                  {selectedRequest.message}
                </Typography>
              </Paper>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(selectedRequest.createdAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContactUsRequests;
