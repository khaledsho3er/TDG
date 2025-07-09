import React, { useEffect, useState } from "react";
import { Box, Select, MenuItem } from "@mui/material";
import { useVendor } from "../../utils/vendorContext";
import ReturnRequestDetails from "./ReturnRequestDetails";

const ReturnRequestsList = () => {
  const { vendor } = useVendor();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const requestsPerPage = 8;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!vendor?.brandId) return;
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/returns-order/returns/brand/${vendor.brandId}`
        );
        if (!response.ok) throw new Error("Failed to fetch return requests");
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching return requests:", error);
      }
    };
    fetchRequests();
  }, [vendor]);

  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = requests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(requests.length / requestsPerPage);

  if (selectedRequest) {
    return (
      <ReturnRequestDetails
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        refreshList={() => {
          // re-fetch after update
          setSelectedRequest(null);
          // re-fetch requests
          if (!vendor?.brandId) return;
          fetch(
            `https://api.thedesigngrit.com/api/returns-order/returns/brand/${vendor.brandId}`
          )
            .then((res) => res.json())
            .then((data) => setRequests(data));
        }}
      />
    );
  }

  return (
    <div className="dashboard-vendor">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Return Requests</h2>
          <p> Home &gt; Return Requests</p>
        </div>
      </header>
      <div className="recent-purchases">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Recent Return Requests</h2>
        </Box>
        <hr />
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Brand Status</th>
              <th>Requested At</th>
              <th>Refund Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((req) => (
              <tr
                key={req._id}
                onClick={() => setSelectedRequest(req)}
                style={{ cursor: "pointer" }}
              >
                <td>{req.orderId?._id}</td>
                <td>
                  {req.customerId?.firstName} {req.customerId?.lastName}
                </td>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "5px",
                      backgroundColor:
                        req.status === "Pending"
                          ? "#f8d7da"
                          : req.status === "Returned"
                          ? "#d4edda"
                          : "#FFE5B4",
                      color:
                        req.status === "Pending"
                          ? "#721c24"
                          : req.status === "Returned"
                          ? "#155724"
                          : "#FF7518",
                      fontWeight: "500",
                      textAlign: "center",
                      minWidth: "80px",
                    }}
                  >
                    {req.status}
                  </span>
                </td>
                <td>{req.brandStatus}</td>
                <td>{new Date(req.requestedAt).toLocaleDateString()}</td>
                <td>{req.totalRefundAmount} E£</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReturnRequestsList;
