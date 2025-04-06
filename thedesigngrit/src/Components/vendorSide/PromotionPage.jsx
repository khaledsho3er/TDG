import React, { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import axios from "axios";
import { useVendor } from "../../utils/vendorContext"; // Vendor context for brandId
import EditPromotionModal from "./EditPromotionModal"; // adjust path as needed
import CreatePromotionDialog from "./CreatePromotionDialog"; // adjust path

const PromotionsPage = ({ setActivePage }) => {
  const { vendor } = useVendor(); // Access vendor context for brandId
  const [products, setProducts] = useState([]);
  const [showFalseStatus, setShowFalseStatus] = useState(false); // Show products without promotion
  const [showTrueStatus, setShowTrueStatus] = useState(true); // Show products with promotion
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPromotions, setCurrentPromotions] = useState([]); // Current promotions
  const [pastPromotions, setPastPromotions] = useState([]); // Past promotions

  useEffect(() => {
    if (vendor) {
      const { brandId } = vendor; // Get the brandId from vendor context
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `https://tdg-db.onrender.com/api/products/getproducts/brand/${brandId}`
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
      fetchProducts(); // Fetch products based on the brandId
    }
  }, [vendor]); // Re-fetch when vendor changes

  return (
    <div className="promotions-page">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Promotions</h2>
          <p>Home &gt; Promotions</p>
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
          onClick={() => setShowTrueStatus((prev) => !prev)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            padding: "10px",
            backgroundColor: "transparent",
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginBottom: "30px",
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
                    className="all-product-card"
                    onClick={() => {
                      setSelectedProduct(product);
                      setEditModalOpen(true);
                    }}
                    key={product.id}
                  >
                    <div className="product-card-header">
                      <img
                        src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                        alt={product.name}
                        className="all-product-image"
                      />
                      <div className="product-info-vendor">
                        <h3>{product.name}</h3>
                        <p>{product.typeName}</p>
                        <p
                          style={{
                            textDecoration: product.salePrice
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {product.price}
                        </p>{" "}
                        <p>{product.salePrice}</p>
                      </div>
                    </div>
                    <div className="product-card-body">
                      <h5>Summary</h5>
                      <p className="product-summary">
                        {product.description.substring(0, 100)}...
                      </p>
                      <div className="product-stats">
                        <div className="product-sales">
                          <span>Discount</span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span className="sales-value">
                              {product.discountPercentage
                                ? product.discountPercentage
                                : "No yet Discount"}
                            </span>
                          </div>
                        </div>
                        <hr style={{ margin: "10px 0", color: "#ddd" }} />
                        <div className="product-remaining">
                          <span>Date</span>
                          <span className="remaining-value">
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
          onClick={() => setShowFalseStatus((prev) => !prev)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            padding: "10px",
            backgroundColor: "transparent",
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginBottom: "30px",
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
                {pastPromotions.map((product) => (
                  <div className="all-product-card" key={product.id}>
                    <div className="product-card-header">
                      <img
                        src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                        alt={product.name}
                        className="all-product-image"
                      />
                      <div className="product-info-vendor">
                        <h3>{product.name}</h3>
                        <p>{product.typeName}</p>
                        <p
                          style={{
                            textDecoration: product.salePrice
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {product.price}
                        </p>
                        <p>{product.salePrice}</p>
                      </div>
                    </div>
                    <div className="product-card-body">
                      <h5>Summary</h5>
                      <p className="product-summary">
                        {product.description.substring(0, 100)}...
                      </p>
                      <div className="product-stats">
                        <div className="product-sales">
                          <span>Discount</span>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span className="sales-value">
                              {product.discountPercentage
                                ? product.discountPercentage
                                : "No yet Discount"}
                            </span>
                          </div>
                        </div>
                        <hr style={{ margin: "10px 0", color: "#ddd" }} />
                        <div className="product-remaining">
                          <span>Date</span>
                          <span className="remaining-value">
                            {new Date(
                              product.promotionStartDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              product.promotionEndDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div
                          className="product-metrics"
                          style={{ marginTop: "15px" }}
                        >
                          <h5 style={{ fontSize: "14px", marginBottom: "8px" }}>
                            Promotion Metrics
                          </h5>
                          <ul
                            style={{
                              fontSize: "13px",
                              paddingLeft: "15px",
                              color: "#555",
                            }}
                          >
                            <li>
                              Sales During Promotion:{" "}
                              {product.promotionSales || 0}
                            </li>
                            <li>
                              Views During Promotion:{" "}
                              {product.promotionViews || 0}
                            </li>
                            <li>
                              Turnover Increase:{" "}
                              {product.promotionTurnoverPercentage || 0}%
                            </li>
                          </ul>
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
