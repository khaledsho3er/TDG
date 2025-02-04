import React, { useEffect, useState } from "react";
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
import { useVendor } from "../../utils/vendorContext";
import OrderDetails from "./orderDetails"; // Import OrderDetails component

const DashboardVendor = () => {
  const { vendor } = useVendor();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order

  // Fetch order data from JSON
  useEffect(() => {
    const fetchOrders = async () => {
      if (!vendor?.brandId) return;
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/orders/brand/${vendor.brandId}`
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
            <p>LE 126,500</p>
            <span>▲ 34.7% Compared to Oct 2023</span>
          </div>
        </div>
        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaTruck />
          </div>
          <div className="card-content-vendor">
            <h3>Active Orders</h3>
            <p>LE 126,500</p>
            <span>▲ 34.7% Compared to Oct 2023</span>
          </div>
        </div>
        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaCheckCircle />
          </div>
          <div className="card-content-vendor">
            <h3>Completed Orders</h3>
            <p>LE 126,500</p>
            <span>▲ 34.7% Compared to Oct 2023</span>
          </div>
        </div>
        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaRedo />
          </div>
          <div className="card-content-vendor">
            <h3>Return Orders</h3>
            <p>LE 126,500</p>
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
          <ul>
            <li>
              <img src="Assets/sofabrown.jpg" alt="sofa" />
              Lorem Ipsum - LE 126,500 (999 sales)
            </li>
            <li>
              {" "}
              <img src="Assets/sofabrown.jpg" alt="sofa" />
              Lorem Ipsum - LE 126,500 (999 sales)
            </li>
            <li>
              {" "}
              <img src="Assets/sofabrown.jpg" alt="sofa" />
              Lorem Ipsum - LE 126,500 (999 sales)
            </li>
          </ul>
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
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{order.cartItems[0]?.name || "N/A"}</td>
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
                          order.status === "Delivered" ? "#d4edda" : "#f8d7da",
                        color:
                          order.status === "Delivered" ? "#155724" : "#721c24",
                        fontWeight: "500",
                        textAlign: "center",
                        minWidth: "80px",
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>LE {order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardVendor;
