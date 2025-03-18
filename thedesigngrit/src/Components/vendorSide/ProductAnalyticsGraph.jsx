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

  // Convert real sales data into a structured format for the graph
  const processSalesData = () => {
    const allDates = new Set();
    const salesMap = {};

    selectedProducts.forEach((productId) => {
      const product = products.find((p) => p._id === productId);
      if (!product || !product.sales) return;

      product.sales.forEach((sale) => {
        allDates.add(sale.date);
        if (!salesMap[sale.date]) {
          salesMap[sale.date] = { date: sale.date };
        }

        const revenue = sale.sales * (product.salePrice || product.price);
        salesMap[sale.date][`${productId}_sales`] = sale.sales;
        salesMap[sale.date][`${productId}_revenue`] = revenue;
      });
    });

    return Object.values(salesMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  };

  const chartData = processSalesData();

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
                  )}`}
                />
                <Line
                  key={`${productId}_revenue`}
                  type="monotone"
                  dataKey={`${productId}_revenue`}
                  name={`${product.name} Revenue`}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`}
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
