import React, { useState, useEffect } from "react";
import Chart from "@/components/Chart"; // replace with your chart component
import DateRangePicker from "@/components/DateRangePicker"; // or use a date picker library

const AccountingPage = () => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [data, setData] = useState({
    sales: 0,
    commissions: 0,
    netEarnings: 0,
    tax: 0,
    payouts: [],
    refunds: [],
    paymentMethods: [],
  });

  useEffect(() => {
    // Fetch accounting data from backend using dateRange
  }, [dateRange]);

  return (
    <div className="accounting-page-container">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Accounting Page</h2>
          <p className="breadcrumb">Home &gt; Accounting Page</p>
        </div>
      </header>

      {/* Date Filter & Download */}
      <div className="top-bar">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <button className="download-btn">Download Report</button>
      </div>

      {/* Chart */}
      <div className="chart-section">
        <h3>Sales Overview</h3>
        <Chart data={data.chartData} />
      </div>

      {/* Summary Boxes */}
      <div className="summary-boxes">
        <div className="summary-box">
          <p>Sales</p>
          <h4>${data.sales.toFixed(2)}</h4>
        </div>
        <div className="summary-box">
          <p>Commissions</p>
          <h4>${data.commissions.toFixed(2)}</h4>
        </div>
        <div className="summary-box">
          <p>Net Earnings</p>
          <h4>${data.netEarnings.toFixed(2)}</h4>
        </div>
        <div className="summary-box">
          <p>Tax Amount</p>
          <h4>${data.tax.toFixed(2)}</h4>
        </div>
      </div>

      {/* Payout History */}
      <div className="table-section">
        <h3>Payout History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {data.payouts.map((payout, idx) => (
              <tr key={idx}>
                <td>{payout.date}</td>
                <td>${payout.amount}</td>
                <td>{payout.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Method Setup */}
      <div className="payment-methods">
        <div className="title-bar">
          <h3>Payment Methods</h3>
          <button className="add-btn">Add Method</button>
        </div>
        {data.paymentMethods.map((method, idx) => (
          <div key={idx} className="method-item">
            <div>
              <strong>{method.type}</strong>
              <p>{method.details}</p>
            </div>
            <button className="edit-btn">Edit</button>
          </div>
        ))}
      </div>

      {/* Refund Records */}
      <div className="table-section">
        <h3>Refund Records</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {data.refunds.map((refund, idx) => (
              <tr key={idx}>
                <td>{refund.date}</td>
                <td>${refund.amount}</td>
                <td>{refund.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountingPage;
