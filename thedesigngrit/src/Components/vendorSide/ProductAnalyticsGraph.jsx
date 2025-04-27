import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const ProductAnalyticsGraph = ({ products, selectedProducts, timeframe }) => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      const data = await Promise.all(
        selectedProducts.map(async (productId) => {
          const response = await axios.get(
            `https://api.thedesigngrit.com/products/sales/${productId}`,
            {
              params: {
                timeframe: timeframe,
              },
            }
          );
          return response.data;
        })
      );
      setProductData(data);
    };

    if (selectedProducts.length > 0) {
      fetchProductData();
    }
  }, [selectedProducts, timeframe]);

  const chartData = {
    labels: productData[0]?.sales.map((sale) => sale.date) || [],
    datasets: selectedProducts.map((productId, index) => {
      const product = products.find((p) => p._id === productId);
      return {
        label: product?.name || `Product ${index + 1}`,
        data: productData[index]?.sales.map((sale) => sale.quantity) || [],
        borderColor: `rgba(${75 * index}, ${192 * index}, ${192 * index}, 1)`,
        fill: false,
      };
    }),
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ProductAnalyticsGraph;
