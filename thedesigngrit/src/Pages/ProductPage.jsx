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

function ProductPage() {
  const [showRequestInfoPopup, setShowRequestInfoPopup] = useState(false); // State for Request Info Popup visibility
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
  const [loading, setLoading] = useState(true); // Loading state for when the product is being fetched
  const [error, setError] = useState(null); // State for handling errors
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  // Fetch product details by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/products/getsingle/${id}`
        ); // Make an API call to fetch the product by ID
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data); // Set the fetched product to state
        fetchReviews(data._id);
      } catch (error) {
        console.log(error);

        setError(error.message); // Set error if something goes wrong
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 5000);
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
        setReviews(data); // Assuming the response is an array of reviews
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };

    fetchProduct(); // Fetch product on component mount
  }, [id, error, loading]); // Refetch if the ID in the URL changes

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;
  if (!product) return <div>Product not found</div>;

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
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
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
  // const handleColorSelect = (color) => {
  //   setSelectedColor(color);
  // };
  const handleSectionToggle = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAddToCart = (product) => {
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
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
              alt={product.name}
              className="product-main-image"
              onClick={() => handleImageClick(0)} // Main image click opens modal
            />
            <div className="thumbnail-container">
              {product.images?.length ? (
                product.images.map((image, index) => (
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
            <h1 className="product-title">{product.name}</h1>
            <p className="product-brand">{product.brandName}</p>
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
            {product.stock === 0 ? (
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
              {product.salePrice ? (
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
                <>
                  {product.price > 1000
                    ? new Intl.NumberFormat("en-US").format(product.price)
                    : product.price}
                  .00 E£
                </>
              )}
            </p>

            <hr />
            <div className="color-selector">
              <span className="color-selector-label">Color:</span>
              <div className="color-options">
                {product.colors && product.colors.length > 0 ? (
                  product.colors.map((color, index) => (
                    <div
                      key={index}
                      className="color-circle"
                      style={{
                        backgroundColor: color,
                        border:
                          color === "white" ||
                          color === "offwhite" ||
                          color === "beige"
                            ? "1px solid #2d2d2d"
                            : "none",
                      }}
                      title={color.name}
                      onClick={() => setSelectedColor(color.name)}
                    ></div>
                  ))
                ) : (
                  <p>
                    This product is only available in one color, so you don't
                    have to worry about choosing the perfect shade!
                  </p>
                )}
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
              <button
                className="action-button button-secondary"
                onClick={() => setShowRequestInfoPopup(true)} // Open Request Info Popup
              >
                Request Info
              </button>
            </div>
            {/* Request Info Popup */}
            {isRequestInfoOpen && (
              <RequestInfoPopup
                open={showRequestInfoPopup}
                onClose={() => setShowRequestInfoPopup(false)}
                productId={product} // Pass productId here
              />
            )}
          </div>
        </div>

        <div className="page-container">
          {/* Collapsible Info Section */}
          <div className="collapsible-container">
            {["Overview", "Dimensions", "BIM/CAD", "Tags"].map(
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
                      <div className="product-contents">
                        <h5
                          style={{
                            fontSize: isMobile ? "20px" : "25px",
                            marginLeft: "0px",
                          }}
                        >
                          Manufacturer :{product.brandId.brandName}
                        </h5>
                        <div className="product-details">
                          <p style={{ fontSize: isMobile ? "13px" : "20px" }}>
                            <span className="label">Collection:</span>
                            {product.collection}
                          </p>
                          {/* <p style={{ fontSize: "20px" }}>
                            <span className="label">Type:</span> 2 Seater Fabric
                            Sofa
                          </p> */}
                          <p style={{ fontSize: isMobile ? "13px" : "20px" }}>
                            <span className="label">Manufacturer Year:</span>{" "}
                            {product.manufactureYear}
                          </p>
                        </div>

                        <p
                          style={{
                            fontSize: isMobile ? "13px" : "20px",
                            textAlign: "justify",
                          }}
                        >
                          {product.description}
                        </p>
                      </div>
                    )}
                    {section === "Dimensions" && (
                      <div className="product-contents">
                        {/* <img src="/Assets/productDemi.webp" alt="Dimensions" /> */}
                        <p>Width X Length X Height</p>
                        <p>
                          <strong>{product.technicalDimensions.width}</strong>{" "}
                          cm x{"  "}
                          <strong>
                            {" "}
                            {product.technicalDimensions.length}
                          </strong>{" "}
                          cm X{"  "}
                          <strong>
                            {product.technicalDimensions.height}
                          </strong>{" "}
                          cm
                        </p>
                        <p>
                          Weight :{" "}
                          <strong>{product.technicalDimensions.weight}</strong>{" "}
                          Kgs
                        </p>
                      </div>
                    )}
                    {section === "BIM/CAD" && (
                      <div className="product-contents">
                        <Button
                          sx={{
                            backgroundColor: "transparent",
                            color: "#2d2d2d",
                            borderRadius: "10px",
                            border: "1px solid #2d2d2d",
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
                          onClick={() => {
                            if (product.cadFile) {
                              // Create a temporary anchor element
                              const link = document.createElement("a");
                              link.href = `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.cadFile}`; // Add the URL prefix
                              link.download = `product_cad_${product._id}`; // Suggested filename
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            } else {
                              alert("No CAD file available for download");
                            }
                          }}
                        >
                          {/* Left-aligned image */}
                          <img
                            src="/Assets/autocadIcon.webp"
                            alt="AutoCAD Logo"
                            style={{
                              width: "24px",
                              height: "24px",
                              marginRight: "10px",
                            }}
                          />
                          {/* Centered text */}
                          <span>Download CAD File</span>
                          {/* Right-aligned download icon */}
                          <FaDownload style={{ marginLeft: "10px" }} />
                        </Button>
                      </div>
                    )}
                    {/* {section === "Videos" && (
                      <div className="product-contents">
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
                    )} */}
                    {section === "Tags" && product.tags && (
                      <div className="span-container">
                        {product.tags.length > 0 ? (
                          product.tags.map((tag, index) => (
                            <span key={index}>{tag}</span>
                          ))
                        ) : (
                          <p>No tags available.</p>
                        )}
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
              {[
                "Delivery & Returns",
                "Care Instructions",
                "Product Specifications",
              ].map((section, index) => (
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
                      {section === "Delivery & Returns" ? (
                        <ul>
                          {product.Estimatedtimeleadforcustomization?.split(
                            /(?<=\w)\s(?=[A-Z])/
                          ).map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      ) : section === "Care Instructions" ? (
                        <ul>
                          {product.materialCareInstructions
                            .split("\n")
                            .map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                        </ul>
                      ) : section === "Product Specifications" ? (
                        <ul>
                          {product.productSpecificRecommendations
                            .split("\n")
                            .map((point, index) => (
                              <li key={index}>{point.trim()}</li>
                            ))}
                        </ul>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="brand-cursol">
              <BrandCursol brandId={product.brandId} />
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
                src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.images[selectedImageIndex]}`}
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
