import React, { useEffect, useState, Suspense } from "react";
import { SlCalender } from "react-icons/sl";
import { Box } from "@mui/material";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaRedo,
  FaChartLine,
} from "react-icons/fa"; // React Icons
import { BsThreeDotsVertical } from "react-icons/bs";
import AdminOrderDetails from "./orderDetailsAdmin";

const DashboardAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order

  // Fetch order data from JSON
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://api.thedesigngrit.com/api/orders/admin-orders"
      );
      const data = await response.json();
      // Sort orders by date (latest to earliest)
      data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const fetchBestSellers = async () => {
    try {
      const response = await fetch(
        "https://api.thedesigngrit.com/api/orders/bestsellers"
      );
      const data = await response.json();
      setBestSellers(data);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchBestSellers();
  }, []);

  if (selectedOrder) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminOrderDetails
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
        />
      </Suspense>
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
          <span>June 12, 2024 - Oct 19, 2024</span>
        </div>
      </header>

      {/* Overview Section */}
      <section className="dashboard-overview-vendor">
        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaBox />
          </div>
          <div className="card-content-vendor">
            <h3>Total Orders</h3>
            <p>E£ 126,500</p>
            <span>▲ 34.7% Compared to Oct 2023</span>
          </div>
        </div>
        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaTruck />
          </div>
          <div className="card-content-vendor">
            <h3>Active Orders</h3>
            <p>E£ 126,500</p>
            <span>▲ 34.7% Compared to Oct 2023</span>
          </div>
        </div>
        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaCheckCircle />
          </div>
          <div className="card-content-vendor">
            <h3>Completed Orders</h3>
            <p>E£ 126,500</p>
            <span>▲ 34.7% Compared to Oct 2023</span>
          </div>
        </div>
        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaRedo />
          </div>
          <div className="card-content-vendor">
            <h3>Return Orders</h3>
            <p>E£ 126,500</p>
            <span>▲ 34.7% Compared to Oct 2023</span>
          </div>
        </div>
      </section>

      {/* Sales Chart Section */}
      <section className="dashboard-chart-vendor">
        <div className="chart-header-vendor">
          <div className="chart-header-title-vendor">
            <h3>Sale Graph</h3>
            <div className="chart-tabs-vendor">
              <button className="chart-tab-vendor active">Weekly</button>
              <button className="chart-tab-vendor">Monthly</button>
              <button className="chart-tab-vendor">Yearly</button>
            </div>
          </div>
          <div className="chart-content-vendor">
            {/* Placeholder for Sale Graph */}
            <FaChartLine className="chart-placeholder-icon-vendor" />
          </div>
        </div>

        <div className="best-sellers-vendor">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Best Sellers</h3>
          </Box>
          <hr></hr>
          <div
            style={{
              overflowY: "scroll",
              height: "300px",
              margin: "8px 0px",
            }}
          >
            <ul>
              {bestSellers.length > 0 ? (
                bestSellers.map((product, index) => (
                  <li key={index}>
                    <div className="best-seller-item-vendor">
                      <img
                        src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                        alt={product.name}
                        className="best-seller-img-vendor"
                      />
                      <div className="best-seller-info-vendor">
                        <h4>{product.name}</h4>
                        <p>
                          {product.brandName} - E£ {product.price} (
                          {product.totalSold} sales )
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li>No best sellers available.</li>
              )}
            </ul>
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
                    <td> {order.cartItems[0]?.name || "N/A"}</td>
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
                padding: "2rem",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                margin: "1rem 0",
              }}
            >
              No orders available
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardAdmin;
