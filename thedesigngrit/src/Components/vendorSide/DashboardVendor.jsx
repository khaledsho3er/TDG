import React from "react";
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

const DashboardVendor = () => {
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
            <p>₹126,500</p>
            <span>▲ 34.7% Compared to Oct 2023</span>
          </div>
        </div>
        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaTruck />
          </div>
          <div className="card-content-vendor">
            <h3>Active Orders</h3>
            <p>₹126,500</p>
            <span>▲ 34.7% Compared to Oct 2023</span>
          </div>
        </div>
        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaCheckCircle />
          </div>
          <div className="card-content-vendor">
            <h3>Completed Orders</h3>
            <p>₹126,500</p>
            <span>▲ 34.7% Compared to Oct 2023</span>
          </div>
        </div>
        <div className="overview-card-vendor">
          <div className="card-icon-vendor">
            <FaRedo />
          </div>
          <div className="card-content-vendor">
            <h3>Return Orders</h3>
            <p>₹126,500</p>
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
            <BsThreeDotsVertical />
          </Box>
          <hr></hr>
          <ul>
            <li>
              <img src="Assets/sofabrown.jpg" />
              Lorem Ipsum - ₹126,500 (999 sales)
            </li>
            <li>
              {" "}
              <img src="Assets/sofabrown.jpg" />
              Lorem Ipsum - ₹126,500 (999 sales)
            </li>
            <li>
              {" "}
              <img src="Assets/sofabrown.jpg" />
              Lorem Ipsum - ₹126,500 (999 sales)
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
              <tr>
                <td>Lorem Ipsum</td>
                <td>#25426</td>
                <td>Nov 8th, 2023</td>
                <td>Kevin</td>
                <td className="status-delivered">Delivered</td>
                <td>₹200.00</td>
              </tr>
              <tr>
                <td>Lorem Ipsum</td>
                <td>#25425</td>
                <td>Nov 7th, 2023</td>
                <td>Komael</td>
                <td className="status-cancelled">Cancelled</td>
                <td>₹200.00</td>
              </tr>
              <tr>
                <td>Lorem Ipsum</td>
                <td>#25424</td>
                <td>Nov 6th, 2023</td>
                <td>Nikhil</td>
                <td className="status-shipping">Shipping</td>
                <td>₹200.00</td>
              </tr>
              <tr>
                <td>Lorem Ipsum</td>
                <td>#25423</td>
                <td>Nov 5th, 2023</td>
                <td>Shivam</td>
                <td className="status-cancelled">Cancelled</td>
                <td>₹200.00</td>
              </tr>
              <tr>
                <td>Lorem Ipsum</td>
                <td>#25422</td>
                <td>Nov 4th, 2023</td>
                <td>Shadab</td>
                <td className="status-delivered">Delivered</td>
                <td>₹200.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardVendor;
