import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import DateRangePicker from "./DateRangePicker";
import PayoutHistoryTable from "./PayoutHistoryTable";
import RefundTable from "./RefundTable";
import PaymentMethod from "./PaymentMethod";
import axios from "axios";

const AccountingPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [stats, setStats] = useState({});
  const [payouts, setPayouts] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState({});

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/accounting", {
          params: {
            start: dateRange.startDate,
            end: dateRange.endDate,
          },
        });

        setStats(res.data.stats);
        setPayouts(res.data.payouts);
        setRefunds(res.data.refunds);
        setPaymentMethod(res.data.paymentMethod);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [dateRange]);

  return (
    <div className="accounting-page">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Accounting Page</h2>
          <p style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
            Home &gt; Accounting Page
          </p>
        </div>
      </header>

      <div className="date-picker-container">
        <DateRangePicker onChange={(range) => setDateRange(range)} />
      </div>

      <Chart stats={stats.graphData} />

      <div className="stats-section">
        <div className="stat-box">Total Sales: ${stats.totalSales || 0}</div>
        <div className="stat-box">Commissions: ${stats.commissions || 0}</div>
        <div className="stat-box">Net Earnings: ${stats.netEarnings || 0}</div>
        <div className="stat-box">Tax Amount: ${stats.taxAmount || 0}</div>
      </div>

      <PayoutHistoryTable data={payouts} />
      <RefundTable data={refunds} />
      <PaymentMethod data={paymentMethod} />
    </div>
  );
};

export default AccountingPage;
