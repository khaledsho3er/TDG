import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoNewspaperOutline } from "react-icons/io5";
import { LuPhone } from "react-icons/lu";

import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";

const products = [
  {
    name: "Sofa",
    price: "LE 49.00",
    image: "/Assets/seatersofa.webp",
  },
  {
    name: "Chair",
    price: "LE 49.00",
    image: "/Assets/sofabrown.webp",
  },
  {
    name: "Couch",
    price: "LE 49.00",
    image: "/Assets/prodImg1.webp",
  },
];

export default function BrandCursol() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  return (
    // carsoul in product page
    <div className="carousel-container">
      <div className="carousel-header">
        <img src="/Assets/PartnersLogos/istikbal.webp" />
      </div>
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
        <div className="carousel-wrapper">
          {products.map((product, index) => (
            <div
              key={index}
              className={`carousel-item ${
                index === currentIndex ? "active" : ""
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="carousel-product-info">
                <h3 className="carousel-product-name">{product.name}</h3>
                <p className="carousel-product-price">{product.price}E£</p>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-button left" onClick={prevSlide}>
          <HiOutlineChevronLeft color="#2d2d2d" />
        </button>
        <button className="carousel-button right" onClick={nextSlide}>
          <HiOutlineChevronRight color="#2d2d2d" />
        </button>
      </div>
    </div>
  );
}
