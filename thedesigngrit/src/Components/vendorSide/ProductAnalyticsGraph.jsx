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

  // Generate sales & revenue data
  const generateAnalyticsData = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const entry = { date: `Day ${i + 1}` };

      selectedProducts.forEach((productId) => {
        const product = products.find((p) => p._id === productId);
        const sales = Math.floor(Math.random() * 100); // Mock sales
        const revenue = sales * (product.salePrice || product.price);

        entry[`${productId}_sales`] = sales;
        entry[`${productId}_revenue`] = revenue;
      });

      return entry;
    });
  };

  const chartData = generateAnalyticsData();

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
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedProducts.map((productId) => {
            const product = products.find((p) => p._id === productId);
            return (
              <>
                <Line
                  key={`${productId}_sales`}
                  type="monotone"
                  dataKey={`${productId}_sales`}
                  name={`${product.name} Sales`}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`} // Random color
                />
                <Line
                  key={`${productId}_revenue`}
                  type="monotone"
                  dataKey={`${productId}_revenue`}
                  name={`${product.name} Revenue`}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`} // Another random color
                  strokeDasharray="5 5"
                />
              </>
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductAnalyticsGraph;
