import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import { subDays, isWithinInterval, parseISO } from "date-fns";
import AdminOrderDetails from "./orderDetailsAdmin";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";

const RecentPurchasesAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Date");
  const [sortDirection] = useState("desc");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dateFilter, setDateFilter] = useState("All");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const ordersPerPage = 8;

  // Fetch order data from JSON
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://api.thedesigngrit.com/api/orders/admin-orders"
      );
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchBrands = async () => {
    try {
      const response = await fetch("https://api.thedesigngrit.com/api/brand");
      const data = await response.json();
      setBrands(data); // Assuming brands are returned as an array
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
    fetchBrands();
  }, []);

  const getFilteredByStatus = () => {
    return filterStatus === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);
  };
  const getFilteredByBrand = (filtered) => {
    return selectedBrand
      ? filtered.filter(
          (order) => order.cartItems[0]?.brandId._id === selectedBrand
        )
      : filtered;
  };

  const getFilteredByDate = (filtered) => {
    const today = new Date();
    if (dateFilter === "Today") {
      return filtered.filter((order) =>
        isWithinInterval(parseISO(order.orderDate), {
          start: new Date(today.setHours(0, 0, 0, 0)),
          end: new Date(today.setHours(23, 59, 59, 999)),
        })
      );
    }
    if (dateFilter === "Last7Days") {
      return filtered.filter((order) =>
        isWithinInterval(parseISO(order.orderDate), {
          start: subDays(today, 7),
          end: today,
        })
      );
    }
    if (dateFilter === "Last30Days") {
      return filtered.filter((order) =>
        isWithinInterval(parseISO(order.orderDate), {
          start: subDays(today, 30),
          end: today,
        })
      );
    }

    return filtered; // All
  };

  const sortedOrders = [...getFilteredByDate(getFilteredByStatus())]
    .filter((order) => getFilteredByBrand([order]).length > 0)
    .sort((a, b) => {
      switch (sortOption) {
        case "Date":
          return new Date(b.orderDate) - new Date(a.orderDate);
        case "Alphabetical":
          return sortDirection === "asc"
            ? a.cartItems[0]?.name.localeCompare(b.cartItems[0]?.name)
            : b.cartItems[0]?.name.localeCompare(a.cartItems[0]?.name);
        case "Price Ascending":
          return b.total - a.total;
        case "Price Descending":
          return a.total - b.total;
        default:
          return 0;
      }
    });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  if (selectedOrder) {
    return (
      <AdminOrderDetails
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
            {dateFilter === "All"
              ? "All Time"
              : dateFilter.replace("Last", "Last ").replace("Days", " Days")}
          </span>
        </div>
      </header>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          gap: "20px",
          marginBottom: "1rem",
        }}
      >
        <Select
          sx={{ width: 200, borderRadius: "5px", color: "#2d2d2d" }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value="All">Sort By Status</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Confirmed">Confirmed</MenuItem>
          <MenuItem value="Shipped">Shipped</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
        <Select
          sx={{ width: 200, borderRadius: "5px", color: "#2d2d2d" }}
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <MenuItem value="Date">Sort By Date</MenuItem>
          <MenuItem value="Alphabetical">Alphabetical</MenuItem>
          <MenuItem value="Price Ascending">Price: Ascending</MenuItem>
          <MenuItem value="Price Descending">Price: Descending</MenuItem>
        </Select>
        <Select
          sx={{ width: 200, borderRadius: "5px", color: "#2d2d2d" }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <MenuItem value="All">All Time</MenuItem>
          <MenuItem value="Today">Today</MenuItem>
          <MenuItem value="Last7Days">Last 7 Days</MenuItem>
          <MenuItem value="Last30Days">Last 30 Days</MenuItem>
        </Select>
        <Select
          sx={{ width: 200, borderRadius: "5px", color: "#2d2d2d" }}
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <MenuItem value="">All Brands</MenuItem>
          {brands.map((brand) => (
            <MenuItem key={brand._id} value={brand._id}>
              {brand.brandName}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            width: "100%",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#6b7b58" }} />
        </Box>
      ) : (
        <div className="recent-purchases">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <h2>Recent Purchases</h2>
            <BsThreeDotsVertical style={{ fontSize: "1rem" }} />
          </Box>
          <hr />
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Brand</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr
                  onClick={() => setSelectedOrder(order)}
                  style={{ cursor: "pointer" }}
                  key={order._id}
                >
                  <td>{order.cartItems[0]?.productId.name || "N/A"}</td>
                  <td>{order._id}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    {order.customerId.firstName}
                    {order.customerId.lastName}
                  </td>
                  <td>{order.cartItems[0]?.brandId.brandName}</td>
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
                  <td>{order.total} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
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

export default RecentPurchasesAdmin;
