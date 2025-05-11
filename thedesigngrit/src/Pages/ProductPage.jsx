import React, { useState, useEffect, useContext } from "react";
import { Box, Button, useMediaQuery } from "@mui/material";
import { FaStar, FaDownload } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import Header from "../Components/navBar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useParams } from "react-router-dom";
import ReviewBox from "../Components/reviewBox";
import RequestInfoPopup from "../Components/product/optionPopUp";
import Footer from "../Components/Footer";
import { useCart } from "../Context/cartcontext";
import LoadingScreen from "./loadingScreen";
import { UserContext } from "../utils/userContext";
import RelatedProducts from "../Components/relatedProducts";
import BrandCursol from "../Components/brandCursol";
import Toast from "../Components/toast";
import { BsExclamationOctagon } from "react-icons/bs";
import axios from "axios";

function ProductPage() {
  const [showRequestInfoPopup, setShowRequestInfoPopup] = useState(false);
  const [isRequestInfoOpen] = useState(true);
  const { userSession } = useContext(UserContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const isMobile = useMediaQuery("(max-width:768px)");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedMaterialSections, setExpandedMaterialSections] = useState({});
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  // Variant states
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);

  // Fetch product details by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/products/getsingle/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
        setActiveProduct(data); // Initialize active product with main product
        fetchReviews(data._id);
        fetchVariants(data._id);
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    const fetchReviews = async (productId) => {
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/reviews/reviews/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };

    const fetchVariants = async (productId) => {
      try {
        const response = await axios.get(
          `https://api.thedesigngrit.com/api/product-variants/product/${productId}`
        );
        if (response.data && response.data.length > 0) {
          setVariants(response.data);
          console.log("Variants loaded:", response.data);
        }
      } catch (error) {
        console.log("Error fetching variants:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Effect to update active product when variant is selected
  useEffect(() => {
    if (!product) return;

    if (!selectedVariant) {
      setActiveProduct(product);
      return;
    }

    // Create a merged product with variant details
    const variantProduct = {
      ...product,
      price: selectedVariant.price || product.price,
      mainImage:
        selectedVariant.images && selectedVariant.images.length > 0
          ? selectedVariant.images[0]
          : product.mainImage,
      images:
        selectedVariant.images?.length > 0
          ? selectedVariant.images
          : product.images,
      stock: selectedVariant.quantity,
      sku: selectedVariant.sku || product.sku,
      _variantId: selectedVariant._id,
    };

    setActiveProduct(variantProduct);
  }, [product, selectedVariant]);

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;
  if (!activeProduct) return <div>Product not found</div>;

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsTransitioning(true);
    setTimeout(() => setIsModalOpen(true), 300);
  };

  const handleCloseModal = () => {
    setIsTransitioning(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedImageIndex(null);
    }, 300);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(
      (prev) =>
        (prev - 1 + activeProduct.images.length) % activeProduct.images.length
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % activeProduct.images.length);
  };

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

  const handleColorSelect = (color) => {
    setSelectedColor(color);

    // Find variant with this color and current size (if any)
    let variant;
    if (selectedSize) {
      variant = variants.find(
        (v) => v.color === color && v.size === selectedSize
      );
    }

    // If no variant found with current size, just find one with this color
    if (!variant) {
      variant = variants.find((v) => v.color === color);
    }

    if (variant) {
      setSelectedVariant(variant);
      // If this variant has a specific size, select it
      if (variant.size && variant.size !== selectedSize) {
        setSelectedSize(variant.size);
      }
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);

    // Find variant with this size and current color (if any)
    let variant;
    if (selectedColor) {
      variant = variants.find(
        (v) => v.size === size && v.color === selectedColor
      );
    }

    // If no variant found with current color, just find one with this size
    if (!variant) {
      variant = variants.find((v) => v.size === size);
    }

    if (variant) {
      setSelectedVariant(variant);
      // If this variant has a specific color, select it
      if (variant.color && variant.color !== selectedColor) {
        setSelectedColor(variant.color);
      }
    }
  };

  const handleAddToCart = () => {
    // Check if we have a selected variant
    const productToAdd = {
      id: activeProduct._id,
      name: activeProduct.name,
      unitPrice: selectedVariant
        ? selectedVariant.price
        : activeProduct.salePrice || activeProduct.price || 0,
      quantity: 1,
      image: activeProduct.mainImage,
      brandId: activeProduct.brandId,
      color: selectedColor || "default",
      size: selectedSize || "default",
      code: selectedVariant ? selectedVariant.sku : activeProduct.sku || "N/A",
      variantId: selectedVariant ? selectedVariant._id : null,
    };

    addToCart(productToAdd);
    setToastMessage("Item added successfully to cart!");
    setShowToast(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://api.thedesigngrit.com/api/reviews/createreviews/${product._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewerName,
            userId: userSession.id,
            rating,
            comment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // Update reviews in state
      const updatedProduct = await response.json();
      setReviews(updatedProduct.reviews);

      // Reset form
      setShowReviewForm(false);
      setRating(0);
      setComment("");
      setReviewerName("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // Extract available colors and sizes from variants
  const availableColors = [
    ...new Set(variants.map((v) => v.color).filter(Boolean)),
  ];
  const availableSizes = [
    ...new Set(variants.map((v) => v.size).filter(Boolean)),
  ];

  // Basic color extraction function
  const extractColorValue = (colorName) => {
    if (!colorName) return "#CCCCCC";

    // Convert to lowercase for comparison
    const lowerColor = colorName.toLowerCase();

    // Basic color map for common colors
    const basicColorMap = {
      white: "#FFFFFF",
      black: "#000000",
      red: "#FF0000",
      green: "#008000",
      blue: "#0000FF",
      yellow: "#FFFF00",
      purple: "#800080",
      orange: "#FFA500",
      pink: "#FFC0CB",
      brown: "#A52A2A",
      gray: "#808080",
      grey: "#808080",
      beige: "#F5F5DC",
      cream: "#FFFDD0",
      gold: "#FFD700",
      silver: "#C0C0C0",
      navy: "#000080",
      olive: "#808000",
      maroon: "#800000",
      teal: "#008080",
      tan: "#D2B48C",
      coral: "#FF7F50",
      sage: "#BCB88A",
      charcoal: "#36454F",
    };

    // Try exact match first
    if (basicColorMap[lowerColor]) {
      return basicColorMap[lowerColor];
    }

    // Try to extract a basic color from the name
    for (const [basicColor, hexValue] of Object.entries(basicColorMap)) {
      if (lowerColor.includes(basicColor)) {
        return hexValue;
      }
    }

    // If no match found, use a neutral gray with the color name displayed
    return "#CCCCCC";
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, count };
  });

  return (
    <div className="product-page">
      <Header />
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}

      <div className="product-container">
        <div className="grid-container">
          <div className="product-image-container">
            <img
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${activeProduct.mainImage}`}
              alt={activeProduct.name}
              className="product-main-image"
              onClick={() => handleImageClick(0)}
            />
            <div className="thumbnail-container">
              {activeProduct.images?.length ? (
                activeProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail-image"
                    onClick={() => handleImageClick(index)}
                  />
                ))
              ) : (
                <p>No thumbnails available</p>
              )}
            </div>
          </div>

          <div className="product-details">
            <h1 className="product-title">{activeProduct.name}</h1>
            <p className="product-brand">
              {activeProduct?.brandName || "Undefined"}
            </p>
            {selectedVariant && selectedVariant.sku && (
              <p className="product-sku">SKU: {selectedVariant.sku}</p>
            )}
            <br />
            {activeProduct.readyToShip === true && (
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  border: "1px solid #2d2d2d",
                  borderRadius: "4px",
                  marginTop: "8px",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontFamily: "Montserrat",
                }}
              >
                Ready to Ship
              </div>
            )}
            {(
              selectedVariant
                ? selectedVariant.quantity === 0
                : activeProduct.stock === 0
            ) ? (
              <Box
                sx={{
                  display: "inline-block",
                  padding: "4px 12px",
                  border: "1px solid #2d2d2d",
                  borderRadius: "4px",
                  marginTop: "8px",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontFamily: "Montserrat",
                  backgroundColor: "#DD4A2A",
                  color: "#fff",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                SOLD OUT
              </Box>
            ) : (
                selectedVariant
                  ? selectedVariant.quantity <= 5
                  : activeProduct.stock <= 5
              ) ? (
              <Box
                sx={{
                  display: "inline-block",
                  padding: "4px 12px",
                  border: "1px solid #2d2d2d",
                  borderRadius: "4px",
                  marginTop: "8px",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontFamily: "Montserrat",
                  backgroundColor: "#FFAC1C",
                  color: "#fff",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                HURRY UP! Only{" "}
                {selectedVariant
                  ? selectedVariant.quantity
                  : activeProduct.stock}{" "}
                left
              </Box>
            ) : null}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <p className="product-rating">
                {reviews.length > 0 ? (
                  <>
                    {"★".repeat(
                      Math.round(
                        reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0
                        ) / reviews.length
                      )
                    )}
                    {" ( of " + reviews.length + " reviews)"}
                  </>
                ) : (
                  <span>No reviews yet</span>
                )}
              </p>
              <p
                style={{
                  display: activeProduct.discountPercentage ? "block" : "none",
                  alignSelf: "end",
                }}
              >
                {activeProduct.discountPercentage ? (
                  `${activeProduct.discountPercentage}% off`
                ) : (
                  <span style={{ display: "none" }}></span>
                )}
              </p>
            </div>
            <p className="product-price">
              {selectedVariant ? (
                <>
                  {selectedVariant.price > 1000
                    ? new Intl.NumberFormat("en-US").format(
                        selectedVariant.price
                      )
                    : selectedVariant.price}
                  .00 E£
                </>
              ) : activeProduct.salePrice ? (
                <>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "gray",
                      marginRight: "8px",
                    }}
                  >
                    {activeProduct.price > 1000
                      ? new Intl.NumberFormat("en-US").format(
                          activeProduct.price
                        )
                      : activeProduct.price}
                    .00 E£
                  </span>
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {activeProduct.salePrice > 1000
                      ? new Intl.NumberFormat("en-US").format(
                          activeProduct.salePrice
                        )
                      : activeProduct.salePrice}
                    .00 E£
                  </span>
                </>
              ) : (
                <>
                  {activeProduct.price > 1000
                    ? new Intl.NumberFormat("en-US").format(activeProduct.price)
                    : activeProduct.price}
                  .00 E£
                </>
              )}
            </p>

            <hr />

            {/* Color Selector */}
            {availableColors.length > 0 && (
              <div className="color-selector">
                <span className="color-selector-label">Color:</span>
                <div className="color-options">
                  {availableColors.map((color, index) => {
                    const colorValue = extractColorValue(color);

                    // Check if color is light
                    const isLightColor =
                      colorValue === "#FFFFFF" ||
                      colorValue === "#F5F5DC" ||
                      colorValue === "#FFFDD0" ||
                      color.toLowerCase().includes("white") ||
                      color.toLowerCase().includes("cream") ||
                      color.toLowerCase().includes("beige") ||
                      color.toLowerCase().includes("ivory");

                    return (
                      <div
                        key={index}
                        className={`color-circle ${
                          selectedColor === color ? "selected" : ""
                        }`}
                        style={{
                          backgroundColor: colorValue,
                          border: isLightColor ? "1px solid #ddd" : "none",
                        }}
                        onClick={() => handleColorSelect(color)}
                        title={color}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {selectedColor && (
              <p className="selected-color-text">
                Selected Color: {selectedColor}
              </p>
            )}

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="size-selector">
                <span className="size-selector-label">Size:</span>
                <div className="size-options">
                  {availableSizes.map((size, index) => (
                    <div
                      key={index}
                      className={`size-box ${
                        selectedSize === size ? "selected" : ""
                      }`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedSize && (
              <p className="selected-size-text">
                Selected Size: {selectedSize}
              </p>
            )}

            {/* Product Dimensions */}
            {selectedVariant && selectedVariant.dimensions && (
              <div className="product-dimensions">
                <h3>Dimensions:</h3>
                <ul>
                  {selectedVariant.dimensions?.length && (
                    <li>Length: {selectedVariant.dimensions.length} cm</li>
                  )}
                  {selectedVariant.dimensions?.width && (
                    <li>Width: {selectedVariant.dimensions.width} cm</li>
                  )}
                  {selectedVariant.dimensions?.height && (
                    <li>Height: {selectedVariant.dimensions.height} cm</li>
                  )}
                  {selectedVariant.dimensions?.weight && (
                    <li>Weight: {selectedVariant.dimensions.weight} kg</li>
                  )}
                </ul>
              </div>
            )}

            <div className="product-actions">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={
                  selectedVariant
                    ? selectedVariant.quantity === 0
                    : activeProduct.stock === 0
                }
              >
                {(
                  selectedVariant
                    ? selectedVariant.quantity === 0
                    : activeProduct.stock === 0
                )
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>
              <button
                className="request-info-btn"
                onClick={() => setShowRequestInfoPopup(true)}
              >
                Request Info
              </button>
            </div>

            <div className="product-description">
              <div
                className={`section-header ${
                  expandedSections[0] ? "expanded" : ""
                }`}
                onClick={() => handleSectionToggle(0)}
              >
                <h3>Description</h3>
                <KeyboardArrowDownIcon
                  className={`arrow-icon ${
                    expandedSections[0] ? "rotated" : ""
                  }`}
                />
              </div>
              {expandedSections[0] && (
                <div className="section-content">
                  <p>{activeProduct.description}</p>
                </div>
              )}
            </div>

            <div className="product-materials">
              <div
                className={`section-header ${
                  expandedSections[1] ? "expanded" : ""
                }`}
                onClick={() => handleSectionToggle(1)}
              >
                <h3>Materials</h3>
                <KeyboardArrowDownIcon
                  className={`arrow-icon ${
                    expandedSections[1] ? "rotated" : ""
                  }`}
                />
              </div>
              {expandedSections[1] && (
                <div className="section-content">
                  <p>
                    {activeProduct.materials ||
                      "Materials information not available"}
                  </p>
                </div>
              )}
            </div>

            <div className="product-shipping">
              <div
                className={`section-header ${
                  expandedSections[2] ? "expanded" : ""
                }`}
                onClick={() => handleSectionToggle(2)}
              >
                <h3>Shipping & Returns</h3>
                <KeyboardArrowDownIcon
                  className={`arrow-icon ${
                    expandedSections[2] ? "rotated" : ""
                  }`}
                />
              </div>
              {expandedSections[2] && (
                <div className="section-content">
                  <p>
                    Shipping: We offer standard shipping across Egypt. Delivery
                    times vary based on location.
                  </p>
                  <p>
                    Returns: Items can be returned within 14 days of delivery.
                    Please ensure the product is in its original condition.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          <div className="reviews-summary">
            <div className="average-rating">
              <h3>
                {reviews.length > 0
                  ? (
                      reviews.reduce((acc, review) => acc + review.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "0.0"}
              </h3>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    color={
                      reviews.length > 0 &&
                      star <=
                        Math.round(
                          reviews.reduce(
                            (acc, review) => acc + review.rating,
                            0
                          ) / reviews.length
                        )
                        ? "#ffc107"
                        : "#e4e5e9"
                    }
                  />
                ))}
              </div>
              <p>{reviews.length} reviews</p>
            </div>
            <div className="rating-breakdown">
              {ratingBreakdown.map(({ stars, count }) => (
                <div key={stars} className="rating-bar">
                  <span>{stars} stars</span>
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: `${
                          reviews.length > 0
                            ? (count / reviews.length) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {userSession && !showReviewForm && (
            <button
              className="write-review-btn"
              onClick={() => setShowReviewForm(true)}
            >
              Write a Review
            </button>
          )}

          {showReviewForm && (
            <div className="review-form">
              <h3>Write a Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <div className="star-rating">
                    {[...Array(5)].map((star, index) => {
                      const ratingValue = index + 1;
                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            style={{ display: "none" }}
                          />
                          <FaStar
                            className="star"
                            color={
                              ratingValue <= (hover || rating)
                                ? "#ffc107"
                                : "#e4e5e9"
                            }
                            size={24}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-review-btn">
                    Submit Review
                  </button>
                  <button
                    type="button"
                    className="cancel-review-btn"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <h4>{review.reviewerName}</h4>
                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                        />
                      ))}
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>

        <RelatedProducts productId={activeProduct._id} />
        <BrandCursol />
      </div>

      {/* Image Modal */}
      {isModalOpen && selectedImageIndex !== null && (
        <div
          className={`image-modal ${isTransitioning ? "transitioning" : ""}`}
          onClick={handleCloseModal}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={handleCloseModal}>
              <IoMdClose />
            </button>
            <button className="prev-image" onClick={handlePrevImage}>
              <IoIosArrowBack />
            </button>
            <img
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${activeProduct.images[selectedImageIndex]}`}
              alt={`Product ${selectedImageIndex + 1}`}
            />
            <button className="next-image" onClick={handleNextImage}>
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      )}

      {/* Request Info Popup */}
      <RequestInfoPopup
        show={showRequestInfoPopup}
        onClose={() => setShowRequestInfoPopup(false)}
        productId={activeProduct._id}
        productName={activeProduct.name}
        isOpen={isRequestInfoOpen}
      />

      <Footer />
    </div>
  );
}

export default ProductPage;
