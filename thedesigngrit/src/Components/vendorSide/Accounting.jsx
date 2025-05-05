import React, { useEffect, useState } from "react";
import axios from "axios";
import { useVendor } from "../../utils/vendorContext";

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

  // Function to fetch financial data
  const fetchFinancialData = async (brandId) => {
    try {
      const response = await axios.get(
        `https://api.thedesigngrit.com/api/brand/${brandId}/financial`
      );
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
        setSalesData([
          {
            date: new Date().toISOString(),
            amount: metrics.totalSales,
          },
        ]);

        setCommissionsData([
          {
            date: new Date().toISOString(),
            amount: metrics.commissionAmount,
          },
        ]);

        setTaxRateData([
          {
            date: new Date().toISOString(),
            amount: metrics.taxAmount,
          },
        ]);

        setNetEarningsData([
          {
            date: new Date().toISOString(),
            amount: metrics.netEarnings,
          },
        ]);
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
          <h3>{getGraphTitle()}</h3>
          <div className="graph-container">
            <div
              className="graph"
              style={{
                height: "400px",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                padding: "20px",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="graph-buttons"
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => setActiveGraph("sales")}
                  style={{
                    backgroundColor:
                      activeGraph === "sales" ? "#007bff" : "#f8f9fa",
                    color: activeGraph === "sales" ? "white" : "black",
                    border: "1px solid #dee2e6",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  Sales
                </button>
                <button
                  onClick={() => setActiveGraph("commissions")}
                  style={{
                    backgroundColor:
                      activeGraph === "commissions" ? "#007bff" : "#f8f9fa",
                    color: activeGraph === "commissions" ? "white" : "black",
                    border: "1px solid #dee2e6",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  Commissions
                </button>
                <button
                  onClick={() => setActiveGraph("taxRate")}
                  style={{
                    backgroundColor:
                      activeGraph === "taxRate" ? "#007bff" : "#f8f9fa",
                    color: activeGraph === "taxRate" ? "white" : "black",
                    border: "1px solid #dee2e6",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  Tax Rate
                </button>
                <button
                  onClick={() => setActiveGraph("netEarnings")}
                  style={{
                    backgroundColor:
                      activeGraph === "netEarnings" ? "#007bff" : "#f8f9fa",
                    color: activeGraph === "netEarnings" ? "white" : "black",
                    border: "1px solid #dee2e6",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  Net Earnings
                </button>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    Loading...
                  </div>
                ) : error ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      color: "red",
                    }}
                  >
                    {error}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      width: "100%",
                      overflowY: "auto",
                    }}
                  >
                    {formatDataForDisplay(getCurrentData())}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="downloadable-reports">
          <h3>Downloadable Reports</h3>
          <div className="report-options">
            <button>Download Sales Report</button>
            <button>Download Commissions Report</button>
            <button>Download Net Earnings Report</button>
            <button>Download Tax Amounts Report</button>
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

        <section className="payment-method-setup">
          <h3>Payment Method Setup</h3>
          <div className="payment-methods">
            {paymentMethods.map((method) => (
              <div key={method.id} className="payment-method">
                <p>{method.name}</p>
                <button>Edit</button>
              </div>
            ))}
            <button>Add New Payment Method</button>
          </div>
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
