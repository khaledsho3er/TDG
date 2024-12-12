import React, { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";

const ProductsPageVendor = () => {
  const [products, setProducts] = useState([]);

  // Function to fetch JSON data
  const fetchProducts = async () => {
    try {
      const response = await fetch("/json/productData.json"); // Replace with the actual path
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); // Fetch data on component mount

  return (
    <div className="product-list-page-vendor">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Products List</h2>
          <p>Home &gt; Products List</p>
        </div>
        <div className="dashboard-date-vendor">
          <button>
            <CiCirclePlus /> Add Product
          </button>
        </div>
      </header>
      <div className="vendor-products-list-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-card-header">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
            </div>
            <div className="product-card-body">
              <h3>{product.name}</h3>
              <p>{product.type}</p>
              <p className="product-price">{product.price}</p>
              <p className="product-summary">
                {product.description.substring(0, 100)}...
              </p>
              <div className="product-stats">
                <div className="product-sales">
                  <span>Rating</span>
                  <span className="sales-value">{product.rating} / 5</span>
                </div>
                <div className="product-remaining">
                  <span>Reviews</span>
                  <span className="remaining-value">
                    {product.reviewsCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPageVendor;
