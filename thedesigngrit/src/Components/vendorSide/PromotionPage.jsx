import React, { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import axios from "axios";
import DiscountModal from "./discountModal"; // Modal component for creating promotions
import UpdatePromotionModal from "./updatePromotion"; // Modal component for updating promotions
import { useVendor } from "../../utils/vendorContext"; // Vendor context for brandId

const PromotionsPage = ({ setActivePage }) => {
  const { vendor } = useVendor(); // Access vendor context for brandId
  const [products, setProducts] = useState([]);
  const [showFalseStatus, setShowFalseStatus] = useState(false); // Show products without promotion
  const [showTrueStatus, setShowTrueStatus] = useState(true); // Show products with promotion
  const [menuOpen, setMenuOpen] = useState({}); // Track which menu is open
  const [promotionModalOpen, setPromotionModalOpen] = useState(false); // Create promotion modal state
  const [updatePromotionModalOpen, setUpdatePromotionModalOpen] =
    useState(false); // Update promotion modal state
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product for promotion update
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
          const current = response.data.filter(
            (product) => product.isPromotionActive
          );
          const past = response.data.filter(
            (product) => !product.isPromotionActive
          );
          setCurrentPromotions(current);
          setPastPromotions(past);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      fetchProducts(); // Fetch products based on the brandId
    }
  }, [vendor]); // Re-fetch when vendor changes

  // Handle menu toggle for product options
  const toggleMenu = (productId) => {
    setMenuOpen((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId], // Toggle the specific product's menu
    }));
  };

  // Open promotion creation modal for a selected product
  const handleCreatePromotion = () => {
    setPromotionModalOpen(true); // Open create promotion modal
  };

  // Open promotion update modal for a selected product
  const handleUpdatePromotion = (product) => {
    setSelectedProduct(product); // Set the selected product for update
    setUpdatePromotionModalOpen(true); // Open update promotion modal
  };

  return (
    <div className="promotions-page">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>Promotions</h2>
          <p>Home &gt; Promotions</p>
        </div>
        <div className="dashboard-date-vendor">
          <button
            onClick={handleCreatePromotion}
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
                        <p>{product.price}</p>
                        <p>{product.salePrice}</p>
                      </div>
                      {/* <div className="menu-container">
                        <BsThreeDotsVertical
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the click from triggering the document listener
                            toggleMenu(product.id);
                          }}
                          className="three-dots-icon"
                        />
                        {menuOpen[product.id] && (
                          <div className="menu-dropdown">
                            <button onClick={() => handleInsights(product)}>
                              Promotion
                            </button>
                          </div>
                        )}
                      </div> */}
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
                            {product.promotionStartDate}-
                            {product.promotionEndDate}
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
                        <p>{product.price}</p>
                        <p>{product.salePrice}</p>
                      </div>
                      {/* <div className="menu-container">
                        <BsThreeDotsVertical
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the click from triggering the document listener
                            toggleMenu(product.id);
                          }}
                          className="three-dots-icon"
                        />
                        {menuOpen[product.id] && (
                          <div className="menu-dropdown">
                            <button onClick={() => handleEdit(product)}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(product)}>
                              Delete
                            </button>
                            <button onClick={() => handleInsights(product)}>
                              Promotion
                            </button>
                          </div>
                        )}
                      </div> */}
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
                            {product.promotionStartDate}-
                            {product.promotionEndDate}
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

      {/* Modal for creating promotion */}
      {promotionModalOpen && (
        <DiscountModal onClose={() => setPromotionModalOpen(false)} />
      )}
      {/* Modal for updating promotion */}
      {updatePromotionModalOpen && (
        <UpdatePromotionModal
          product={selectedProduct}
          onClose={() => setUpdatePromotionModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PromotionsPage;
