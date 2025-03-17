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

const ProductAnalyticsGraph = ({ vendorSession }) => {
  const [products, setProducts] = useState([]); // Store product list
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [timeframe, setTimeframe] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch available products list (without sales data)
  useEffect(() => {
    const brandId = vendorSession.brandId;
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `https://tdg-db.onrender.com/api/products/getproducts/brand/${brandId}`
        );
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch analytics for selected products
  useEffect(() => {
    if (selectedProducts.length === 0) return;

    setLoading(true);
    const fetchAnalytics = async () => {
      try {
        const fetchedData = {};
        await Promise.all(
          selectedProducts.map(async (productId) => {
            const res = await fetch(
              `https://tdg-db.onrender.com/api/analytics/sales/${productId}`
            );
            const data = await res.json();
            fetchedData[productId] = data.product.sales; // Store sales data
          })
        );
        setAnalyticsData(fetchedData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedProducts]);

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

  // Format data for the chart
  const chartData = selectedProducts.map((productId) => ({
    product: products.find((p) => p._id === productId),
    data: [{ date: "Total", sales: analyticsData[productId] || 0 }],
  }));

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
                  key={product._id}
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
