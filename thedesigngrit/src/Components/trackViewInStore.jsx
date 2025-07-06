import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";
import LoadingScreen from "../Pages/loadingScreen";
import { UserContext } from "../utils/userContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
          {/* Info Icon - top right, links to product page */}
          {selectedRequest.productId && (
            <a
              href={`https://thedesigngrit.com/product/${selectedRequest.productId._id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "#2d2d2d",
                textDecoration: "none",
                zIndex: 2,
              }}
              title="View Product Page"
            >
              <InfoOutlinedIcon fontSize="large" />
            </a>
          )}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Request Summary
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Product:</strong> {selectedRequest.productId?.name || "N/A"}
          </Typography>
          <Typography>
            <strong>Brand:</strong>{" "}
            {selectedRequest.brandId?.brandName || "N/A"}
          </Typography>
          {selectedRequest.productId?.mainImage && (
            <img
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedRequest.productId.mainImage}`}
              alt={selectedRequest.productId.name}
              style={{ width: "200px", borderRadius: "6px", marginTop: "10px" }}
            />
          )}
          <Typography sx={{ mt: 2 }}>
            <strong>Purchase Code:</strong> {selectedRequest.code}
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
          <Typography sx={{ color: "gray", mt: 2 }}>
            Requested On:{" "}
            {new Date(selectedRequest.createdAt).toLocaleDateString()}
          </Typography>
          {/* Status-based actions/messages */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              gap: 2,
              justifyContent: "end",
              flexDirection: "row-reverse",
              alignItems: "baseline",
            }}
          >
            {selectedRequest.status === "approved" && (
              <button
                className="submit-btn"
                style={{ marginRight: 8 }}
                onClick={() => {
                  // TODO: Implement pay now logic or navigation
                  alert("Pay Now clicked!");
                }}
              >
                Pay Now
              </button>
            )}
            {selectedRequest.status === "rejected" && (
              <Typography sx={{ color: "#2d2d2d" }}>
                Unfortunately, you have rejected the product.
              </Typography>
            )}
            {selectedRequest.status === "pending" && (
              <>
                <Typography sx={{ color: "#2d2d2d", fontWeight: 500, mr: 2 }}>
                  Waiting for your visit
                </Typography>
                {selectedRequest.brandId?.companyAddress && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedRequest.brandId.companyAddress
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="submit-btn" style={{ marginRight: 8 }}>
                      Get Directions
                    </button>
                  </a>
                )}
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default TrackViewInStore;
