import React, { useEffect, useState } from "react";
import { SlCalender } from "react-icons/sl";
import { Box } from "@mui/material";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaRedo,
  FaChartLine,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useVendor } from "../../utils/vendorContext";
import OrderDetails from "./orderDetails";

const DashboardVendor = () => {
  const { vendor } = useVendor();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [activePercentageChange, setActivePercentageChange] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [completedPercentageChange, setCompletedPercentageChange] = useState(0);
  const [returnedOrders, setReturnedOrders] = useState(0);
  const [returnedPercentageChange, setReturnedPercentageChange] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!vendor?.brandId) return;
      try {
        const [bestSellersRes, ordersRes, statsRes] = await Promise.all([
          fetch(
            `https://tdg-db.onrender.com/api/orders/vendor/best-sellers/${vendor.brandId}`
          ),
          fetch(
            `https://tdg-db.onrender.com/api/orders/orders/brand/${vendor.brandId}`
          ),
          fetch(
            `https://tdg-db.onrender.com/api/orders/order/statistics/${vendor.brandId}`
          ),
        ]);

        if (!bestSellersRes.ok || !ordersRes.ok || !statsRes.ok) {
          throw new Error("One or more requests failed.");
        }

        const bestSellersData = await bestSellersRes.json();
        const ordersData = await ordersRes.json();
        const statsData = await statsRes.json();

        console.log("Best Sellers Data:", bestSellersData);
        console.log("Orders Data:", ordersData);
        console.log("Statistics Data:", statsData);

        setProducts(bestSellersData);
        setOrders(ordersData);

        setTotalOrders(statsData.totalOrders || 0);
        setPercentageChange(statsData.percentageChange || 0);
        setActiveOrders(statsData.activeOrders || 0);
        setActivePercentageChange(statsData.activePercentageChange || 0);
        setCompletedOrders(statsData.completedOrders || 0);
        setCompletedPercentageChange(statsData.completedPercentageChange || 0);
        setReturnedOrders(statsData.returnedOrders || 0);
        setReturnedPercentageChange(statsData.returnedPercentageChange || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [vendor?.brandId]); // Ensure re-fetching only when vendor.brandId changes

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
            <p>LE {totalOrders}</p>
            <span>▲ {percentageChange}% Compared to Last Month</span>
          </div>
        </div>

        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaTruck />
          </div>
          <div className="card-content-vendor">
            <h3>Active Orders</h3>
            <p>LE {activeOrders}</p>
            <span>▲ {activePercentageChange}% Compared to Last Month</span>
          </div>
        </div>

        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaCheckCircle />
          </div>
          <div className="card-content-vendor">
            <h3>Completed Orders</h3>
            <p>LE {completedOrders}</p>
            <span>▲ {completedPercentageChange}% Compared to Last Month</span>
          </div>
        </div>

        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaRedo />
          </div>
          <div className="card-content-vendor">
            <h3>Return Orders</h3>
            <p>LE {returnedOrders}</p>
            <span>▲ {returnedPercentageChange}% Compared to Last Month</span>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="best-sellers-vendor">
        <h3>Best Sellers</h3>
        <hr />
        <ul>
          {products.map((product, index) => (
            <li key={index}>
              <img
                src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.image}`}
                alt={product.name}
              />
              {product.name} - LE {product.price} ({product.totalSold} sales)
            </li>
          ))}
        </ul>
      </section>

      {/* Recent Orders */}
      <section className="recent-orders-vendor">
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
                  {order.customerId?.firstName} {order.customerId?.lastName}
                </td>
                <td>{order.orderStatus}</td>
                <td>LE {order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default DashboardVendor;
