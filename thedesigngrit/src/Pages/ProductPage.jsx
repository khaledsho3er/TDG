import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { FaFile } from "react-icons/fa";
import Header from "../Components/navBar";
import { AiOutlineFileSearch } from "react-icons/ai";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useParams } from "react-router-dom";
import ReviewBox from "../Components/reviewBox";
import {
  fetchProductData,
  fetchProductReview,
} from "../utils/fetchProductData";
import Footer from "../Components/Footer";
import RelatedProducts from "../Components/relatedProduct";
import { useCart } from "../Context/cartcontext";

function ProductPage() {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedMaterialSections, setExpandedMaterialSections] = useState({});
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch product data
    const getProductData = async () => {
      const data = await fetchProductData(id);
      if (data) {
        setProduct(data);
      } else {
        console.error("Product not found");
      }
    };

    // Fetch product reviews
    const getProductReviews = async () => {
      const reviewData = await fetchProductReview(id);
      setReviews(reviewData);
    };

    getProductData();
    getProductReviews();
  }, [id]);

  if (!product) return <div>Product not found</div>;
  const handleToggleSection = (index, type = "general") => {
    if (type === "general") {
      setExpandedSections((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    } else {
      setExpandedMaterialSections((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    }
  };

  const handleSectionToggle = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleAddToCart = (product) => {
    console.log(product); // Debugging the product object
    const parsedPrice = parseInt(product.price.replace(/,| E£/g, ""), 10); // Original code
    addToCart({
      id: product.id,
      name: product.name,
      unitPrice: parsedPrice,
      quantity: 1,
      image: product.image,
      brand: product.brand,
      color: product.colors[0]?.name || "N/A",
      size: product.sizes[0] || "N/A",
      code: "N/A",
    });
    navigate("/mycart");
  };

  return (
    <div className="product-page">
      <Header />

      <div className="product-container">
        <div className="grid-container">
          <div className="product-image-container">
            <img
              src={`/${product.imageUrl}`}
              alt={product.name}
              className="product-main-image"
            />
            <div className="thumbnail-container">
              {product.thumbnailUrls?.length ? (
                product.thumbnailUrls.map((thumbnail, index) => (
                  <img
                    key={index}
                    src={`/${thumbnail}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail-image"
                  />
                ))
              ) : (
                <p>No thumbnails available</p>
              )}
            </div>
          </div>

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
              <div className="color-options">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="color-circle"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  ></div>
                ))}
              </div>
            </div>
            {selectedColor && <p>Selected Color: {selectedColor}</p>}

            <hr />

            <div className="size-selector">
              <span className="size-selector-label">Size:</span>
              <div className="size-options">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`size-button ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {selectedSize && <p>Selected Size: {selectedSize}</p>}

            <div className="action-buttons">
              <button
                className="action-button button-primary"
                onClick={() => handleAddToCart(product)}
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

                  {/* Content for each section */}
                  <div className="collapsible-content">
                    {section === "Overview" && (
                      <div>
                        <h5 style={{ fontSize: "25px" }}>
                          Manufacturer : Istikbal
                        </h5>
                        <div className="product-details">
                          <p style={{ fontSize: "20px" }}>
                            <span className="label">Collection:</span> Duefets
                          </p>
                          <p style={{ fontSize: "20px" }}>
                            <span className="label">Type:</span> 2 Seater Fabric
                            Sofa
                          </p>
                          <p style={{ fontSize: "20px" }}>
                            <span className="label">Manufacturer Year:</span>{" "}
                            2024
                          </p>
                        </div>

                        <p style={{ fontSize: "20px" }}>
                          Characterised by distinct stylistic references to the
                          1970s, Dudet transfers to a two-seat settee the
                          versatile, sophisticated design of the chair in the
                          same family designed by Patricia Urquiola. Available
                          in one size only, the settee is defined by three
                          upholstered elements: a roomy seat cushion and two
                          sinuous tubular supports that, in one continuous line,
                          create legs, armrests and backrest.
                        </p>
                      </div>
                    )}
                    {section === "Dimensions" && (
                      <div>
                        <img src="/Assets/productDemi.png" />
                      </div>
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
                          src="/Assets/autocadIcon.png" // Replace with the actual path to the AutoCAD logo
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
                      <div>
                        <iframe
                          width="560"
                          height="315"
                          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                          title="Product Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                    {section === "Tags" && (
                      <div className="span-container">
                        <span>Sofa</span>
                        <span>Istkbal</span>
                        <span>Fabric</span>
                        <span>2 Seater Sofa</span>
                        <span>2024</span>
                        <span>Decor</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="right-side-content">
            <div className="Products-Materials">
              <h4>NATURAL AND RECYCLED MATERIALS</h4>
              <ul>
                <li>R-LENO - Recycled Wool</li>
                <span>Soft, comfortable, and lightweight</span>
                <li>Designed to last a long time</li>
                <span>Resistant materials that are easily washable</span>
                <li>Waterproof to accompany you even in light rain </li>
                <span>Flexible, lightweight, and cushioned</span>
                <li>Inner Sole - Ortholite®</li>
                <span>Removable and ergonomic</span>
              </ul>
            </div>

            <div className="material-collapsible-container">
              {["Delivery & Returns", "Care Instructions"].map(
                (section, index) => (
                  <div key={index} className="material-collapsible-section">
                    <div
                      className="material-collapsible-header"
                      onClick={() => handleToggleSection(index, "material")}
                    >
                      {section}
                      <span className="material-collapsible-icon">
                        {expandedMaterialSections[index] ? "-" : "+"}
                      </span>
                    </div>
                    {expandedMaterialSections[index] && (
                      <div className="material-collapsible-content">
                        Content for {section}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          <Box className="review-summary">
            <ReviewBox />
          </Box>
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <Box className="review-subtitle">
                <h3>{review.reviewerName}</h3>
                <p>{review.reviewDate}</p>
              </Box>
              <p>{"★".repeat(review.rating)}</p>
              <p>{review.reviewText}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductPage;
