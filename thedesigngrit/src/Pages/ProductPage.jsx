import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { FaFile } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import Header from "../Components/navBar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useParams } from "react-router-dom";
import ReviewBox from "../Components/reviewBox";
import RequestInfoPopup from "../Components/product/optionPopUp";
import Footer from "../Components/Footer";
import { useCart } from "../Context/cartcontext";

function ProductPage() {
  // const [setShowDropdown] = useState(false);
  // //const [showPopup, setShowPopup] = useState(false);
  // const [showViewInStorePopup, setShowViewInStorePopup] = useState(false); // State for ViewInStorePopup
  // const [setShowFirstPopup] = useState(false); // State for Request Quote popup
  const [showRequestInfoPopup, setShowRequestInfoPopup] = useState(false); // State for Request Info Popup visibility
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(true);

  const handleCloseRequestInfo = () => {
    setIsRequestInfoOpen(false);
  };
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
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true); // Loading state for when the product is being fetched
  const [error, setError] = useState(null); // State for handling errors

  // Handle opening the popup
  // const handlePopupOpen = () => {
  //   setShowPopup(true);
  // };

  // Handle closing the popup
  // const handlePopupClose = () => {
  //   setShowPopup(false);
  // };
  // Fetch product details by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(
          `http://localhost:5000/api/products/getsingle/${id}`
        ); // Make an API call to fetch the product by ID
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data); // Set the fetched product to state
        setReviews(data.reviews); // Set the fetched reviews to state
        console.log(error);
      } catch (error) {
        setError(error.message); // Set error if something goes wrong
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    };

    fetchProduct(); // Fetch product on component mount
  }, [id, error, loading]); // Refetch if the ID in the URL changes

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
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };
  const handleSectionToggle = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAddToCart = (product) => {
    // const compositeKey = `${product.id} -  ${selectedColor || "default"}-${
    //   selectedSize || "default"
    // }`;
    // console.log("Composite Key:", compositeKey); // Debug log

    addToCart({
      id: product._id, // Use composite key as the unique identifier
      name: product.name,
      unitPrice: product.price,
      quantity: 1,
      image: product.image,
      brandId: product.brandId,
      color: selectedColor || "default",
      size: selectedSize || "default",
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
              src={`http://localhost:5000/uploads/${product.mainImage}`}
              alt={product.name}
              className="product-main-image"
              onClick={() => handleImageClick(0)} // Main image click opens modal
            />
            <div className="thumbnail-container">
              {product.images?.length ? (
                product.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/uploads/${image}`}
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
            <p className="product-rating">
              {product.reviewsCount > 0 ? (
                <>
                  {"★".repeat(product.rating)} ({product.reviewsCount} reviews)
                </>
              ) : (
                <span>No reviews yet</span>
              )}
            </p>
            <p className="product-price">
              {product.price > 1000
                ? new Intl.NumberFormat("en-US").format(product.price)
                : product.price}
              .00 E£
            </p>
            <hr />
            <div className="color-selector">
              <span className="color-selector-label">Color:</span>
              <div className="color-options">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="color-circle"
                    style={{ backgroundColor: color }}
                    title={color.name}
                    onClick={() => handleColorSelect(color.name)}
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
                open={showRequestInfoPopup} // Pass showRequestInfoPopup as open prop
                onClose={() => setShowRequestInfoPopup(false)} // Handle close callback
                onOptionSelect={handleCloseRequestInfo}
              />
            )}
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
                      <div className="product-contents">
                        <h5 style={{ fontSize: "25px", marginLeft: "0px" }}>
                          Manufacturer :{product.brandName}
                        </h5>
                        <div className="product-details">
                          <p style={{ fontSize: "20px" }}>
                            <span className="label">Collection:</span>{" "}
                            {product.collection}
                          </p>
                          {/* <p style={{ fontSize: "20px" }}>
                            <span className="label">Type:</span> 2 Seater Fabric
                            Sofa
                          </p> */}
                          <p style={{ fontSize: "20px" }}>
                            <span className="label">Manufacturer Year:</span>{" "}
                            {product.manufactureYear}
                          </p>
                        </div>

                        <p style={{ fontSize: "20px" }}>
                          {product.description}
                        </p>
                      </div>
                    )}
                    {section === "Dimensions" && (
                      <div className="product-contents">
                        <img src="/Assets/productDemi.png" alt="Dimensions" />
                        <p>Width X Length X Height</p>
                        <p>
                          {product.technicalDimensions.width} x{"  "}
                          {product.technicalDimensions.length} X{"  "}
                          {product.technicalDimensions.height}
                        </p>
                        <p>Weight:{product.technicalDimensions.weight}</p>
                      </div>
                    )}
                    {section === "BIM/CAD" && (
                      <div className="product-contents">
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
                      </div>
                    )}
                    {section === "Videos" && (
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
                    )}
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

        {(isModalOpen || isTransitioning) && (
          <div className={`modal ${isTransitioning ? "opening" : "closing"}`}>
            <div className="modal-content">
              <button className="modal-close" onClick={handleCloseModal}>
                <IoMdClose size={30} />
              </button>
              <button className="modal-prev" onClick={handlePrevImage}>
                <IoIosArrowBack size={30} />
              </button>
              <img
                src={`http://localhost:5000/uploads/${product.images[selectedImageIndex]}`}
                alt={`${selectedImageIndex + 1}`}
                className="modal-image"
              />
              <button className="modal-next" onClick={handleNextImage}>
                <IoIosArrowForward size={30} />
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
