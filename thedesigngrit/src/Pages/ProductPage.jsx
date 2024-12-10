import React, { useState, useEffect } from "react";
import {Box, Button}from "@mui/material";
import { FaFile } from "react-icons/fa";
import Header from "../Components/navBar";
import { AiOutlineFileSearch } from "react-icons/ai";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import ReviewBox from "../Components/reviewBox";
import { fetchProductData  , fetchProductReview} from "../utils/fetchProductData";
import Footer from "../Components/Footer";
import RelatedProducts from "../Components/relatedProduct";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getProductData = async () => {
      const data = await fetchProductData();
      setProducts(data);
    };
    getProductData();
  }, []);
  useEffect(() => {
    const getReviewData = async () => {
      const data = await fetchProductReview();
      setReviews(data);
    };
    getReviewData();
  }, []);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [expandedSections, setExpandedSections] = React.useState({
    0: true, 
    1: true,
  });


  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleSectionToggle = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const [expandedSectionsMaterial, setExpandedSectionsMaterial] = useState({});

  const handleToggle = (index) => {
    setExpandedSectionsMaterial((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const sectionsMaterial = [
    "Delivery & Returns",
    "Care Instructions",
    "Composition & Details",
    "Recyclability",
  ];

  const navigate = useNavigate();

  const handleAddToCartClick = () => {
    navigate("/mycart"); // Navigate to the "MyCart" page
  };
  return (
    <div className="product-page">
      <Header />
      {/* Main Content */}
      {products.map((product) => (
        <div key={product.id} className="product-container">
          {/* Product Overview Section */}
          <div className="grid-container">
            {/* Product Image and Thumbnails */}
            <div className="product-image-container">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-main-image"
              />
              <div className="thumbnail-container">
                {product.thumbnailUrls.map((thumbnail, index) => (
                  <img
                    key={index}
                    src={thumbnail}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail-image"
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="product-details">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-brand">{product.brand}</p>
              <p className="product-rating">
                {"★".repeat(product.rating)} ({product.reviewsCount} reviews)
              </p>
              <p className="product-price">{product.price}</p>
              <hr />
              <div className="color-selector">
                <span className="color-selector-label">Color:</span>
                <br />
                <br />
                <div className="color-options">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`color-circle ${
                        selectedColor === color.name ? "selected" : ""
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColorSelect(color.name)}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>
              {/* Display Selected Color */}
              {selectedColor && (
                <p className="selected-color">Selected Color: {selectedColor}</p>
              )}
              <br />
              <hr />
              {/* Size Selector */}
              <span className="size-selector-label">Size:</span>
              <div className="size-selector">
                <br />
                <br />
                <div className="size-options">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`size-button ${
                        selectedSize === size ? "selected" : ""
                      }`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="bimcad-button">
                  BIM/CAD <AiOutlineFileSearch />
                </button>
              </div>
              {/* Display Selected Size */}
              {selectedSize && (
                <p className="selected-size">Selected Size: {selectedSize}</p>
              )}
              <div className="action-buttons">
                <button
                  className="action-button button-primary"
                  onClick={handleAddToCartClick}
                >
                  Add to Cart
                </button>
                <button className="action-button button-secondary">
                  Request Info
                </button>
              </div>
            </div>
          </div>

          <div className="page-container">
            {/* Collapsible Info Section */}
            <div className="collapsible-container">
              {["Overview", "Dimensions", "BIM/CAD", "Videos", "Tags"].map(
                (section, index) => (
                  <div
                    key={index}
                    className={`collapsible-section ${
                      expandedSections[index] ? "open" : ""
                    }`}
                    onClick={() => handleSectionToggle(index)}
                  >
                    <div className="collapsible-header">
                      {section}
                      <KeyboardArrowDownIcon
                        className={`collapsible-icon ${
                          expandedSections[index] ? "rotated" : ""
                        }`}
                      />
                    </div>
                    <div className="collapsible-content">
                      {section === "Overview" && (
                         <div>
                         <h5 style={{ fontSize: "25px" }}>
                           Manufacturer : Istikbal
                         </h5>
                         <div className="product-details">
                           <p style={{ fontSize: "20px" }}>
                             <span className="label">Collection:</span> {product.collection}
                           </p>
                           <p style={{ fontSize: "20px" }}>
                             <span className="label">Type:</span>{product.type}
                           </p>
                           <p style={{ fontSize: "20px" }}>
                             <span className="label">Manufacturer Year:</span>{" "}
                             {product.manufacturerYear}
                           </p>
                         </div>
 
                         <p style={{ fontSize: "20px" }}>
                          {product.description}
                         </p>
                       </div>
                      )}
                      {section === "Dimensions" && (
                        <img
                          src="Assets/productDemi.png"
                          alt="Product Dimensions"
                        />
                      )}
                      {section === "BIM/CAD" && (
                        <Button
                        sx={{
                          backgroundColor: "transparent",
                          color: "#2d2d2d",
                          borderRadius: "10px",
                          border: "1px solid #2d2d2d", // Correct way to set the border
                          width: "40%",
                          padding: "10px 20px",
                          minWidth: "150px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#000",
                            color: "#fff",
                          },
                        }}
                      >
                        {/* Left-aligned image */}
                        <img
                          src="Assets/autocadIcon.png" // Replace with the actual path to the AutoCAD logo
                          alt="AutoCAD Logo"
                          style={{
                            width: "24px",
                            height: "24px",
                            marginRight: "10px",
                          }}
                        />
                        {/* Centered text */}
                        <span>AutoCAD</span>{" "}
                        <span>
                          1 <FaFile sx={{ marginLeft: "10px" }} />
                        </span>
                        {/* Right-aligned file icon */}
                      </Button>
                      )}
                      {section === "Videos" && (
                        <iframe
                          width="560"
                          height="315"
                          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                          title="Product Video"
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      )}
                      {section === "Tags" && (
                        <div className="span-container">
                          {product.tags &&
                            product.tags.map((tag, index) => (
                              <span key={index}>{tag}</span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Right-Side Content */}
            <div className="right-side-content">
              <div className="Products-Materials">
                <h4>NATURAL AND RECYCLED MATERIALS</h4>
                <ul>
                  <li>R-LENO - Recycled Wool</li>
                  <span>Soft, comfortable, and lightweight</span>
                  <li>Designed to last a long time</li>
                  <span>Resistant materials that are easily washable</span>
                  <li>Waterproof to accompany you even in light rain</li>
                  <span>Flexible, lightweight, and cushioned</span>
                  <li>Inner Sole - Ortholite®</li>
                  <span>Removable and ergonomic</span>
                </ul>
              </div>
              <div className="material-collapsible-container">
                <h1 className="material-collapsible-title">LOCALLY MADE</h1>
                <p className="material-collapsible-description">
                  France: Recycled wool, Portugal: External sole, laces,
                  packaging, Spain: Inner sole, Handcrafted in Egypt.
                </p>

                <div className="material-collapsible-box">
                  {sectionsMaterial.map(
                    (section, index) => (
                      <div
                        key={index}
                        className="material-collapsible-section"
                      >
                        <div
                          className="material-collapsible-header"
                          onClick={() => handleToggle(index)}
                        >
                          <span>{section}</span>
                          <span className="material-collapsible-icon">
                            {expandedSectionsMaterial[index] ? "-" : "+"}
                          </span>
                        </div>
                        {expandedSectionsMaterial[index] && (
                          <div className="material-collapsible-content">
                            Content for {section} goes here...
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

        <hr style={{ marginTop: "20px" ,width: "90%", marginBottom:"30px"}}/>

         {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Reviews</h2>
          <Box className="review-Summary">
            <ReviewBox/>
          </Box>
          {reviews.map((review, index) => (
        <div key={index} className="review-card">
          <Box className="review-subtitle">
            <h3 className="review-title">{review.reviewerName}</h3>
            <p className="review-date">{review.reviewDate}</p>
          </Box>
          <p className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
          <p className="review-subtext">{review.reviewTitle}</p>
          <p className="review-text">{review.reviewText}</p>
        </div>
      ))}
        </div> 

        <hr style={{ marginTop: "20px" ,width: "90%", marginBottom:"30px"}}/>
        <RelatedProducts/>
      <Footer/>
      </div>
    
  );
}

export default ProductPage;
