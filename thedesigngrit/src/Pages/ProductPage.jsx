import React, { useState, useEffect, useContext } from "react";
import { Box, Button, useMediaQuery } from "@mui/material";
import { FaStar, FaDownload } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import Header from "../Components/navBar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useParams, useNavigate } from "react-router-dom";
import ReviewBox from "../Components/reviewBox";
import RequestInfoPopup from "../Components/product/optionPopUp";
import Footer from "../Components/Footer";
import { useCart } from "../Context/cartcontext";
import LoadingScreen from "./loadingScreen";
import { UserContext } from "../utils/userContext";
import RelatedProducts from "../Components/relatedProducts";
import BrandCursol from "../Components/brandCursol";
import { BsExclamationOctagon } from "react-icons/bs";
import RequestQuote from "../Components/product/RequestInfo";

function ProductPage() {
  const [showRequestInfoPopup, setShowRequestInfoPopup] = useState(false); // State for Request Info Popup visibility
  const [isRequestInfoOpen] = useState(true);
  const { userSession } = useContext(UserContext);

  const isMobile = useMediaQuery("(max-width:768px)");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
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
  // Add this state near your other state declarations
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isRequestQuoteOpen, setIsRequestQuoteOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState(null);

  const handleRequestQuote = (productData) => {
    if (!userSession) {
      navigate("/login");
      return;
    }

    // Ensure we have the brand data
    let dataToPass = productData;

    // If productData doesn't have brandId as an object, use the product's brandId
    if (!productData.brandId || typeof productData.brandId !== "object") {
      dataToPass = {
        ...productData,
        brandId: product.brandId, // Use the main product's brandId
      };
    }

    setQuoteProduct(dataToPass);
    setIsRequestQuoteOpen(true);
  };

  const handleCloseRequestQuote = () => {
    setIsRequestQuoteOpen(false);
  };

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
        setActiveProduct(data); // Initialize active product with parent product
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
  }, [id, error, loading, activeProduct]); // Refetch if the ID in the URL changes

  // Add this useEffect to fetch variants when the product loads
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
  // Add this effect to update the selected variant when color/size changes
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
  // Modify your color and size selection handlers
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Reset size when color changes since size options might be different
    setSelectedSize(null);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Create a function to get available sizes for the selected color
  const getAvailableSizes = () => {
    if (!selectedColor || variants.length === 0) return product.sizes || [];

    const colorVariants = variants.filter(
      (variant) => variant.color.toLowerCase() === selectedColor.toLowerCase()
    );

    const uniqueSizes = [...new Set(colorVariants.map((v) => v.size))];
    return uniqueSizes.length > 0 ? uniqueSizes : product.sizes || [];
  };

  // Update your product display to use variant data when available
  // const displayProduct = selectedVariant || product;
  const displayImages = selectedVariant?.images || product.images;
  const displayTitle = selectedVariant?.title || product.name;
  const handleSectionToggle = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAddToCart = () => {
    // Determine if we're adding a variant or the main product
    if (selectedVariant) {
      // Adding a variant
      // Get the shipping fee safely
      let shippingFee = 0;
      if (
        product.brandId &&
        typeof product.brandId === "object" &&
        product.brandId.fees
      ) {
        shippingFee = product.brandId.fees;
      }

      addToCart({
        id: selectedVariant._id, // Variant ID as the main ID
        variantId: selectedVariant._id, // Same ID to identify it as a variant
        productId: product._id, // Parent product ID
        name: selectedVariant.title || product.name,
        unitPrice: selectedVariant.salePrice || selectedVariant.price || 0,
        quantity: 1,
        image: selectedVariant.images?.[0] || product.mainImage,
        brandId: product.brandId,
        color: selectedColor || "default",
        size: selectedSize || "default",
        code: selectedVariant.sku || product.sku || "N/A",
        shippingFee: shippingFee || 0,
      });
    } else {
      // Adding the main product
      let shippingFee = 0;
      if (
        product.brandId &&
        typeof product.brandId === "object" &&
        product.brandId.fees
      ) {
        shippingFee = product.brandId.fees;
      }

      addToCart({
        id: product._id,
        name: product.name,
        unitPrice: product.salePrice || product.price || 0,
        quantity: 1,
        image: product.mainImage,
        brandId: product.brandId,
        color: selectedColor || "default",
        size: selectedSize || "default",
        code: product.sku || "N/A",
        shippingFee: shippingFee || 0,
      });
    }
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

      <div className="product-container">
        <div className="grid-container">
          <div className="product-image-container">
            <img
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${
                selectedVariant?.images?.[0] || product.mainImage
              }`}
              alt={displayTitle}
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
            <h1 className="product-title">
              {selectedVariant ? selectedVariant.title : product.name}
            </h1>
            {selectedVariant && (
              <h3
                style={{
                  marginBottom: "8px",
                  fontWeight: "light",
                  color: "#ccc",
                }}
              >
                {product.name}
              </h3>
            )}
            <p className="product-brand">{product.brandId.brandName}</p>
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
            {/* Price Display */}
            <p className="product-price">
              {selectedVariant ? (
                // Show only variant pricing when a variant is selected
                selectedVariant.salePrice ? (
                  // Variant has sale price
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "gray",
                        marginRight: "8px",
                      }}
                    >
                      {selectedVariant.price > 1000
                        ? new Intl.NumberFormat("en-US").format(
                            selectedVariant.price
                          )
                        : selectedVariant.price}
                      .00 E£
                    </span>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {selectedVariant.salePrice > 1000
                        ? new Intl.NumberFormat("en-US").format(
                            selectedVariant.salePrice
                          )
                        : selectedVariant.salePrice}
                      .00 E£
                    </span>
                  </>
                ) : (
                  // Variant has only regular price
                  <>
                    {selectedVariant.price > 1000
                      ? new Intl.NumberFormat("en-US").format(
                          selectedVariant.price
                        )
                      : selectedVariant.price}
                    .00 E£
                  </>
                )
              ) : // Show parent product pricing when no variant is selected
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

            <hr />
            <div className="color-selector">
              <span className="color-selector-label">Color:</span>
              <div className="color-options">
                {product.colors && product.colors.length > 0 ? (
                  product.colors.map((color, index) => {
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
                      for (const [basicColor, hexValue] of Object.entries(
                        basicColorMap
                      )) {
                        if (lowerColor.includes(basicColor)) {
                          return hexValue;
                        }
                      }

                      // If no match found, use a neutral gray with the color name displayed
                      return "#CCCCCC";
                    };

                    // Get color value
                    const colorValue = extractColorValue(color);

                    // Check if color is light
                    const isLightColor =
                      colorValue === "#FFFFFF" ||
                      colorValue === "#F5F5DC" ||
                      colorValue === "#FFFDD0" ||
                      color.toLowerCase().includes("white") ||
                      color.toLowerCase().includes("cream") ||
                      color.toLowerCase().includes("beige") ||
                      color.toLowerCase().includes("ivory") ||
                      color.toLowerCase().includes("off white") ||
                      color.toLowerCase().includes("offwhite");

                    return (
                      <div
                        key={index}
                        className={`color-circle ${
                          selectedColor === color ? "selected" : ""
                        }`}
                        style={{
                          backgroundColor: colorValue,
                          border: isLightColor ? "1px solid #2d2d2d" : "none",
                          position: "relative",
                        }}
                        title={color}
                        onClick={() => handleColorSelect(color)}
                      >
                        {colorValue === "#CCCCCC" && (
                          <div className="color-name-overlay">
                            {color.charAt(0)}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p>
                    This product is only available in one color, so you don't
                    have to worry about choosing the perfect shade!
                  </p>
                )}
              </div>
            </div>
            {selectedColor && (
              <p className="selected-color-text">
                Selected Color: {selectedColor}
              </p>
            )}
            <hr />
            <div className="size-selector">
              <span className="size-selector-label">Size:</span>
              <div className="size-options">
                {getAvailableSizes().map((size, index) => (
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
                          <strong>
                            {selectedVariant
                              ? selectedVariant.dimensions.width
                              : product.technicalDimensions.width}
                          </strong>{" "}
                          cm x{"  "}
                          <strong>
                            {" "}
                            {selectedVariant
                              ? selectedVariant.dimensions.length
                              : product.technicalDimensions.length}
                          </strong>{" "}
                          cm X{"  "}
                          <strong>
                            {selectedVariant
                              ? selectedVariant.dimensions.height
                              : product.technicalDimensions.height}
                          </strong>{" "}
                          cm
                        </p>
                        <p>
                          Weight :{" "}
                          <strong>
                            {selectedVariant
                              ? selectedVariant.dimensions.weight
                              : product.technicalDimensions.weight}
                          </strong>{" "}
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
              <BrandCursol
                brandId={product.brandId}
                onRequestQuote={handleRequestQuote}
                mainProductId={product._id} // Pass the main product ID
              />
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
                  style={{
                    backgroundColor: hover ? "transparent" : "transparent",
                  }}
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
      {isRequestQuoteOpen && (
        <RequestQuote
          onClose={handleCloseRequestQuote}
          productId={quoteProduct}
        />
      )}
    </div>
  );
}

export default ProductPage;
