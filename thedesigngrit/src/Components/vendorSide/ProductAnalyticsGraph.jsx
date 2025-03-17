import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProductAnalyticsGraph = ({ analyticsData }) => {
  return (
    <div className="analytics-graph">
      <h3>Sales Analytics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={analyticsData}>
          <XAxis dataKey="productName" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductAnalyticsGraph;
