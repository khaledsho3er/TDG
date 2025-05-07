import React, { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import axios from "axios";
import { useVendor } from "../../utils/vendorContext"; // Vendor context for brandId
import EditPromotionModal from "./EditPromotionModal"; // adjust path as needed
import CreatePromotionDialog from "./CreatePromotionDialog"; // adjust path
const PromotionsPage = () => {
  const { vendor } = useVendor(); // Access vendor context for brandId
  const [products, setProducts] = useState([]);
  const [showFalseStatus, setShowFalseStatus] = useState(false); // Show products without promotion
  const [showTrueStatus, setShowTrueStatus] = useState(true); // Show products with promotion
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPromotions, setCurrentPromotions] = useState([]); // Current promotions
  const [pastPromotions, setPastPromotions] = useState([]); // Past promotions
  const [pastPromotionMetrics, setPastPromotionMetrics] = useState([]); // Metrics for past promotions

  useEffect(() => {
    if (vendor) {
      const { brandId } = vendor; // Get the brandId from vendor context
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `https://api.thedesigngrit.com/api/products/getproducts/brand/${brandId}`
          );
          setProducts(response.data); // Set fetched products
          // Separate current and past promotions
          const now = new Date();
          const current = response.data.filter((product) => {
            return (
              product.promotionStartDate &&
              product.promotionEndDate &&
              new Date(product.promotionStartDate) <= now &&
              new Date(product.promotionEndDate) >= now
            );
          });

          const past = response.data.filter((product) => {
            return (
              product.promotionStartDate &&
              product.promotionEndDate &&
              new Date(product.promotionEndDate) < now
            );
          });

          setCurrentPromotions(current);
          setPastPromotions(past);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      // Fetch promotion metrics
      const fetchPromotionMetrics = async () => {
        try {
          const response = await axios.get(
            "https://api.thedesigngrit.com/api/products/past-promotions/metrics"
          );
          setPastPromotionMetrics(response.data);
        } catch (error) {
          console.error("Error fetching promotion metrics", error);
        }
      };

      fetchProducts();
      fetchPromotionMetrics();
    }
  }, [vendor, products]); // Re-fetch when vendor changes
  const calculatePromotionMetrics = (product) => {
    // Find the corresponding metrics for the product in past promotions
    const metrics = pastPromotionMetrics.find(
      (metric) => metric.productId === product._id
    );

    if (metrics) {
      return {
        salesDuringPromotion: metrics.salesDuringPromotion,
        viewsDuringPromotion: metrics.viewsDuringPromotion,
        turnoverIncrease: metrics.turnoverIncrease,
      };
    }

    return {
      salesDuringPromotion: 0,
      viewsDuringPromotion: 0,
      turnoverIncrease: 0,
    };
  };
  return (
    <div className="promotions-page">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Promotions</h2>
          <p> Home &gt; Promotions</p>
        </div>
        <div className="dashboard-date-vendor">
          <button
            onClick={() => setShowCreateDialog(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: "#2d2d2d",
              color: "white",
              padding: "15px 15px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <CiCirclePlus /> Create Promotion
          </button>
        </div>
      </header>

      {/* Section for current promotions */}
      <div>
        <div
          className="section-header"
          onClick={() => setShowTrueStatus((prev) => !prev)}
          style={{
            margin: "30px 0",
          }}
        >
          <span>Current Promotions</span>
          {showTrueStatus ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
        {showTrueStatus && (
          <div className="current-promotions-section">
            {currentPromotions.length === 0 ? (
              <p>No products with active promotions.</p>
            ) : (
              <div className="product-grid">
                {currentPromotions.map((product) => (
                  <div
                    className="promotion-card"
                    onClick={() => {
                      setSelectedProduct(product);
                      setEditModalOpen(true);
                    }}
                    key={product.id}
                  >
                    <div className="promotion-image-container">
                      <img
                        src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                        alt={product.name}
                        className="promotion-image"
                      />
                      <div className="discount-badge">
                        {product.discountPercentage}% OFF
                      </div>
                    </div>
                    <div className="promotion-details">
                      <h3>{product.name}</h3>
                      <div className="price-container">
                        <span className="original-price">
                          E£{product.price}
                        </span>
                        <span className="sale-price">
                          E£{product.salePrice}
                        </span>
                      </div>
                      <p className="product-summary">
                        {product.description.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="product-card-body">
                      <h5>Summary</h5>
                      <div className="metrics-container">
                        <div className="metric">
                          <span className="metric-label">Discount</span>

                          <span className="metric-value">
                            {product.discountPercentage
                              ? product.discountPercentage
                              : "No yet Discount"}{" "}
                            %
                          </span>
                        </div>
                        <hr style={{ margin: "10px 0", color: "#ddd" }} />
                        <div className="metric">
                          <span className="metric-label">Date</span>
                          <span className="metric-value">
                            {new Date(
                              product.promotionStartDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              product.promotionEndDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section for past promotions */}
      <div>
        <div
          className="section-header"
          onClick={() => setShowFalseStatus((prev) => !prev)}
          style={{
            margin: "30px 0",
          }}
        >
          <span>Past Promotions</span>
          {showFalseStatus ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
        {showFalseStatus && (
          <div className="past-promotions-section">
            {pastPromotions.length === 0 ? (
              <p>No past promotions.</p>
            ) : (
              <div className="product-grid">
                {pastPromotions.map((product) => {
                  const metrics = calculatePromotionMetrics(product);
                  return (
                    <div className="promotion-card" key={product.id}>
                      <div className="promotion-image-container">
                        <img
                          src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                          alt={product.name}
                          className="promotion-image"
                        />
                        <div className="discount-badge">
                          {product.discountPercentage}% OFF
                        </div>
                      </div>
                      <div className="promotion-details">
                        <h3>{product.name}</h3>
                        <div className="price-container">
                          <span className="original-price">
                            E£{product.price}
                          </span>
                          <span className="sale-price">
                            E£{product.salePrice}
                          </span>
                        </div>
                        <p className="product-summary">
                          {product.description.substring(0, 100)}...
                        </p>
                      </div>

                      <div className="metrics-container">
                        {/* Display metrics */}
                        <h5>Promotion Metrics</h5>
                        <div className="metric">
                          <span className="metric-label">
                            {" "}
                            Sales During Promotion:{" "}
                          </span>
                          <span className="metric-value">
                            {" "}
                            {metrics.salesDuringPromotion || 0}
                          </span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">
                            Views During Promotion:{" "}
                          </span>
                          <span className="metric-value">
                            {metrics.viewsDuringPromotion || 0}
                          </span>
                        </div>
                        <div className="metric">
                          <span className="metric-label">
                            Turnover Increase:{" "}
                          </span>
                          <span className="metric-value">
                            {metrics.turnoverIncrease || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      {selectedProduct && (
        <EditPromotionModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          product={selectedProduct}
          onSave={(updatedProduct) => {
            setCurrentPromotions((prev) =>
              prev.map((p) =>
                p._id === updatedProduct._id ? updatedProduct : p
              )
            );
            setEditModalOpen(false);
          }}
          onEnd={(productId) => {
            setCurrentPromotions((prev) =>
              prev.filter((p) => p._id !== productId)
            );
            setEditModalOpen(false);
          }}
        />
      )}
      <CreatePromotionDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        brandId={vendor?.brandId}
        onPromotionCreated={(updatedProduct) => {
          // refresh logic if needed
          setCurrentPromotions((prev) => [...prev, updatedProduct]);
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
};

export default PromotionsPage;
