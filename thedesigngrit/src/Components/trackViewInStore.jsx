import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";
import LoadingScreen from "../Pages/loadingScreen";
import { UserContext } from "../utils/userContext";

function TrackViewInStore() {
  const { userSession } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userSession?.id) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/view-in-store/user/${userSession.id}`
        );
        const data = await response.json();
        setRequests(Array.isArray(data) ? data : []);
        setSelectedRequest(
          Array.isArray(data) && data.length > 0 ? data[0] : null
        );
      } catch (err) {
        setRequests([]);
        setSelectedRequest(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [userSession]);

  if (loading) return <LoadingScreen />;

  if (!requests.length) {
    return (
      <Box sx={{ fontFamily: "Montserrat", paddingBottom: "10rem" }}>
        <Typography variant="h6" gutterBottom>
          Track Your View In Store Request
        </Typography>
        <Typography>No requests found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: "Montserrat", paddingBottom: "10rem" }}>
      <Typography variant="h6" gutterBottom>
        Track Your View In Store Request
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 4 }}>
        <Select
          value={selectedRequest?._id || ""}
          onChange={(e) => {
            const req = requests.find((r) => r._id === e.target.value);
            setSelectedRequest(req);
          }}
        >
          {requests.map((req) => (
            <MenuItem key={req._id} value={req._id}>
              Request {req.code} – {req.productId?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedRequest && (
        <Box
          sx={{
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#fff",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 6px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Request Summary
          </Typography>
          <Typography>
            <strong>Product:</strong> {selectedRequest.productId?.name || "N/A"}
          </Typography>
          {selectedRequest.productId?.mainImage && (
            <img
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedRequest.productId.mainImage}`}
              alt={selectedRequest.productId.name}
              style={{ width: "200px", borderRadius: "6px", marginTop: "10px" }}
            />
          )}
          <Typography sx={{ mt: 2 }}>
            <strong>Brand:</strong>{" "}
            {selectedRequest.brandId?.brandName || "N/A"}
          </Typography>
          <Typography>
            <strong>User:</strong> {selectedRequest.userName || "N/A"}
          </Typography>
          <Typography>
            <strong>Email:</strong> {selectedRequest.userId?.email || "N/A"}
          </Typography>
          <Typography>
            <strong>Phone:</strong>{" "}
            {selectedRequest.userId?.phoneNumber || "N/A"}
          </Typography>
          <Typography>
            <strong>Status:</strong> {selectedRequest.status}
          </Typography>
          <Typography sx={{ color: "gray", mt: 2 }}>
            Requested On:{" "}
            {new Date(selectedRequest.createdAt).toLocaleDateString()}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Product Description:</strong>{" "}
            {selectedRequest.productId?.description || "N/A"}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Technical Dimensions:</strong>{" "}
            {selectedRequest.productId?.technicalDimensions
              ? `${selectedRequest.productId.technicalDimensions.length} x ${selectedRequest.productId.technicalDimensions.width} x ${selectedRequest.productId.technicalDimensions.height} cm, ${selectedRequest.productId.technicalDimensions.weight} kg`
              : "N/A"}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Warranty:</strong>{" "}
            {selectedRequest.productId?.warrantyInfo
              ? `${
                  selectedRequest.productId.warrantyInfo.warrantyYears
                } years - ${selectedRequest.productId.warrantyInfo.warrantyCoverage.join(
                  ", "
                )}`
              : "N/A"}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default TrackViewInStore;
