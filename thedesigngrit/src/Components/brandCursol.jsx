import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";
import { Box } from "@mui/material";

export default function BrandCursol({
  brandId,
  onRequestQuote,
  mainProductId,
}) {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!brandId || !brandId._id) {
      console.warn("Invalid brandId:", brandId);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/products/getproducts/brand/${brandId._id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.slice(0, 3)); // Limit to 3 products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [brandId]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const handleRequestQuote = () => {
    // Always use the main product ID from the product page
    if (mainProductId) {
      // Create a product object with the main product ID and brand data
      const productData = {
        _id: mainProductId,
        brandId: brandId,
      };
      onRequestQuote(productData);
    } else {
      // Fallback to using the carousel product if main product ID is not available
      if (products.length > 0 && products[currentIndex]) {
        const currentProduct = products[currentIndex];
        const productWithBrand = {
          ...currentProduct,
          brandId: currentProduct.brandId || brandId,
        };
        onRequestQuote(productWithBrand);
      } else {
        // If no products, just use the brandId
        onRequestQuote(brandId);
      }
    }
  };

  return (
    <div className="carousel-container">
      {/* Contact Section */}
      <div className="carousel-contact-section">
        <button
          onClick={handleRequestQuote}
          className="contact-link"
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            fontFamily: "montserrat",
            fontSize: "14px",
          }}
        >
          <IoNewspaperOutline /> Request a quotation
        </button>

        <hr className="carousel-divider" />
        <a href={`tel:${brandId.phoneNumber}`} className="contact-link">
          <LuPhone /> Call us at {brandId.phoneNumber}
        </a>
        <hr className="carousel-divider" />
        <a
          href={`whatsapp://send?text=Hello, I would like to order a product from your brand. Please contact me at ${brandId.phoneNumber}&phone=+393664455454`}
          className="contact-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp /> Write to us or order on Whatsapp
        </a>
      </div>

      {/* Carousel */}
      {Array.isArray(products) && products.length > 0 ? (
        <div className="carousel-wrapper">
          <div className="carousel-3d">
            {products.map((product, index) => {
              const position =
                (index - currentIndex + products.length) % products.length;
              const rotation = position * 120; // 360 degrees / 3 items = 120 degrees per item
              const isCenter = position === 0;

              return (
                <div
                  key={product._id}
                  className="carousel-item"
                  style={{
                    transform: `rotateY(${rotation}deg) translateZ(${
                      window.innerWidth <= 767 ? 153 : 200
                    }px)`,
                    opacity: isCenter ? 1 : 0.3,
                    filter: isCenter ? "blur(0)" : "blur(4px)",
                    zIndex: isCenter ? 3 : 1,
                    scale: isCenter ? "1" : "0.8",
                  }}
                >
                  <img
                    src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                    alt={product.name || "Product"}
                    className="carousel-product-image"
                  />
                  <h3 className="carousel-product-name">{product.name}</h3>
                  <p className="carousel-product-price">
                    {product.price
                      ? `${product.price.toLocaleString()} E£`
                      : "Price Unavailable"}
                  </p>
                </div>
              );
            })}
          </div>
          {products.length > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <button className="carousel-button left" onClick={prevSlide}>
                <HiOutlineChevronLeft
                  style={{
                    position: "relative",
                    left: "50%",
                    transform: "translate(-50%, 0%)",
                    top: "calc(50% - 10px)",
                  }}
                />
              </button>
              <button className="carousel-button right" onClick={nextSlide}>
                <HiOutlineChevronRight
                  style={{
                    position: "relative",
                    left: "50%",
                    transform: "translate(-50%, 0%)",
                    top: "calc(50% - 10px)",
                  }}
                />
              </button>
            </Box>
          )}
        </div>
      ) : (
        <p className="carousel-no-products">No products available</p>
      )}
    </div>
  );
}
