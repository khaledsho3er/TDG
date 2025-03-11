import { useState } from "react";
import { FaPhone, FaQuoteRight, FaWhatsapp } from "react-icons/fa";
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
    <div className="carousel-container">
      <div className="carousel-contact-section">
        <button className="contact-button">
          <FaQuoteRight /> Request a quotation
        </button>
        <button className="carousel-contact-button">
          <FaPhone /> Call us at +39 080 554 3553
        </button>
        <button className="carousel-contact-button">
          <FaWhatsapp /> Write to us or order on Whatsapp
        </button>
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
                <p className="carousel-product-details">
                  Min. 250 units · Delivery: 2 weeks
                </p>
                <h3 className="carousel-product-name">{product.name}</h3>
                <p className="carousel-product-price">
                  from {product.price} per unit
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-button left" onClick={prevSlide}>
          <ChevronLeft />
        </button>
        <button className="carousel-button right" onClick={nextSlide}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
