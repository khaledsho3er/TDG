import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
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
  const [selectedBrand, setSelectedBrand] = useState(""); // NEW

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
      (metric) => metric.productId === (product._id || product.productId)
    );

    if (metrics) {
      return {
        unitsSoldBefore: metrics.unitsSoldBefore,
        unitsSoldDuring: metrics.unitsSoldDuring,
        turnoverBefore: metrics.turnoverBefore,
        turnoverDuring: metrics.turnoverDuring,
        salesUpliftPercent: metrics.salesUpliftPercent,
      };
    }

    return {
      unitsSoldBefore: 0,
      unitsSoldDuring: 0,
      turnoverBefore: 0,
      turnoverDuring: 0,
      salesUpliftPercent: 0,
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
            <span className="original-price">E£{product.price}</span>
            <span className="sale-price">E£{product.salePrice}</span>
          </div>

          {showMetrics && metrics && (
            <div className="metrics-container">
              <div className="metric">
                <span className="metric-label">Sales Before</span>
                <span className="metric-value">{metrics.unitsSoldBefore}</span>
                <span className="metric-label">Unit Sold During Sale</span>
                <span className="metric-value">{metrics.unitsSoldDuring}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Sales Uplift %</span>
                <span className="metric-value">
                  {metrics.salesUpliftPercent}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Turnover Before</span>
                <span className="metric-value">+{metrics.turnoverBefore}%</span>
                <span className="metric-label">During sale</span>
                <span className="metric-value">+{metrics.turnoverDuring}%</span>
              </div>
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
  const filterPromotions = (promotions) => {
    if (!selectedBrand) return promotions;
    return promotions.filter(
      (product) => product.brandId?.brandName === selectedBrand
    );
  };
  const uniqueBrands = Array.from(
    new Map(
      [...currentPromotions, ...futurePromotions, ...pastPromotions]
        .filter((product) => product.brandId) // Make sure brand exists
        .map((product) => [product.brandId._id, product.brandId])
    ).values()
  );

  return (
    <div className="promotions-page-container">
      <div className="promotions-content">
        <div className="promotions-header">
          <h1>Promotions</h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              marginBottom: "20px",
            }}
          >
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="brand-select-label">Brand</InputLabel>
              <Select
                labelId="brand-select-label"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                sx={{
                  width: "200px",
                  color: "#2d2d2d",
                  backgroundColor: "#fff",
                }}
              >
                <MenuItem value="">All Brands</MenuItem>
                {uniqueBrands.map((brand) => (
                  <MenuItem key={brand._id} value={brand.brandName}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
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
              {filterPromotions(currentPromotions).length === 0 ? (
                <p className="no-promotions">
                  {selectedBrand
                    ? "No active promotions for this brand."
                    : "No active promotions."}
                </p>
              ) : (
                filterPromotions(currentPromotions).map((product) =>
                  renderPromotionCard(product, true)
                )
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
              {filterPromotions(futurePromotions).length === 0 ? (
                <p className="no-promotions">
                  {selectedBrand
                    ? "No upcoming promotions for this brand."
                    : "No upcoming promotions."}{" "}
                </p>
              ) : (
                filterPromotions(futurePromotions).map((product) =>
                  renderPromotionCard(product)
                )
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
              {filterPromotions(pastPromotions).length === 0 ? (
                <p className="no-promotions">No past promotions available.</p>
              ) : (
                filterPromotions(pastPromotions).map((product) =>
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
