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
        console.log(`Fetching products for brandId: ${brandId._id}`);
        const response = await fetch(
          `https://tdg-db.onrender.com/api/products/getproducts/brand/${brandId._id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched API response:", data);
        setProducts(data.slice(0, 5));
        // if (data.products && Array.isArray(data.products)) {
        //   setProducts(data.slice(0, 5)); // Limit to 5 products
        // } else {
        //   console.error("Invalid products structure:", data);
        //   setProducts([]); // Reset state in case of incorrect response
        // }
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
        <div className="carousel-container">
          <div className="carousel-wrapper">
            {products.map((product, index) => {
              const offset = (index - currentIndex) * 40; // Controls spacing and depth
              return (
                <div
                  key={product._id}
                  className="carousel-item"
                  style={{
                    transform: `perspective(1000px) rotateY(${offset}deg) translateZ(${
                      -Math.abs(offset) * 3
                    }px)`,
                    opacity: Math.abs(index - currentIndex) < 2 ? 1 : 0.3,
                  }}
                >
                  <img
                    src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                    alt={product.name || "Product"}
                    className="carousel-product-image"
                  />
                  <h3>{product.name}</h3>
                  <p>
                    {product.price
                      ? `${product.price} E£`
                      : "Price Unavailable"}
                  </p>
                </div>
              );
            })}
          </div>
          {products.length > 1 && (
            <>
              <button className="carousel-button left" onClick={prevSlide}>
                <HiOutlineChevronLeft />
              </button>
              <button className="carousel-button right" onClick={nextSlide}>
                <HiOutlineChevronRight />
              </button>
            </>
          )}
        </div>
      ) : (
        <p className="carousel-no-products">No products available</p>
      )}
    </div>
  );
}
