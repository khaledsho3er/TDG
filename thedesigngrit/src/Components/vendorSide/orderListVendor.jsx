import { Box, Select, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { useVendor } from "../../utils/vendorContext";
import OrderDetails from "./orderDetails"; // Import OrderDetails component

const RecentPurchases = () => {
  const { vendor } = useVendor();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Date");
  const [sortDirection] = useState("asc");
  const [dateRange] = useState([null, null]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order

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

  // Filter Orders
  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);

  // Filter Orders by Date Range
  const dateFilteredOrders =
    dateRange[0] && dateRange[1]
      ? filteredOrders.filter(
          (order) =>
            new Date(order.orderDate) >= new Date(dateRange[0]) &&
            new Date(order.orderDate) <= new Date(dateRange[1])
        )
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

  // If an order is selected, show OrderDetails instead of the table
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
          <span>
            {dateRange[0] && dateRange[1] ? (
              <>{`${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`}</>
            ) : (
              "Select date range"
            )}
            :
            {dateRange[0] && dateRange[1]
              ? `${dateRange[0]} - ${dateRange[1]}`
              : "Select date range"}
          </span>
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
          <BsThreeDotsVertical />
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
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
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
                      textAlign: "center",
                      minWidth: "80px",
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </td>
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
