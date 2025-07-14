import React, { useEffect, useState } from "react";
import axios from "axios";
import { useVendor } from "../../utils/vendorContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart, Bar } from "recharts";
import { Box, Typography, Button } from "@mui/material";

const AccountingPage = () => {
  const { vendor } = useVendor();
  const [salesData, setSalesData] = useState([]);
  const [commissionsData, setCommissionsData] = useState([]);
  const [taxRateData, setTaxRateData] = useState([]);
  const [netEarningsData, setNetEarningsData] = useState([]);
  const [financialData, setFinancialData] = useState({
    commissionRate: 0,
    taxRate: 0,
    fees: 0,
  });
  const [calculatedData, setCalculatedData] = useState({
    totalSales: 0,
    commissionAmount: 0,
    taxAmount: 0,
    netEarnings: 0,
  });
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [refundRecords, setRefundRecords] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGraph, setActiveGraph] = useState("sales");
  const [chartType, setChartType] = useState("line");
  const [summary, setSummary] = useState({});
  // Function to fetch financial data
  const fetchFinancialData = async (brandId) => {
    try {
      const response = await axios.get(
        `https://api.thedesigngrit.com/api/brand/${brandId}/financial`
      );
      setSalesData(response.data.salesByDate); // Time-based array
      setSummary({
        commissionRate: response.data.commissionRate,
        taxRate: response.data.taxRate,
        fees: response.data.fees,
      });
      setFinancialData(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching financial data:", err);
      throw err;
    }
  };

  // Function to calculate financial metrics
  const calculateFinancialMetrics = (financialData) => {
    const totalSales = financialData.totalSales || 0;
    const commissionAmount = totalSales * financialData.commissionRate;
    const taxAmount = totalSales * financialData.taxRate;
    const netEarnings =
      totalSales - commissionAmount - taxAmount - financialData.fees;

    return {
      totalSales,
      commissionAmount,
      taxAmount,
      netEarnings,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch financial data (assuming brand ID is 1 for now)
        const financialResponse = await fetchFinancialData(vendor.brandId);

        // Calculate metrics
        const metrics = calculateFinancialMetrics(financialResponse);
        setCalculatedData(metrics);

        // Set the calculated data for each category
        // Prepare dynamic time-based data for all charts
        const timeSeriesSales = financialResponse.salesByDate.map((entry) => ({
          date: entry.date,
          amount: entry.amount,
        }));

        const timeSeriesCommissions = financialResponse.salesByDate.map(
          (entry) => ({
            date: entry.date,
            amount: entry.amount * financialResponse.commissionRate,
          })
        );

        const timeSeriesTax = financialResponse.salesByDate.map((entry) => ({
          date: entry.date,
          amount: entry.amount * financialResponse.taxRate,
        }));

        const timeSeriesNetEarnings = financialResponse.salesByDate.map(
          (entry) => {
            const gross = entry.amount;
            const commission = gross * financialResponse.commissionRate;
            const tax = gross * financialResponse.taxRate;
            const net = gross - commission - tax;
            return {
              date: entry.date,
              amount: net,
            };
          }
        );

        setSalesData(timeSeriesSales);
        setCommissionsData(timeSeriesCommissions);
        setTaxRateData(timeSeriesTax);
        setNetEarningsData(timeSeriesNetEarnings);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGraphTitle = () => {
    switch (activeGraph) {
      case "sales":
        return `Sales Overview (Total: ${calculatedData.totalSales.toFixed(
          2
        )} E£)`;
      case "commissions":
        return `Commissions Overview (Total: ${calculatedData.commissionAmount.toFixed(
          2
        )} E£)`;
      case "taxRate":
        return `Tax Rate Overview (Total: ${calculatedData.taxAmount.toFixed(
          2
        )} E£)`;
      case "netEarnings":
        return `Net Earnings Overview (Total: ${calculatedData.netEarnings.toFixed(
          2
        )} E£)`;
      default:
        return "Sales Overview";
    }
  };

  const getCurrentData = () => {
    switch (activeGraph) {
      case "sales":
        return salesData;
      case "commissions":
        return commissionsData;
      case "taxRate":
        return taxRateData;
      case "netEarnings":
        return netEarningsData;
      default:
        return salesData;
    }
  };

  const formatDataForDisplay = (data) => {
    if (!data || data.length === 0) return "No data available";

    return data.map((item) => (
      <div key={item.date} style={{ marginBottom: "10px" }}>
        <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
        <br />
        <strong>Amount:</strong> {item.amount.toFixed(2)} E£
      </div>
    ));
  };

  const downloadCSV = (filename, headers, rows) => {
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => row[h]).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSales = () => {
    const headers = ["date", "gross_amount"];
    const rows = salesData.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      gross_amount: entry.amount.toFixed(2),
    }));
    downloadCSV("sales_report.csv", headers, rows);
  };

  const handleDownloadCommissions = () => {
    const headers = ["date", "commission_rate", "commission_amount"];
    const rows = commissionsData.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      commission_rate: financialData.commissionRate.toFixed(2),
      commission_amount: entry.amount.toFixed(2),
    }));
    downloadCSV("commissions_report.csv", headers, rows);
  };

  const handleDownloadNetEarnings = () => {
    const headers = [
      "date",
      "gross_amount",
      "commission_amount",
      "tax_amount",
      "net_earnings",
    ];
    const rows = salesData.map((entry) => {
      const gross = entry.amount;
      const commission = gross * financialData.commissionRate;
      const tax = gross * financialData.taxRate;
      const net = gross - commission - tax;
      return {
        date: new Date(entry.date).toLocaleDateString(),
        gross_amount: gross.toFixed(2),
        commission_amount: commission.toFixed(2),
        tax_amount: tax.toFixed(2),
        net_earnings: net.toFixed(2),
      };
    });
    downloadCSV("net_earnings_report.csv", headers, rows);
  };

  const handleDownloadTaxAmounts = () => {
    const headers = ["date", "tax_rate", "tax_amount"];
    const rows = taxRateData.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      tax_rate: financialData.taxRate.toFixed(2),
      tax_amount: entry.amount.toFixed(2),
    }));
    downloadCSV("tax_amounts_report.csv", headers, rows);
  };

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

      <div className="accounting-content">
        <section className="graphs">
          {/* Redesigned Chart Section */}
          <Box mb={4} p={2} sx={{ background: "#fff", borderRadius: 3 }}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              mb={2}
              flexWrap="wrap"
            >
              <Typography
                variant="h6"
                fontWeight={700}
                fontFamily="Montserrat"
                sx={{ flex: 1 }}
              >
                {getGraphTitle()}
              </Typography>
              <Button
                variant={activeGraph === "sales" ? "outlined" : "text"}
                size="small"
                sx={{
                  borderColor: "#2d2d2d",
                  color: activeGraph === "sales" ? "#2d2d2d" : "#888",
                  fontWeight: 600,
                  borderRadius: 2,
                  minWidth: 70,
                  px: 1.5,
                  background:
                    activeGraph === "sales" ? "#f5f5f5" : "transparent",
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": {
                    background: "none",
                    color: activeGraph === "sales" ? "#2d2d2d" : "#888",
                  },
                }}
                onClick={() => setActiveGraph("sales")}
              >
                Sales
              </Button>
              <Button
                variant={activeGraph === "commissions" ? "outlined" : "text"}
                size="small"
                sx={{
                  borderColor: "#2d2d2d",
                  color: activeGraph === "commissions" ? "#2d2d2d" : "#888",
                  fontWeight: 600,
                  borderRadius: 2,
                  minWidth: 70,
                  px: 1.5,
                  background:
                    activeGraph === "commissions" ? "#f5f5f5" : "transparent",
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": {
                    background: "none",
                    color: activeGraph === "commissions" ? "#2d2d2d" : "#888",
                  },
                }}
                onClick={() => setActiveGraph("commissions")}
              >
                Commissions
              </Button>
              <Button
                variant={activeGraph === "taxRate" ? "outlined" : "text"}
                size="small"
                sx={{
                  borderColor: "#2d2d2d",
                  color: activeGraph === "taxRate" ? "#2d2d2d" : "#888",
                  fontWeight: 600,
                  borderRadius: 2,
                  minWidth: 70,
                  px: 1.5,
                  background:
                    activeGraph === "taxRate" ? "#f5f5f5" : "transparent",
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": {
                    background: "none",
                    color: activeGraph === "taxRate" ? "#2d2d2d" : "#888",
                  },
                }}
                onClick={() => setActiveGraph("taxRate")}
              >
                Tax Rate
              </Button>
              <Button
                variant={activeGraph === "netEarnings" ? "outlined" : "text"}
                size="small"
                sx={{
                  borderColor: "#2d2d2d",
                  color: activeGraph === "netEarnings" ? "#2d2d2d" : "#888",
                  fontWeight: 600,
                  borderRadius: 2,
                  minWidth: 70,
                  px: 1.5,
                  background:
                    activeGraph === "netEarnings" ? "#f5f5f5" : "transparent",
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": {
                    background: "none",
                    color: activeGraph === "netEarnings" ? "#2d2d2d" : "#888",
                  },
                }}
                onClick={() => setActiveGraph("netEarnings")}
              >
                Net Earnings
              </Button>
              <Button
                variant={chartType === "line" ? "outlined" : "text"}
                size="small"
                sx={{
                  borderColor: "#2d2d2d",
                  color: chartType === "line" ? "#2d2d2d" : "#888",
                  fontWeight: 600,
                  borderRadius: 2,
                  minWidth: 70,
                  px: 1.5,
                  background: chartType === "line" ? "#f5f5f5" : "transparent",
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": {
                    background: "none",
                    color: chartType === "line" ? "#2d2d2d" : "#888",
                  },
                }}
                onClick={() => setChartType("line")}
              >
                Line Chart
              </Button>
              <Button
                variant={chartType === "bar" ? "outlined" : "text"}
                size="small"
                sx={{
                  borderColor: "#2d2d2d",
                  color: chartType === "bar" ? "#2d2d2d" : "#888",
                  fontWeight: 600,
                  borderRadius: 2,
                  minWidth: 70,
                  px: 1.5,
                  background: chartType === "bar" ? "#f5f5f5" : "transparent",
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": {
                    background: "none",
                    color: chartType === "bar" ? "#2d2d2d" : "#888",
                  },
                }}
                onClick={() => setChartType("bar")}
              >
                Bar Chart
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "line" ? (
                <LineChart
                  data={getCurrentData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    style={{ fontFamily: "Montserrat" }}
                    tickFormatter={(tick) =>
                      new Date(tick).toLocaleDateString()
                    }
                  />
                  <YAxis
                    style={{ fontFamily: "Montserrat" }}
                    tickFormatter={(value) => value.toLocaleString("en-US")}
                  />
                  <Tooltip
                    formatter={(value) => `${Number(value).toFixed(2)} E£`}
                  />
                  {/* Optionally add <Legend /> if you want a legend */}
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name={getGraphTitle()}
                    stroke="#2d2d2d"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={getCurrentData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    style={{ fontFamily: "Montserrat" }}
                    tickFormatter={(tick) =>
                      new Date(tick).toLocaleDateString()
                    }
                  />
                  <YAxis
                    style={{ fontFamily: "Montserrat" }}
                    tickFormatter={(value) => value.toLocaleString("en-US")}
                  />
                  <Tooltip
                    formatter={(value) => `${Number(value).toFixed(2)} E£`}
                  />
                  {/* Optionally add <Legend /> if you want a legend */}
                  <Bar dataKey="amount" fill="#2d2d2d" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </Box>
          {/* End Redesigned Chart Section */}
        </section>

        <section className="downloadable-reports">
          <h3>Downloadable Reports</h3>
          <div className="report-options">
            <button
              onClick={handleDownloadSales}
              style={{
                backgroundColor: "#6a8452",
                color: "white",
                marginLeft: "20px",
              }}
            >
              Download Sales Report
            </button>
            <button
              onClick={handleDownloadCommissions}
              style={{
                backgroundColor: "#6a8452",
                color: "white",
                marginLeft: "20px",
              }}
            >
              Download Commissions Report
            </button>
            <button
              onClick={handleDownloadTaxAmounts}
              style={{
                backgroundColor: "#6a8452",
                color: "white",
                marginLeft: "20px",
              }}
            >
              Download Tax Amounts Report
            </button>
            <button
              onClick={handleDownloadNetEarnings}
              style={{
                backgroundColor: "#6a8452",
                color: "white",
                marginLeft: "20px",
              }}
            >
              Download Net Earnings Report
            </button>
          </div>
        </section>

        <section className="payout-history">
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
              {payoutHistory.map((payout) => (
                <tr key={payout.id}>
                  <td>{payout.date}</td>
                  <td>{payout.amount}</td>
                  <td>{payout.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="refund-records">
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
              {refundRecords.map((refund) => (
                <tr key={refund.id}>
                  <td>{refund.date}</td>
                  <td>{refund.amount}</td>
                  <td>{refund.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AccountingPage;
