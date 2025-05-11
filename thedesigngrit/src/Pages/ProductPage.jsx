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

  // New state for variants
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

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
        fetchReviews(data._id);

        // Fetch variants for this product
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

    const fetchVariants = async (productId) => {
      try {
        const response = await axios.get(
          `https://api.thedesigngrit.com/api/product-variants/product/${productId}`
        );

        if (response.data && response.data.length > 0) {
          setVariants(response.data);
          console.log("Variants loaded:", response.data);

          // Extract unique colors and sizes
          const colors = [
            ...new Set(response.data.map((v) => v.color).filter(Boolean)),
          ];
          const sizes = [
            ...new Set(response.data.map((v) => v.size).filter(Boolean)),
          ];

          setAvailableColors(colors);
          setAvailableSizes(sizes);
        }
      } catch (error) {
        console.error("Error fetching variants:", error);
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

    fetchProduct();
  }, [id]);

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;
  if (!product) return <div>Product not found</div>;

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);

    // Find a variant with this color and the currently selected size (if any)
    let variant;
    if (selectedSize) {
      variant = variants.find(
        (v) => v.color === color && v.size === selectedSize
      );
    }

    // If no variant found with the current size, find any variant with this color
    if (!variant) {
      variant = variants.find((v) => v.color === color);
    }

    if (variant) {
      setSelectedVariant(variant);

      // If this variant has a size, update the selected size
      if (variant.size && variant.size !== selectedSize) {
        setSelectedSize(variant.size);
      }
    }
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);

    // Find a variant with this size and the currently selected color (if any)
    let variant;
    if (selectedColor) {
      variant = variants.find(
        (v) => v.size === size && v.color === selectedColor
      );
    }

    // If no variant found with the current color, find any variant with this size
    if (!variant) {
      variant = variants.find((v) => v.size === size);
    }

    if (variant) {
      setSelectedVariant(variant);

      // If this variant has a color, update the selected color
      if (variant.color && variant.color !== selectedColor) {
        setSelectedColor(variant.color);
      }
    }
  };

  const handleImageClick = (index) => {
    // If we have a selected variant with images, use those
    const imagesToUse =
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
        ? selectedVariant.images
        : product.images;

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
    const imagesToUse =
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
        ? selectedVariant.images
        : product.images;

    setSelectedImageIndex(
      (prev) => (prev - 1 + imagesToUse.length) % imagesToUse.length
    );
  };

  const handleNextImage = () => {
    const imagesToUse =
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
        ? selectedVariant.images
        : product.images;

    setSelectedImageIndex((prev) => (prev + 1) % imagesToUse.length);
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

  const handleAddToCart = () => {
    // If we have a selected variant, add that to cart
    if (selectedVariant) {
      addToCart({
        id: selectedVariant._id,
        name: selectedVariant.title || product.name,
        unitPrice: selectedVariant.price || product.price,
        quantity: 1,
        image:
          selectedVariant.images && selectedVariant.images.length > 0
            ? selectedVariant.images[0]
            : product.mainImage,
        brandId: product.brandId,
        color: selectedVariant.color || selectedColor || "default",
        size: selectedVariant.size || selectedSize || "default",
        code: selectedVariant.sku || "N/A",
        productId: product._id, // Add parent product ID
        isVariant: true,
      });
    } else {
      // Otherwise add the main product
      addToCart({
        id: product._id,
        name: product.name,
        unitPrice: product.salePrice || product.price || 0,
        quantity: 1,
        image: product.mainImage,
        brandId: product.brandId,
        color: selectedColor || "default",
        size: selectedSize || "default",
        code: "N/A",
      });
    }

    setToastMessage("Item added successfully to cart!");
    setShowToast(true);
  };

  //Review Function Post
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

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, count };
  });

  // Determine which images to display based on selected variant
  const displayImages =
    selectedVariant &&
    selectedVariant.images &&
    selectedVariant.images.length > 0
      ? selectedVariant.images
      : product.images;

  const mainImage =
    selectedVariant &&
    selectedVariant.images &&
    selectedVariant.images.length > 0
      ? selectedVariant.images[0]
      : product.mainImage;

  // Determine price to display based on selected variant
  const displayPrice = selectedVariant
    ? selectedVariant.price
    : product.salePrice || product.price;
  const originalPrice = product.price;
  const showDiscountedPrice = selectedVariant
    ? selectedVariant.price < originalPrice
    : product.salePrice && product.salePrice < product.price;

  // Determine stock status
  const isOutOfStock = selectedVariant
    ? selectedVariant.quantity === 0
    : product.stock === 0;
  const isLowStock = selectedVariant
    ? selectedVariant.quantity <= 5
    : product.stock <= 5;

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
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${mainImage}`}
              alt={selectedVariant ? selectedVariant.title : product.name}
              className="product-main-image"
              onClick={() => handleImageClick(0)}
            />
            <div className="thumbnail-container">
              {displayImages?.length ? (
                displayImages.map((image, index) => (
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
            {/* Show variant title if selected, otherwise show product name */}
            <h1 className="product-title">
              {selectedVariant && selectedVariant.title
                ? selectedVariant.title
                : product.name}
            </h1>

            {/* If variant is selected, show parent product name underneath */}
            {selectedVariant && selectedVariant.title && (
              <p className="parent-product-name">{product.name}</p>
            )}

            <p className="product-brand">
              {product.brandId?.brandName || product.brandName || ""}
            </p>

            {/* Show SKU if available */}
            {selectedVariant && selectedVariant.sku && (
              <p className="product-sku">SKU: {selectedVariant.sku}</p>
            )}

            <br />
            {product.readyToShip === true && (
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
            {isOutOfStock ? (
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
            ) : isLowStock ? (
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
                  animation: "pulse 1.5s infinite",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)", opacity: 1 },
                    "50%": { transform: "scale(1.05)", opacity: 0.8 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              >
                HURRY UP!
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
                  display: product.discountPercentage ? "block" : "none",
                  alignSelf: "end",
                }}
              >
                {product.discountPercentage ? (
                  `${product.discountPercentage}% off`
                ) : (
                  <span style={{ display: "none" }}></span>
                )}
              </p>
            </div>
            <p className="product-price">
              {showDiscountedPrice ? (
                <>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "gray",
                      marginRight: "8px",
                    }}
                  >
                    {originalPrice > 1000
                      ? new Intl.NumberFormat("en-US").format(originalPrice)
                      : originalPrice}
                    .00 E£
                  </span>
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {displayPrice > 1000
                      ? new Intl.NumberFormat("en-US").format(displayPrice)
                      : displayPrice}
                    .00 E£
                  </span>
                </>
              ) : (
                <>
                  {displayPrice > 1000
                    ? new Intl.NumberFormat("en-US").format(displayPrice)
                    : displayPrice}
                  .00 E£
                </>
              )}
            </p>

            <hr />

            {/* Color selector - only show if we have variants with colors */}
            {availableColors.length > 0 && (
              <div className="color-selector">
                <span className="color-selector-label">Color:</span>
                <div className="color-options">
                  {availableColors.map((color, index) => {
                    // Basic color extraction function
                    const extractColorValue = (colorName) => {
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
                        navy: "#000080",
                        teal: "#008080",
                        gold: "#FFD700",
                        silver: "#C0C0C0",
                        bronze: "#CD7F32",
                      };

                      return basicColorMap[lowerColor] || "#CCCCCC"; // Default gray if color not found
                    };

                    const colorValue = extractColorValue(color);
                    const isLightColor =
                      colorValue === "#FFFFFF" || colorValue === "#F5F5DC";

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
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
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
                  <p>{product.description}</p>
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
                    {product.materials || "Materials information not available"}
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

        {(isModalOpen || isTransitioning) && (
          <div className={`modal ${isTransitioning ? "opening" : "closing"}`}>
            <div className="modal-content">
              <button className="modal-close" onClick={handleCloseModal}>
                <IoMdClose size={30} color="#fff" />
              </button>
              <button className="modal-prev" onClick={handlePrevImage}>
                <IoIosArrowBack size={30} color="#fff" />
              </button>
              <img
                src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${displayImages[selectedImageIndex]}`}
                alt={`${selectedImageIndex + 1}`}
                className="modal-image"
              />
              <button className="modal-next" onClick={handleNextImage}>
                <IoIosArrowForward size={30} color="#fff" />
              </button>
            </div>
          </div>
        )}
        <hr
          style={{
            width: "90%",
            textAlign: "center",
            margin: "auto",
            marginBottom: "20px",
          }}
        ></hr>
        <div className="reviews-section" style={{ padding: "0 3rem" }}>
          <h2>Related Products</h2>
          <RelatedProducts productId={product._id} />
        </div>
        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Reviews</h2>
            <button
              onClick={() => setShowReviewForm(true)}
              className="write-review-btn"
            >
              Write a Review
            </button>
          </div>

          {showReviewForm && (
            <div className="review-form-overlay">
              <div className="review-form-container">
                <button
                  className="close-form-btn"
                  onClick={() => setShowReviewForm(false)}
                  style={{ backgroundColor: hover ? "transparent" : "" }}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  <IoMdClose />
                </button>
                <h3>Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="review-form">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      required
                      className="review-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Rating</label>
                    <div className="star-rating">
                      {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                          <FaStar
                            key={index}
                            className="star"
                            color={
                              ratingValue <= (hover || rating)
                                ? "#ffc107"
                                : "#e4e5e9"
                            }
                            size={24}
                            onClick={() => setRating(ratingValue)}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(rating)}
                            style={{ cursor: "pointer" }}
                          />
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
                      className="review-textarea"
                      rows={4}
                    />
                  </div>

                  <button type="submit" className="submit-review-btn">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
          <div style={{ paddingLeft: "1rem" }}>
            <Box className="review-summary">
              <ReviewBox reviewsData={ratingBreakdown} />
            </Box>

            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <Box className="review-subtitle">
                    <h3>{review.reviewerName}</h3>
                    <p>{review.reviewDate}</p>
                  </Box>
                  <p>{"★".repeat(review.rating)}</p>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <BsExclamationOctagon size={50} color="#ccc" />

                <p className="no-reviews">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductPage;
