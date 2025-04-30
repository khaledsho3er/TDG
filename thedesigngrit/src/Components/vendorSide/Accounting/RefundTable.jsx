import React from "react";

const RefundTable = ({ data = [] }) => (
  <div className="table-container">
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
        {data.map((item, i) => (
          <tr key={i}>
            <td>{new Date(item.date).toLocaleDateString()}</td>
            <td>${item.amount}</td>
            <td>{item.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RefundTable;
