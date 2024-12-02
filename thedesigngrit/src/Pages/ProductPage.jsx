import React, { useState } from "react";
import Header from "../Components/navBar";
import { AiOutlineFileSearch } from "react-icons/ai";
import { FaFile } from "react-icons/fa";
import { Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ProductPage() {
  const { id } = useParams(); // Retrieve the product ID from the URL

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [expandedSections, setExpandedSections] = React.useState({
    0: true, // Overview (index 0) open by default
    1: true, // Dimensions (index 1) open by default
  });
  const sizes = ["1.5 M", "2 M", "3 M"];
  const colors = [
    { name: "Blue", hex: "#4c769d" },
    { name: "Grey", hex: "#a1a1a1" },
    { name: "ٌOrange", hex: "#d94c23" },
    { name: "Sage", hex: "#6b8d62" },
  ];

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
      <div>
        {/* Product Overview Section */}
        <div className="grid-container">
          {/* Product Image and Thumbnails */}
          <div className="product-image-container">
            <img
              src="Assets/sofabrown.jpg"
              alt="Seater Fabric Sofa"
              className="product-main-image"
            />
            <div className="thumbnail-container">
              {[1, 2, 3, 4].map((_, index) => (
                <img
                  key={index}
                  src={`Assets/seatersofa.png`}
                  alt={`Thumbnail ${index + 1}`}
                  className="thumbnail-image"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <h1 className="product-title">Seater Fabric Sofa</h1>
            <p className="product-brand">Istikbal</p>
            <p className="product-rating">★★★★☆ (22 reviews)</p>
            <p className="product-price">32,000 E£</p>
            <hr />
            <div className="color-selector">
              <span className="color-selector-label">Color:</span>
              <br />
              <br />
              <div className="color-options">
                {colors.map((color, index) => (
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
              <p
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "14px",
                  color: "#2d2d2d",
                }}
              >
                Selected Color: <b>{selectedColor}</b>
              </p>
            )}{" "}
            <br></br>
            <hr />
            {/* Size Selector */}
            <span className="size-selector-label">Size:</span>
            <div className="size-selector">
              <br />
              <br />
              <div className="size-options">
                {sizes.map((size, index) => (
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
              <p
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "14px",
                  color: "#2d2d2d",
                }}
              >
                Selected Size: <b>{selectedSize}</b>
              </p>
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
                        <img src="Assets/productDemi.png" />
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
              <h1 className="material-collapsible-title">LOCALLY MADE</h1>
              <p className="material-collapsible-description">
                France: Recycled wool, Portugal: External sole, laces,
                packaging, Spain: Inner sole, Handcrafted in Egypt.
              </p>

              <div className="material-collapsible-box">
                {sectionsMaterial.map((section, index) => (
                  <div key={index} className="material-collapsible-section">
                    <div
                      className="material-collapsible-header"
                      onClick={() => handleToggle(index)}
                    >
                      <span>{section}</span>
                      <span className="material-collapsible-icon">
                        {expandedSections[index] ? "-" : "+"}
                      </span>
                    </div>
                    {expandedSectionsMaterial[index] && (
                      <div className="material-collapsible-content">
                        Content for {section} goes here...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr />

        {/* Reviews Section
        <div className="reviews-section">
          <h2>Reviews</h2>
          {[1, 2, 3].map((review, index) => (
            <div key={index} className="review-card">
              <h3 className="review-title">Reviewer Name</h3>
              <p className="review-rating">★★★★☆ - Great Value</p>
              <p className="review-text">
                "This is the review text. The product is great, and I would
                recommend it to anyone."
              </p>
            </div>
          ))}
        </div>

        <hr />

        {/* Related Products Section 
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="grid-container">
            {[1, 2, 3, 4].map((product, index) => (
              <div key={index} className="related-product-card">
                <img
                  src={`/path/to/product-${index + 1}.jpg`}
                  alt={`Product ${index + 1}`}
                  className="related-product-image"
                />
                <h4 className="related-product-title">Product Name</h4>
                <p className="related-product-price">$Price</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default ProductPage;
