import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const ProductAnalyticsGraph = ({ products }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [timeframe, setTimeframe] = useState("7d");

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else if (prev.length < 3) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  // Mock data (Replace with API data based on timeframe)
  const generateAnalyticsData = (productId) => {
    return Array.from({ length: 7 }, (_, i) => ({
      date: `Day ${i + 1}`,
      sales: Math.floor(Math.random() * 100),
    }));
  };

  const chartData = selectedProducts.map((productId) => ({
    product: products.find((p) => p._id === productId),
    data: generateAnalyticsData(productId),
  }));

  return (
    <div
      style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}
    >
      <h3>Product Analytics</h3>

      {/* Timeframe Filter */}
      <FormControl sx={{ minWidth: 120, marginBottom: "10px" }}>
        <InputLabel>Timeframe</InputLabel>
        <Select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <MenuItem value="7d">Last 7 Days</MenuItem>
          <MenuItem value="30d">Last 30 Days</MenuItem>
          <MenuItem value="6m">Last 6 Months</MenuItem>
        </Select>
      </FormControl>

      {/* Product Selection */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {products.map((product) => (
          <button
            key={product._id}
            onClick={() => handleSelectProduct(product._id)}
            style={{
              padding: "5px 10px",
              border: "1px solid #ccc",
              backgroundColor: selectedProducts.includes(product._id)
                ? "#4CAF50"
                : "#fff",
              color: selectedProducts.includes(product._id) ? "#fff" : "#000",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            {product.name}
          </button>
        ))}
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {chartData.map(({ product, data }) => (
            <Line
              key={product._id}
              type="monotone"
              data={data}
              dataKey="sales"
              name={product.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductAnalyticsGraph;
