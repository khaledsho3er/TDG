import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import ReturnRequestAdminDetails from "./ReturnRequestAdminDetails";

const ReturnRequestsAdminList = () => {
  const [requests, setRequests] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [brandFilter, setBrandFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOption, setSortOption] = useState("Newest");
  const requestsPerPage = 8;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/returns-order/returns`
        );
        if (!response.ok) throw new Error("Failed to fetch return requests");
        const data = await response.json();
        setRequests(data);
        // Extract unique brands for filter
        const uniqueBrands = Array.from(
          new Map(data.map((req) => [req.brandId?._id, req.brandId])).values()
        );
        setBrands(uniqueBrands);
      } catch (error) {
        console.error("Error fetching return requests:", error);
      }
    };
    fetchRequests();
  }, []);

  // Filtering
  let filteredRequests = requests;
  if (brandFilter) {
    filteredRequests = filteredRequests.filter(
      (req) => req.brandId?._id === brandFilter
    );
  }
  if (dateFilter) {
    filteredRequests = filteredRequests.filter((req) => {
      const reqDate = new Date(req.requestedAt).toLocaleDateString();
      return reqDate === dateFilter;
    });
  }

  // Sorting
  if (sortOption === "Newest") {
    filteredRequests = filteredRequests.sort(
      (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
    );
  } else if (sortOption === "LowToHigh") {
    filteredRequests = filteredRequests.sort(
      (a, b) => a.totalRefundAmount - b.totalRefundAmount
    );
  } else if (sortOption === "HighToLow") {
    filteredRequests = filteredRequests.sort(
      (a, b) => b.totalRefundAmount - a.totalRefundAmount
    );
  }

  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  if (selectedRequest) {
    return (
      <ReturnRequestAdminDetails
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        refreshList={() => {
          setSelectedRequest(null);
          fetch(`https://api.thedesigngrit.com/api/returns-order/returns`)
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
          <h2>Return Requests (Admin)</h2>
          <p> Home &gt; Return Requests</p>
        </div>
      </header>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={brandFilter}
            label="Brand"
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <MenuItem value="">All Brands</MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand?._id} value={brand?._id}>
                {brand?.brandName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Requested Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            label="Sort By"
            onChange={(e) => setSortOption(e.target.value)}
          >
            <MenuItem value="Newest">Newest</MenuItem>
            <MenuItem value="LowToHigh">Refund: Low to High</MenuItem>
            <MenuItem value="HighToLow">Refund: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div className="recent-purchases">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Return Requests</h2>
        </Box>
        <hr />
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Brand</th>
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
                <td>{req.brandId?.brandName}</td>
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
                <td>{req.totalRefundAmount?.toLocaleString()} E£</td>
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

export default ReturnRequestsAdminList;
