import React, { useEffect, useState } from "react";
import { SlCalender } from "react-icons/sl";
import { Box } from "@mui/material";
import { FaBox, FaTruck, FaCheckCircle, FaRedo } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useVendor } from "../../utils/vendorContext";
import OrderDetails from "./orderDetails";

const DashboardVendor = () => {
  const { vendor } = useVendor();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({
    orders: true,
    products: true,
    stats: true,
    sales: true,
  });
  const [error, setError] = useState({
    orders: null,
    products: null,
    stats: null,
    sales: null,
  });

  // Initialize all state with default values
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    returnedOrders: 0,
    totalSales: 0,
    confirmedSales: 0,
    deliveredSales: 0,
    returnedSales: 0,
    salesPercentageChange: 0,
    confirmedSalesPercentageChange: 0,
    deliveredSalesPercentageChange: 0,
    returnedSalesPercentageChange: 0,
  });

  const [activeTab, setActiveTab] = useState("weekly");
  const [salesData, setSalesData] = useState({
    weekly: [],
    monthly: [],
    yearly: [],
  });
  const [chartData, setChartData] = useState([]);

  // Safe data fetcher with error handling
  const fetchData = async (url, key) => {
    try {
      setLoading((prev) => ({ ...prev, [key]: true }));
      setError((prev) => ({ ...prev, [key]: null }));

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${key}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`Error fetching ${key}:`, err);
      setError((prev) => ({ ...prev, [key]: err.message }));
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Fetch products data
  useEffect(() => {
    if (!vendor?.brandId) return;

    const fetchProducts = async () => {
      const data = await fetchData(
        `https://tdg-db.onrender.com/api/orders/vendor/best-sellers/${vendor.brandId}`,
        "products"
      );
      if (data) setProducts(Array.isArray(data) ? data : []);
    };

    fetchProducts();
  }, [vendor]);

  // Fetch orders data
  useEffect(() => {
    if (!vendor?.brandId) return;

    const fetchOrders = async () => {
      const data = await fetchData(
        `https://tdg-db.onrender.com/api/orders/orders/brand/${vendor.brandId}`,
        "orders"
      );
      if (data) setOrders(Array.isArray(data) ? data : []);
    };

    fetchOrders();
  }, [vendor]);

  // Fetch statistics data
  useEffect(() => {
    if (!vendor?.brandId) return;

    const fetchStats = async () => {
      const data = await fetchData(
        `https://tdg-db.onrender.com/api/orders/statistics/${vendor.brandId}`,
        "stats"
      );

      if (!data || data.error) {
        console.warn("No statistics found for this brand.");
        return;
      }

      setStats({
        totalOrders: data.totalOrders || 0,
        activeOrders: data.totalConfirmed || 0,
        completedOrders: data.totalDelivered || 0,
        returnedOrders: data.totalReturned || 0,
        totalSales: data.totalSales || 0,
        confirmedSales: data.confirmedSales || 0,
        deliveredSales: data.deliveredSales || 0,
        returnedSales: data.returnedSales || 0,
        salesPercentageChange:
          data.totalSales > 0
            ? ((data.deliveredSales / data.totalSales) * 100).toFixed(2)
            : 0,
        confirmedSalesPercentageChange:
          data.confirmedSales > 0
            ? ((data.confirmedSales / data.totalSales) * 100).toFixed(2)
            : 0,
        deliveredSalesPercentageChange:
          data.deliveredSales > 0
            ? ((data.deliveredSales / data.totalSales) * 100).toFixed(2)
            : 0,
        returnedSalesPercentageChange:
          data.returnedSales > 0
            ? ((data.returnedSales / data.totalSales) * 100).toFixed(2)
            : 0,
      });
    };

    fetchStats();
  }, [vendor]);

  // Fetch sales graph data
  useEffect(() => {
    if (!vendor?.brandId) return;

    const fetchSalesData = async () => {
      const data = await fetchData(
        `https://tdg-db.onrender.com/api/orders/sales-graph/${vendor.brandId}`,
        "sales"
      );

      if (data) {
        setSalesData({
          weekly: Array.isArray(data.weeklySales) ? data.weeklySales : [],
          monthly: Array.isArray(data.monthlySales) ? data.monthlySales : [],
          yearly: Array.isArray(data.yearlySales) ? data.yearlySales : [],
        });
      }
    };

    fetchSalesData();
  }, [vendor]);

  // Update chart data based on active tab
  useEffect(() => {
    let formattedData = [];

    try {
      switch (activeTab) {
        case "weekly":
          formattedData = (salesData.weekly || []).map((item) => ({
            ...item,
            week: `Week ${item.week || 0}`,
          }));
          break;
        case "monthly":
          formattedData = (salesData.monthly || []).map((item) => ({
            ...item,
            month: `Month ${item.month || 0}`,
          }));
          break;
        case "yearly":
          formattedData = (salesData.yearly || []).map((item) => ({
            ...item,
            year: `${item.year || 0}`,
          }));
          break;
        default:
          formattedData = [];
      }
    } catch (err) {
      console.error("Error formatting chart data:", err);
      formattedData = [];
    }

    setChartData(formattedData);
  }, [activeTab, salesData]);

  // Show loading state if any critical data is still loading
  if (loading.orders || loading.stats || loading.sales) {
    return (
      <div className="dashboard-vendor loading">
        <div className="loading-spinner">Loading dashboard data...</div>
      </div>
    );
  }

  // Show error state if any critical error occurred
  if (error.orders || error.stats || error.sales) {
    return (
      <div className="dashboard-vendor error">
        <h2>Error Loading Dashboard</h2>
        <p>{error.orders || error.stats || error.sales}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  // Helper function to safely access customer name
  const getCustomerName = (order) => {
    try {
      if (!order.customerId) return "Unknown Customer";
      return (
        `${order.customerId.firstName || ""} ${
          order.customerId.lastName || ""
        }`.trim() || "Unknown Customer"
      );
    } catch {
      return "Unknown Customer";
    }
  };

  // Helper function to safely access product name
  const getProductName = (order) => {
    try {
      return order.cartItems?.[0]?.name || "N/A";
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="dashboard-vendor">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Dashboard</h2>
          <p>Home &gt; Dashboard</p>
        </div>
        <div className="dashboard-date-vendor">
          <SlCalender />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </header>

      {/* Overview Section */}
      <section className="dashboard-overview-vendor">
        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaBox />
          </div>
          <div className="card-content-vendor">
            <h3>Total Sales</h3>
            <p>LE {stats.totalSales}</p>
            <h3>Total orders</h3>
            <p>{stats.totalOrders}</p>
            <span>▲ {stats.salesPercentageChange}% Compared to Last Month</span>
          </div>
        </div>

        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaTruck />
          </div>
          <div className="card-content-vendor">
            <h3>Active Orders sales</h3>
            <p>LE {stats.confirmedSales}</p>
            <h3>Active Orders </h3>
            <p> {stats.activeOrders}</p>
            <span>
              ▲ {stats.confirmedSalesPercentageChange}% Compared to Last Month
            </span>
          </div>
        </div>

        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaCheckCircle />
          </div>
          <div className="card-content-vendor">
            <h3>Completed Orders sales</h3>
            <p>LE {stats.deliveredSales}</p>
            <h3>Completed Orders</h3>
            <p> {stats.completedOrders}</p>
            <span>
              ▲ {stats.deliveredSalesPercentageChange}% Compared to Last Month
            </span>
          </div>
        </div>

        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaRedo />
          </div>
          <div className="card-content-vendor">
            <h3>Return Orders sales</h3>
            <p>LE {stats.returnedSales}</p>
            <h3>Returned Orders</h3>
            <p>{stats.returnedOrders}</p>
            <span>
              ▲ {stats.returnedSalesPercentageChange}% Compared to Last Month
            </span>
          </div>
        </div>
      </section>

      {/* Sales Chart Section */}
      <section className="dashboard-chart-vendor">
        <div className="chart-header-vendor">
          <h3>Sales Graph</h3>
          <div className="chart-tabs-vendor">
            <button
              className={`chart-tab-vendor ${
                activeTab === "weekly" ? "active" : ""
              }`}
              onClick={() => setActiveTab("weekly")}
            >
              Weekly
            </button>
            <button
              className={`chart-tab-vendor ${
                activeTab === "monthly" ? "active" : ""
              }`}
              onClick={() => setActiveTab("monthly")}
            >
              Monthly
            </button>
            <button
              className={`chart-tab-vendor ${
                activeTab === "yearly" ? "active" : ""
              }`}
              onClick={() => setActiveTab("yearly")}
            >
              Yearly
            </button>
          </div>
          <div className="chart-content-vendor">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <XAxis
                    dataKey={
                      activeTab === "weekly"
                        ? "week"
                        : activeTab === "monthly"
                        ? "month"
                        : "year"
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data-message">No sales data available</div>
            )}
          </div>
        </div>

        <div className="best-sellers-vendor">
          <h3>Best Sellers</h3>
          <hr />
          {products.length > 0 ? (
            <ul>
              {products.map((product, index) => (
                <li key={index}>
                  <img
                    src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${
                      product.image || ""
                    }`}
                    alt={product.name || "Product"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "path/to/default-image.png";
                    }}
                  />
                  {product.name || "Unknown Product"} - LE {product.price || 0}{" "}
                  ({product.totalSold || 0} sales)
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-data-message">
              No best sellers data available
            </div>
          )}
        </div>
      </section>

      {/* Recent Orders */}
      <section className="dashboard-lists-vendor">
        <div className="recent-orders-vendor">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Recent Orders</h3>
            <BsThreeDotsVertical />
          </Box>
          {orders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id || Math.random()}
                    onClick={() => setSelectedOrder(order)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{getProductName(order)}</td>
                    <td>{order._id?.substring(0, 8) || "N/A"}</td>
                    <td>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{getCustomerName(order)}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: "4px",
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
                        {order.orderStatus || "Unknown"}
                      </span>
                    </td>
                    <td>LE {order.total || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data-message">No recent orders available</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardVendor;
