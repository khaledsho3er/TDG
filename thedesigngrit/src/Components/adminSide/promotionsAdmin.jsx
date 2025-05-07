import React, { useState, useEffect } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PromotionsPageAdmin = () => {
  const [currentPromotions, setCurrentPromotions] = useState([]);
  const [pastPromotions, setPastPromotions] = useState([]);
  const [futurePromotions, setFuturePromotions] = useState([]);
  const [showCurrentSection, setShowCurrentSection] = useState(true);
  const [showPastSection, setShowPastSection] = useState(false);
  const [showFutureSection, setShowFutureSection] = useState(false);
  const [promotionMetrics, setPromotionMetrics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        // Fetch all products with promotions
        const response = await axios.get(
          "https://api.thedesigngrit.com/api/products/admin/products-promotions"
        );

        // Separate current, past, and future promotions
        const now = new Date();

        const current = response.data.filter(
          (product) =>
            product.promotionStartDate &&
            product.promotionEndDate &&
            new Date(product.promotionStartDate) <= now &&
            new Date(product.promotionEndDate) >= now
        );

        const past = response.data.filter(
          (product) =>
            product.promotionStartDate &&
            product.promotionEndDate &&
            new Date(product.promotionEndDate) < now
        );

        const future = response.data.filter(
          (product) =>
            product.promotionStartDate &&
            product.promotionEndDate &&
            new Date(product.promotionStartDate) > now
        );

        setCurrentPromotions(current);
        setPastPromotions(past);
        setFuturePromotions(future);

        // Fetch promotion metrics
        const metricsResponse = await axios.get(
          "https://api.thedesigngrit.com/api/products/admin/products-promotion-metrics"
        );
        setPromotionMetrics(metricsResponse.data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, []);

  const calculatePromotionMetrics = (product) => {
    const metrics = promotionMetrics.find(
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

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderPromotionCard = (product, showMetrics = false) => {
    const metrics = showMetrics ? calculatePromotionMetrics(product) : null;
    const discountAmount = product.price - product.salePrice;
    const discountPercent =
      product.discountPercentage ||
      Math.round((discountAmount / product.price) * 100);

    return (
      <div
        className="promotion-card"
        key={product._id}
        onClick={() => handleProductClick(product._id)}
      >
        <div className="promotion-image-container">
          <img
            src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
            alt={product.name}
            className="promotion-image"
          />
          <div className="discount-badge">{discountPercent}% OFF</div>
        </div>

        <div className="promotion-details">
          <h3>{product.name}</h3>
          <p className="brand-name">{product.brandId?.brandName}</p>
          <div className="price-container">
            <span className="original-price">${product.price}</span>
            <span className="sale-price">${product.salePrice}</span>
          </div>

          {showMetrics && metrics && (
            <div className="metrics-container">
              {metrics.map((metric, index) => (
                <div className="metric-card" key={index}>
                  <h3>{metric.name}</h3>
                  <p>
                    <strong>Brand:</strong> {metric.brandName}
                  </p>

                  <div className="metric">
                    <span className="metric-label">Units Sold (Before)</span>
                    <span className="metric-value">
                      {metric.unitsSoldBefore}
                    </span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">Units Sold (During)</span>
                    <span className="metric-value">
                      {metric.unitsSoldDuring}
                    </span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">Turnover (Before)</span>
                    <span className="metric-value">
                      ${metric.turnoverBefore}
                    </span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">Turnover (During)</span>
                    <span className="metric-value">
                      ${metric.turnoverDuring}
                    </span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">Sales Uplift</span>
                    <span className="metric-value">
                      {metric.salesUpliftPercent}%
                    </span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">Discount</span>
                    <span className="metric-value">
                      {metric.discountPercentage}%
                    </span>
                  </div>

                  <div className="metric">
                    <span className="metric-label">Promotion Period</span>
                    <span className="metric-value">
                      {new Date(metric.promotionStartDate).toLocaleDateString()}{" "}
                      - {new Date(metric.promotionEndDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showMetrics && (
            <div className="promotion-dates">
              {new Date(product.promotionStartDate).toLocaleDateString()} -
              {new Date(product.promotionEndDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="promotions-page-container">
      <div className="promotions-content">
        <div className="promotions-header">
          <h1>Special Promotions</h1>
          <p>Discover amazing deals and discounts on our products</p>
        </div>

        {/* Current Promotions Section */}
        <div className="promotion-section">
          <div
            className="section-header"
            onClick={() => setShowCurrentSection((prev) => !prev)}
          >
            <h2>Current Promotions</h2>
            <span className="toggle-icon">
              {showCurrentSection ? <AiOutlineUp /> : <AiOutlineDown />}
            </span>
          </div>

          {showCurrentSection && (
            <div className="promotion-grid">
              {currentPromotions.length === 0 ? (
                <p className="no-promotions">
                  No active promotions at the moment.
                </p>
              ) : (
                currentPromotions.map((product) => renderPromotionCard(product))
              )}
            </div>
          )}
        </div>

        {/* Future Promotions Section */}
        <div className="promotion-section">
          <div
            className="section-header"
            onClick={() => setShowFutureSection((prev) => !prev)}
          >
            <h2>Upcoming Promotions</h2>
            <span className="toggle-icon">
              {showFutureSection ? <AiOutlineUp /> : <AiOutlineDown />}
            </span>
          </div>

          {showFutureSection && (
            <div className="promotion-grid">
              {futurePromotions.length === 0 ? (
                <p className="no-promotions">
                  No upcoming promotions scheduled.
                </p>
              ) : (
                futurePromotions.map((product) => renderPromotionCard(product))
              )}
            </div>
          )}
        </div>

        {/* Past Promotions Section */}
        <div className="promotion-section">
          <div
            className="section-header"
            onClick={() => setShowPastSection((prev) => !prev)}
          >
            <h2>Past Promotions</h2>
            <span className="toggle-icon">
              {showPastSection ? <AiOutlineUp /> : <AiOutlineDown />}
            </span>
          </div>

          {showPastSection && (
            <div className="promotion-grid">
              {pastPromotions.length === 0 ? (
                <p className="no-promotions">No past promotions available.</p>
              ) : (
                pastPromotions.map((product) =>
                  renderPromotionCard(product, true)
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionsPageAdmin;
