import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const ProductAnalyticsGraph = () => {
  const [products, setProducts] = useState([]); // Store products list
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [timeframe, setTimeframe] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products & Analytics Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://tdg-db.onrender.com/api/analytics/sales"
        );
        const data = await res.json();
        setProducts(data.products);
        setAnalyticsData(
          data.products.map((p) => ({
            id: p._id,
            name: p.name,
            sales: p.sales,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Process data for the chart
  const chartData = selectedProducts.map((productId) => {
    const product = analyticsData.find((p) => p.id === productId);
    return {
      product,
      data: [{ date: "Total", sales: product?.sales || 0 }],
    };
  });

  return (
    <div
      style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}
    >
      <h3>Product Analytics</h3>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
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
                  color: selectedProducts.includes(product._id)
                    ? "#fff"
                    : "#000",
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
                  key={product.id}
                  type="monotone"
                  data={data}
                  dataKey="sales"
                  name={product.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default ProductAnalyticsGraph;
