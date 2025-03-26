import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";

export default function BrandCursol({ brandId }) {
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
          `https://tdg-db.onrender.com/api/products/getproducts/brand/${brandId._id}`
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

  return (
    <div className="carousel-container">
      {/* Contact Section */}
      <div className="carousel-contact-section">
        <a
          href="mailto:info@thedesigngrit.com?subject=Request a quotation"
          className="contact-link"
        >
          <IoNewspaperOutline /> Request a quotation
        </a>
        <hr className="carousel-divider" />
        <a href="tel:+390805543553" className="contact-link">
          <LuPhone /> Call us at +39 080 554 3553
        </a>
        <hr className="carousel-divider" />
        <a
          href="https://wa.me/393664455454"
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
                    transform: `rotateY(${rotation}deg) translateZ(200px)`,
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
                      ? `${product.price} E£`
                      : "Price Unavailable"}
                  </p>
                </div>
              );
            })}
          </div>
          {products.length > 1 && (
            <div className="carousel-navigation">
              <button className="carousel-button" onClick={prevSlide}>
                <HiOutlineChevronLeft />
              </button>
              <button className="carousel-button" onClick={nextSlide}>
                <HiOutlineChevronRight />
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="carousel-no-products">No products available</p>
      )}
    </div>
  );
}
