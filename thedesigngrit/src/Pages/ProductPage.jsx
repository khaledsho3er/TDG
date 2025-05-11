import React, { useState, useEffect, useContext, useCallback } from "react";
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

function ProductPage() {
  // State for UI elements
  const [showRequestInfoPopup, setShowRequestInfoPopup] = useState(false);
  const [isRequestInfoOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const isMobile = useMediaQuery("(max-width:768px)");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedMaterialSections, setExpandedMaterialSections] = useState({});

  // State for product data
  const [product, setProduct] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  // Hooks
  const { id } = useParams();
  const { addToCart } = useCart();
  const { userSession } = useContext(UserContext);

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
        setActiveProduct(data);

        // Fetch reviews for this product
        fetchReviews(data._id);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000); // Reduced loading time for better UX
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
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch variants when product loads
  useEffect(() => {
    if (product) {
      const fetchVariants = async () => {
        try {
          const response = await fetch(
            `https://api.thedesigngrit.com/api/product-variants/product/${product._id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch variants");
          }
          const data = await response.json();
          setVariants(data);
        } catch (error) {
          console.error("Error fetching variants:", error);
        }
      };
      fetchVariants();
    }
  }, [product]);

  // Update activeProduct when a variant is selected
  useEffect(() => {
    if (selectedVariant) {
      setActiveProduct({
        ...product,
        ...selectedVariant,
        isVariant: true,
        parentName: product.name,
      });
    } else {
      setActiveProduct(product);
    }
  }, [selectedVariant, product]);

  // Update selected variant when color/size changes
  useEffect(() => {
    if (selectedColor || selectedSize) {
      const matchingVariant = variants.find(
        (variant) =>
          (!selectedColor ||
            variant.color.toLowerCase() === selectedColor.toLowerCase()) &&
          (!selectedSize ||
            variant.size.toLowerCase() === selectedSize.toLowerCase())
      );
      setSelectedVariant(matchingVariant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedSize, variants]);

  // Loading and error handling
  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  // Get available colors from variants
  const getAvailableColors = () => {
    if (variants.length === 0) return product.colors || [];

    const uniqueColors = [...new Set(variants.map((v) => v.color))];
    return uniqueColors.length > 0 ? uniqueColors : product.colors || [];
  };

  // Get available sizes for the selected color
  const getAvailableSizes = () => {
    if (!selectedColor || variants.length === 0) return product.sizes || [];

    const colorVariants = variants.filter(
      (variant) => variant.color.toLowerCase() === selectedColor.toLowerCase()
    );

    const uniqueSizes = [...new Set(colorVariants.map((v) => v.size))];
    return uniqueSizes.length > 0 ? uniqueSizes : product.sizes || [];
  };

  // Check if product is out of stock
  const isOutOfStock = activeProduct?.isVariant
    ? activeProduct.quantity === 0
    : product.stock === 0;

  // Event handlers
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
    const images =
      activeProduct?.isVariant && activeProduct.images?.length > 0
        ? activeProduct.images
        : product.images;

    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    const images =
      activeProduct?.isVariant && activeProduct.images?.length > 0
        ? activeProduct.images
        : product.images;

    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);

    // Find a variant with this color and the currently selected size (if any)
    let variant;
    if (selectedSize) {
      variant = variants.find(
        (v) =>
          v.color.toLowerCase() === color.toLowerCase() &&
          v.size.toLowerCase() === selectedSize.toLowerCase()
      );
    }

    // If no variant found with the current size, find any variant with this color
    if (!variant) {
      variant = variants.find(
        (v) => v.color.toLowerCase() === color.toLowerCase()
      );
    }

    if (variant) {
      setSelectedVariant(variant);

      // If this variant has a size, update the selected size
      if (variant.size && variant.size !== selectedSize) {
        setSelectedSize(variant.size);
      }
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);

    // Find a variant with this size and the currently selected color (if any)
    let variant;
    if (selectedColor) {
      variant = variants.find(
        (v) =>
          v.size.toLowerCase() === size.toLowerCase() &&
          v.color.toLowerCase() === selectedColor.toLowerCase()
      );
    }

    // If no variant found with the current color, find any variant with this size
    if (!variant) {
      variant = variants.find(
        (v) => v.size.toLowerCase() === size.toLowerCase()
      );

      // If we found a variant, update the selected color
      if (variant && variant.color) {
        setSelectedColor(variant.color);
      }
    }

    if (variant) {
      setSelectedVariant(variant);
    }
  };

  const handleSectionToggle = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleMaterialSectionToggle = (index) => {
    setExpandedMaterialSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const productToAdd = activeProduct?.isVariant ? activeProduct : product;

    addToCart({
      id: productToAdd._id,
      name: productToAdd.isVariant ? productToAdd.title : productToAdd.name,
      unitPrice: productToAdd.salePrice || productToAdd.price || 0,
      quantity: 1,
      image:
        productToAdd.isVariant && productToAdd.images?.length > 0
          ? productToAdd.images[0]
          : product.mainImage,
      brandId: productToAdd.brandId,
      color: selectedColor || "default",
      size: selectedSize || "default",
      code: productToAdd.sku || "N/A",
    });

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
            userId: userSession?.id,
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

      setToastMessage("Review submitted successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      setToastMessage("Failed to submit review. Please try again.");
      setShowToast(true);
    }
  };

  // Calculate rating breakdown for review summary
  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, count };
  });

  // Get available colors and sizes
  const availableColors = getAvailableColors();
  const availableSizes = getAvailableSizes();

  // Extract color value for display
  const extractColorValue = (colorName) => {
    const lowerColor = colorName.toLowerCase();

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

    return basicColorMap[lowerColor] || "#CCCCCC";
  };

  return (
    <div className="product-page">
      <Header />
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}

      <div className="product-container">
        <div className="grid-container">
          {/* Product Images */}
          <div className="product-image-container">
            <img
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${
                activeProduct.isVariant &&
                activeProduct.images &&
                activeProduct.images.length > 0
                  ? activeProduct.images[0]
                  : product.mainImage
              }`}
              alt={activeProduct.isVariant ? activeProduct.title : product.name}
              className="product-main-image"
              onClick={() => handleImageClick(0)}
            />
            <div className="thumbnail-container">
              {(activeProduct.isVariant &&
              activeProduct.images &&
              activeProduct.images.length > 0
                ? activeProduct.images
                : product.images
              )?.length ? (
                (activeProduct.isVariant &&
                activeProduct.images &&
                activeProduct.images.length > 0
                  ? activeProduct.images
                  : product.images
                ).map((image, index) => (
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

          {/* Product Details */}
          <div className="product-details">
            {/* Product Title */}
            <h1 className="product-title">
              {activeProduct.isVariant
                ? activeProduct.title
                : activeProduct.name}
            </h1>

            {/* Parent Product Name (if variant) */}
            {activeProduct.isVariant && (
              <p className="parent-product-name">{activeProduct.parentName}</p>
            )}

            {/* Brand Name */}
            <p className="product-brand">
              {product.brandId?.brandName || product.brandName || ""}
            </p>

            {/* SKU */}
            {activeProduct.sku && (
              <p className="product-sku">SKU: {activeProduct.sku}</p>
            )}

            <br />

            {/* Ready to Ship Badge */}
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

            {/* Stock Status */}
            {activeProduct.isVariant ? (
              // For variants, use quantity
              activeProduct.quantity === 0 ? (
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
              ) : activeProduct.quantity <= 5 ? (
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
                  HURRY UP!
                </Box>
              ) : null
            ) : // For parent product, use stock
            product.stock === 0 ? (
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
            ) : product.stock <= 5 ? (
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
                HURRY UP!
              </Box>
            ) : null}

            {/* Reviews and Discount */}
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

            {/* Price Display */}
            <p className="product-price">
              {activeProduct.isVariant ? (
                // Variant pricing logic
                activeProduct.salePrice ? (
                  // Variant has sale price
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
                  // Variant has only regular price
                  <>
                    {activeProduct.price > 1000
                      ? new Intl.NumberFormat("en-US").format(
                          activeProduct.price
                        )
                      : activeProduct.price}
                    .00 E£
                  </>
                )
              ) : // Parent product pricing logic
              product.salePrice ? (
                // Parent product has sale price
                <>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "gray",
                      marginRight: "8px",
                    }}
                  >
                    {product.price > 1000
                      ? new Intl.NumberFormat("en-US").format(product.price)
                      : product.price}
                    .00 E£
                  </span>
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    {product.salePrice > 1000
                      ? new Intl.NumberFormat("en-US").format(product.salePrice)
                      : product.salePrice}
                    .00 E£
                  </span>
                </>
              ) : (
                // Parent product has only regular price
                <>
                  {product.price > 1000
                    ? new Intl.NumberFormat("en-US").format(product.price)
                    : product.price}
                  .00 E£
                </>
              )}
            </p>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="product-colors">
                <p>Color: {selectedColor || "Select a color"}</p>
                <div className="color-options">
                  {availableColors.map((color, index) => (
                    <div
                      key={index}
                      className={`color-option ${
                        selectedColor === color ? "selected" : ""
                      }`}
                      style={{
                        backgroundColor: extractColorValue(color),
                        border:
                          selectedColor === color
                            ? "2px solid #000"
                            : "1px solid #ddd",
                      }}
                      onClick={() => handleColorSelect(color)}
                      title={color}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="product-sizes">
                <p>Size: {selectedSize || "Select a size"}</p>
                <div className="size-options">
                  {availableSizes.map((size, index) => (
                    <div
                      key={index}
                      className={`size-option ${
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

            {/* Add to Cart Button */}
            <div className="product-actions">
              <Button
                variant="contained"
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                sx={{
                  backgroundColor: isOutOfStock ? "#ccc" : "#2d2d2d",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: isOutOfStock ? "#ccc" : "#000",
                  },
                  marginRight: "10px",
                }}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                variant="outlined"
                className="request-info-button"
                onClick={() => setShowRequestInfoPopup(true)}
                sx={{
                  borderColor: "#2d2d2d",
                  color: "#2d2d2d",
                  "&:hover": {
                    borderColor: "#000",
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                Request Info
              </Button>
            </div>

            {/* Product Description */}
            <div className="product-description">
              <div
                className="description-header"
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
                <div className="description-content">
                  <p>{activeProduct.description || product.description}</p>
                </div>
              )}
            </div>

            {/* Product Specifications */}
            <div className="product-specifications">
              <div
                className="specifications-header"
                onClick={() => handleSectionToggle(1)}
              >
                <h3>Specifications</h3>
                <KeyboardArrowDownIcon
                  className={`arrow-icon ${
                    expandedSections[1] ? "rotated" : ""
                  }`}
                />
              </div>
              {expandedSections[1] && (
                <div className="specifications-content">
                  <ul>
                    {activeProduct.dimensions && (
                      <li>Dimensions: {activeProduct.dimensions}</li>
                    )}
                    {activeProduct.weight && (
                      <li>Weight: {activeProduct.weight}</li>
                    )}
                    {activeProduct.material && (
                      <li>Material: {activeProduct.material}</li>
                    )}
                    {activeProduct.warranty && (
                      <li>Warranty: {activeProduct.warranty}</li>
                    )}
                    {/* Add more specifications as needed */}
                  </ul>
                </div>
              )}
            </div>

            {/* Materials and Care */}
            <div className="product-materials">
              <div
                className="materials-header"
                onClick={() => handleSectionToggle(2)}
              >
                <h3>Materials & Care</h3>
                <KeyboardArrowDownIcon
                  className={`arrow-icon ${
                    expandedSections[2] ? "rotated" : ""
                  }`}
                />
              </div>
              {expandedSections[2] && (
                <div className="materials-content">
                  <p>
                    {activeProduct.careInstructions ||
                      "No care instructions available."}
                  </p>
                </div>
              )}
            </div>

            {/* Shipping Information */}
            <div className="product-shipping">
              <div
                className="shipping-header"
                onClick={() => handleSectionToggle(3)}
              >
                <h3>Shipping Information</h3>
                <KeyboardArrowDownIcon
                  className={`arrow-icon ${
                    expandedSections[3] ? "rotated" : ""
                  }`}
                />
              </div>
              {expandedSections[3] && (
                <div className="shipping-content">
                  <p>
                    {product.readyToShip
                      ? "This item is ready to ship and will be dispatched within 1-2 business days."
                      : "This item is made to order and will be dispatched within 2-3 weeks."}
                  </p>
                  <p>Standard shipping: 3-5 business days</p>
                  <p>
                    Express shipping: 1-2 business days (additional charges
                    apply)
                  </p>
                </div>
              )}
            </div>

            {/* Download Catalog Button */}
            {product.catalogPdf && (
              <div className="download-catalog">
                <a
                  href={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.catalogPdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="catalog-button"
                >
                  <FaDownload /> Download Catalog
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          {/* Review Summary */}
          <div className="review-summary">
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
                        ? "#FFD700"
                        : "#e4e5e9"
                    }
                  />
                ))}
              </div>
              <p>{reviews.length} reviews</p>
            </div>

            {/* Rating Breakdown */}
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

          {/* Write Review Button */}
          <div className="write-review">
            <Button
              variant="contained"
              onClick={() => setShowReviewForm(!showReviewForm)}
              sx={{
                backgroundColor: "#2d2d2d",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#000",
                },
              }}
            >
              {showReviewForm ? "Cancel Review" : "Write a Review"}
            </Button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="review-form">
              <h3>Write Your Review</h3>
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
                    {[...Array(5)].map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <FaStar
                          key={index}
                          size={24}
                          color={
                            starValue <= (hover || rating)
                              ? "#FFD700"
                              : "#e4e5e9"
                          }
                          onMouseEnter={() => setHover(starValue)}
                          onMouseLeave={() => setHover(0)}
                          onClick={() => setRating(starValue)}
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
                    rows={4}
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#2d2d2d",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#000",
                    },
                  }}
                >
                  Submit Review
                </Button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <ReviewBox key={index} review={review} />
              ))
            ) : (
              <p>No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products-section">
          <h2>Related Products</h2>
          <RelatedProducts
            productId={product._id}
            categoryId={product.categoryId}
          />
        </div>

        {/* Brand Carousel */}
        <div className="brand-carousel-section">
          <h2>More from {product.brandId?.brandName || product.brandName}</h2>
          <BrandCursol brandId={product.brandId?._id || product.brandId} />
        </div>

        {/* Request Info Popup */}
        <RequestInfoPopup
          show={showRequestInfoPopup}
          onClose={() => setShowRequestInfoPopup(false)}
          productId={product._id}
          productName={product.name}
        />

        {/* Image Modal */}
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
                src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${
                  (activeProduct.isVariant &&
                  activeProduct.images &&
                  activeProduct.images.length > 0
                    ? activeProduct.images
                    : product.images)[selectedImageIndex]
                }`}
                alt={`${selectedImageIndex + 1}`}
                className="modal-image"
              />
              <button className="modal-next" onClick={handleNextImage}>
                <IoIosArrowForward size={30} color="#fff" />
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ProductPage;
