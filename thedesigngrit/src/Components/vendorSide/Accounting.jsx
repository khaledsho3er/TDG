import React, { useEffect, useState } from "react";
import axios from "axios";

const AccountingPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [commissionsData, setCommissionsData] = useState([]);
  const [netEarningsData, setNetEarningsData] = useState([]);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [refundRecords, setRefundRecords] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "https://api.thedesgingrit.com/api/orders/sales"
        );
        setSalesData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  useEffect(() => {
    // Fetch data from the backend
    // Example: fetchSalesData(), fetchCommissionsData(), etc.
  }, []);

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
          <h3>Graphs</h3>
          <div className="graph-container">
            {/* Placeholder for graphs */}
            <div className="graph">Sales Graph</div>
            <div className="graph">Commissions Graph</div>
            <div className="graph">Net Earnings Graph</div>
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
