import React, { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";

import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";

export default function BrandCursol({ brandId }) {
  const [products, setProducts] = useState([]);
  console.log(" brand caursol brandId:", brandId._id);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (!brandId) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://tdg-db.onrender.com/api/products/getproducts/brand/${brandId._id}`
        );
        const data = await response.json();
        setProducts(data.products);
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
    // carsoul in product page
    <div className="carousel-container">
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
      <div className="carousel">
        {products.length > 0 ? (
          <div className="carousel-wrapper">
            {products.map((product, index) => (
              <div
                key={product._id}
                className={`carousel-item ${
                  index === currentIndex ? "active" : ""
                }`}
              >
                <img
                  src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                  alt={product.name}
                  className="carousel-product-image"
                />
                <div className="carousel-product-info">
                  <h3 className="carousel-product-name">{product.name}</h3>
                  <p className="carousel-product-price">{product.price}E£</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading products...</p>
        )}
        {products.length > 1 && (
          <>
            <button className="carousel-button left" onClick={prevSlide}>
              <HiOutlineChevronLeft color="#2d2d2d" />
            </button>
            <button className="carousel-button right" onClick={nextSlide}>
              <HiOutlineChevronRight color="#2d2d2d" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
