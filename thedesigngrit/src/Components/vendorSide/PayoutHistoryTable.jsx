import React from "react";

const PayoutHistoryTable = ({ data = [] }) => (
  <div className="table-container">
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
        {data.map((item, i) => (
          <tr key={i}>
            <td>{new Date(item.date).toLocaleDateString()}</td>
            <td>${item.amount}</td>
            <td>{item.method}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PayoutHistoryTable;
