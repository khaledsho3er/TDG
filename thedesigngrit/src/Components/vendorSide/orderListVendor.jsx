import { Box, Select, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { SlCalender } from "react-icons/sl";
import { useVendor } from "../../utils/vendorContext";
import OrderDetails from "./orderDetails";

const RecentPurchases = () => {
  const { vendor } = useVendor();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Date");
  const [sortDirection] = useState("asc");
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const ordersPerPage = 8;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!vendor?.brandId) return;
      try {
        const response = await fetch(
          `https://tdg-db.onrender.com/api/orders/orders/brand/${vendor.brandId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [vendor]);

  // Filter Orders by Status
  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);

  // Filter Orders by Date Range
  const dateFilteredOrders =
    dateRange[0] && dateRange[1]
      ? filteredOrders.filter((order) => {
          const orderDate = new Date(order.orderDate);
          return (
            orderDate >= new Date(dateRange[0]) &&
            orderDate <= new Date(dateRange[1])
          );
        })
      : filteredOrders;

  // Sort Orders
  const sortedOrders = [...dateFilteredOrders].sort((a, b) => {
    switch (sortOption) {
      case "Date":
        return sortDirection === "asc"
          ? new Date(a.orderDate) - new Date(b.orderDate)
          : new Date(b.orderDate) - new Date(a.orderDate);
      case "Alphabetical":
        return sortDirection === "asc"
          ? a.cartItems[0]?.name.localeCompare(b.cartItems[0]?.name)
          : b.cartItems[0]?.name.localeCompare(a.cartItems[0]?.name);
      case "Price Ascending":
        return sortDirection === "asc" ? a.total - b.total : b.total - a.total;
      case "Price Descending":
        return sortDirection === "asc" ? b.total - a.total : a.total - b.total;
      default:
        return 0;
    }
  });

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  if (selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="dashboard-vendor">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Order List</h2>
          <p>Home &gt; Order List</p>
        </div>
        <div className="dashboard-date-vendor">
          <SlCalender />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dateRange}
              onChange={(newValue) => setDateRange(newValue)}
              renderInput={(startProps, endProps) => (
                <>
                  <input {...startProps.inputProps} />
                  <input {...endProps.inputProps} />
                </>
              )}
            />
          </LocalizationProvider>
        </div>
      </header>

      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <Select
          sx={{ width: "200px", borderRadius: "5px", color: "#2d2d2d" }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value="All">Sort By Status</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Shipped">Shipped</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
        <Select
          sx={{
            width: "200px",
            borderRadius: "5px",
            color: "#2d2d2d",
            marginLeft: "20px",
          }}
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <MenuItem value="Date">Sort By Date</MenuItem>
          <MenuItem value="Alphabetical">Alphabetical</MenuItem>
          <MenuItem value="Price Ascending">Price: Ascending</MenuItem>
          <MenuItem value="Price Descending">Price: Descending</MenuItem>
        </Select>
      </Box>

      <div className="recent-purchases">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Recent Purchases</h2>
        </Box>
        <hr />
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                style={{ cursor: "pointer" }}
              >
                <td>{order.cartItems[0]?.name || "N/A"}</td>
                <td>{order._id}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>{order.orderStatus}</td>
                <td>{order.total.toFixed(2)}LE</td>
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

export default RecentPurchases;
