import React, { lazy, Suspense, useState, useEffect } from "react";
import { SlCalender } from "react-icons/sl";
import { Box } from "@mui/material";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaRedo,
  FaChartLine,
  FaShoppingBag,
  FaClipboardList,
} from "react-icons/fa"; // React Icons
import { BsThreeDotsVertical } from "react-icons/bs";
import { useVendor } from "../../utils/vendorContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const OrderDetails = lazy(() => import("./orderDetails"));
const LoadingScreen = lazy(() => import("../../Pages/loadingScreen"));

const DashboardVendor = () => {
  const { vendor } = useVendor();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalOrders, setTotalOrders] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [returnedOrders, setReturnedOrders] = useState(0);

  const [totalSales, setTotalSales] = useState(0);
  const [confirmedSales, setConfirmedSales] = useState(0);
  const [deliveredSales, setDeliveredSales] = useState(0);
  const [returnedSales, setReturnedSales] = useState(0);

  const [salesPercentageChange, setSalesPercentageChange] = useState(0);
  const [confirmedSalesPercentageChange, setConfirmedSalesPercentageChange] =
    useState(0);
  const [deliveredSalesPercentageChange, setDeliveredSalesPercentageChange] =
    useState(0);
  const [returnedSalesPercentageChange, setReturnedSalesPercentageChange] =
    useState(0);
  const [activeTab, setActiveTab] = useState("weekly");
  const [weeklySales, setWeeklySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [yearlySales, setYearlySales] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Add date calculation
  const getCurrentDateRange = () => {
    const today = new Date();

    const formatDate = (date) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
    };

    return formatDate(today);
  };

  // Fetch best sellers
  useEffect(() => {
    const fetchProducts = async () => {
      if (!vendor?.brandId) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/orders/vendor/best-sellers/${vendor.brandId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch best sellers");
        }
        const data = await response.json();
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [vendor]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!vendor?.brandId) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/orders/orders/brand/${vendor.brandId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        const sortedOrders = [...data].sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders || []);
        setTotalOrders(sortedOrders?.length || 0);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setTotalOrders(0);
      }
    };

    fetchOrders();
  }, [vendor]);

  // Fetch statistics
  useEffect(() => {
    const fetchData = async () => {
      if (!vendor?.brandId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/orders/statistics/${vendor.brandId}`
        );
        const data = await response.json();

        if (data.error) {
          console.warn("No orders found for this brand.");
          // Set default values when no orders exist
          setTotalOrders(0);
          setActiveOrders(0);
          setCompletedOrders(0);
          setReturnedOrders(0);
          setTotalSales(0);
          setConfirmedSales(0);
          setDeliveredSales(0);
          setReturnedSales(0);
          setSalesPercentageChange(0);
          setConfirmedSalesPercentageChange(0);
          setDeliveredSalesPercentageChange(0);
          setReturnedSalesPercentageChange(0);
        } else {
          // Set statistics from data
          setTotalOrders(data.totalOrders || 0);
          setActiveOrders(data.totalConfirmed || 0);
          setCompletedOrders(data.totalDelivered || 0);
          setReturnedOrders(data.totalReturned || 0);
          setTotalSales(data.totalSales || 0);
          setConfirmedSales(data.confirmedSales || 0);
          setDeliveredSales(data.deliveredSales || 0);
          setReturnedSales(data.returnedSales || 0);

          // Calculate percentages safely
          setSalesPercentageChange(
            data.totalSales > 0
              ? ((data.deliveredSales / data.totalSales) * 100).toFixed(2)
              : 0
          );
          setConfirmedSalesPercentageChange(
            data.totalSales > 0
              ? ((data.confirmedSales / data.totalSales) * 100).toFixed(2)
              : 0
          );
          setDeliveredSalesPercentageChange(
            data.totalSales > 0
              ? ((data.deliveredSales / data.totalSales) * 100).toFixed(2)
              : 0
          );
          setReturnedSalesPercentageChange(
            data.totalSales > 0
              ? ((data.returnedSales / data.totalSales) * 100).toFixed(2)
              : 0
          );
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setError("Failed to load statistics");
        // Set default values on error
        setTotalOrders(0);
        setActiveOrders(0);
        setCompletedOrders(0);
        setReturnedOrders(0);
        setTotalSales(0);
        setConfirmedSales(0);
        setDeliveredSales(0);
        setReturnedSales(0);
        setSalesPercentageChange(0);
        setConfirmedSalesPercentageChange(0);
        setDeliveredSalesPercentageChange(0);
        setReturnedSalesPercentageChange(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [vendor]);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!vendor?.brandId) return;

      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/orders/sales-graph/${vendor.brandId}`
        );
        const data = await response.json();

        // Set default empty arrays if no data
        setWeeklySales(data.weeklySales || []);
        setMonthlySales(data.monthlySales || []);
        setYearlySales(data.yearlySales || []);
      } catch (error) {
        console.error("Error fetching sales graph data:", error);
        setWeeklySales([]);
        setMonthlySales([]);
        setYearlySales([]);
      }
    };

    fetchSalesData();
  }, [vendor]);

  useEffect(() => {
    function aggregateAndSort(data, key) {
      // Aggregate sales for duplicate keys
      const map = {};
      data.forEach((item) => {
        if (!map[item[key]]) map[item[key]] = 0;
        map[item[key]] += Number(item.sales) || 0;
      });
      // Convert to array and sort
      return Object.entries(map)
        .map(([k, v]) => ({ [key]: Number(k), sales: v }))
        .sort((a, b) => a[key] - b[key]);
    }

    let formattedData = [];
    switch (activeTab) {
      case "weekly":
        formattedData = aggregateAndSort(weeklySales, "week").map((item) => ({
          ...item,
          week: `Week ${item.week}`,
        }));
        break;
      case "monthly":
        formattedData = aggregateAndSort(monthlySales, "month").map((item) => ({
          ...item,
          month: `Month ${item.month}`,
        }));
        break;
      case "yearly":
        formattedData = aggregateAndSort(yearlySales, "year").map((item) => ({
          ...item,
          year: `${item.year}`,
        }));
        break;
      default:
        formattedData = [];
    }
    setChartData(formattedData);
  }, [activeTab, weeklySales, monthlySales, yearlySales]);

  if (selectedOrder) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <OrderDetails
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
        />
      </Suspense>
    );
  }

  if (isLoading) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <LoadingScreen />
      </Suspense>
    );
  }

  if (error) {
    return (
      <div
        className="dashboard-vendor"
        style={{ textAlign: "center", padding: "2rem", color: "red" }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="dashboard-vendor">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Dashboard</h2>
          <p>Home &gt; Dashboard</p>
        </div>
        <div className="dashboard-date-vendor">
          <SlCalender />
          <span>{getCurrentDateRange()}</span>
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
            <p>E£ {totalSales}</p>
            <h3>Total orders</h3>
            <p>{totalOrders}</p>
            <span>▲ {salesPercentageChange}% Compared to Last Month</span>
          </div>
        </div>

        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaTruck />
          </div>
          <div className="card-content-vendor">
            <h3>Active Orders sales</h3>
            <p>E£ {confirmedSales}</p>
            <h3>Active Orders </h3>
            <p> {activeOrders}</p>
            <span>
              ▲ {confirmedSalesPercentageChange}% Compared to Last Month
            </span>
          </div>
        </div>

        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaCheckCircle />
          </div>
          <div className="card-content-vendor">
            <h3>Completed Orders sales</h3>
            <p>E£ {deliveredSales}</p>
            <h3>Completed Orders</h3>
            <p> {completedOrders}</p>
            <span>
              ▲ {deliveredSalesPercentageChange}% Compared to Last Month
            </span>
          </div>
        </div>

        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaRedo />
          </div>
          <div className="card-content-vendor">
            <h3>Return Orders sales</h3>
            <p>E£ {returnedSales}</p>
            <h3>Returned Orders</h3>
            <p>{returnedOrders}</p>
            <span>
              ▲ {returnedSalesPercentageChange}% Compared to Last Month
            </span>
          </div>
        </div>
      </section>
      {/* Sales Chart Section */}
      <section className="dashboard-chart-vendor">
        <div className="chart-header-vendor">
          <h3 style={{ margin: "10px auto" }}>Sales Graph</h3>
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
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 40 }} // Add this line
                >
                  <XAxis
                    dataKey={
                      activeTab === "weekly"
                        ? "week"
                        : activeTab === "monthly"
                        ? "month"
                        : "year"
                    }
                    angle={-30} // Optional: tilt labels for better fit
                    textAnchor="end"
                    interval={0} // Show all labels
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: "18.75rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px",
                  border: "2px dashed #dee2e6",
                  color: "#6c757d",
                  padding: "2rem",
                }}
              >
                <FaChartLine
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    color: "#adb5bd",
                  }}
                />
                <h4 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>
                  No Sales Data Available
                </h4>
                <p
                  style={{
                    margin: "0",
                    textAlign: "center",
                    maxWidth: "300px",
                  }}
                >
                  Sales data will appear here once you start receiving orders
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="best-sellers-vendor">
          <h3>Best Sellers</h3>
          <hr />
          <div
            style={{
              overflowY: "scroll",
              height: "300px",
              margin: "8px 0px",
            }}
          >
            {products.length > 0 ? (
              <ul>
                {products.map((product, index) => (
                  <li key={index}>
                    <img
                      src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.image}`}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "placeholder-image-url"; // Add a placeholder image URL
                        e.target.onerror = null;
                      }}
                    />
                    {product.name} - E£ {product.price} ({product.totalSold}{" "}
                    sales)
                  </li>
                ))}
              </ul>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#6c757d",
                }}
              >
                <FaShoppingBag
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "1rem",
                    color: "#adb5bd",
                  }}
                />
                <h4 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>
                  No Best Sellers Yet
                </h4>
                <p style={{ margin: "0", maxWidth: "250px" }}>
                  Your top-performing products will appear here once you start
                  selling
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Orders & Best Sellers */}
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
                {orders.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      {" "}
                      {order.cartItems.find((item) => {
                        const itemBrandId =
                          item.brandId && typeof item.brandId === "object"
                            ? item.brandId._id
                            : item.brandId;
                        return itemBrandId === vendor.brandId;
                      })?.name || "N/A"}
                    </td>
                    <td>{order._id}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      {order.customerId.firstName} {""}
                      {order.customerId.lastName}
                    </td>
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
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>E£ {order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 2rem",
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                margin: "1rem 0",
                border: "2px dashed #dee2e6",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
              }}
            >
              <FaClipboardList
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                  color: "#adb5bd",
                }}
              />
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#495057" }}>
                No Orders Available
              </h4>
              <p style={{ margin: "0", maxWidth: "300px", color: "#6c757d" }}>
                Orders will appear here once customers start placing orders for
                your products
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardVendor;
