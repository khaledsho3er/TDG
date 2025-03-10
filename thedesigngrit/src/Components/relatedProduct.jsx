import React, { useState } from "react";

const RelatedProducts = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const products = [
    {
      image: "/Assets/bestseller/product1.webp",
      badge: "Badge",
      minUnits: 250,
      delivery: "2 weeks",
      title: "Product title",
      price: 49.0,
    },
    {
      image: "/Assets/bestseller/product2.webp",
      badge: "Badge",
      minUnits: 250,
      delivery: "2 weeks",
      title: "Product title",
      price: 49.0,
    },
    {
      image: "/Assets/bestseller/product3.webp",
      badge: "Badge",
      minUnits: 250,
      delivery: "2 weeks",
      title: "Product title",
      price: 49.0,
    },
    {
      image: "/Assets/bestseller/product4.webp",
      badge: "Badge",
      minUnits: 250,
      delivery: "2 weeks",
      title: "Product title",
      price: 49.0,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  return (
    <div className="slider-container">
      <h1 className="slider-title">Related Products</h1>

      <div className="slider-content">
        {products.map((product, index) => (
          <div
            key={index}
            className="product-card"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            <div className="product-image">
              <img src={product.image} alt={product.title} />
            </div>

            <div className="product-info">
              <span className="badge">{product.badge}</span>
              <div className="product-metadata">
                Min. {product.minUnits} units · Delivery: {product.delivery}
              </div>
              <h3 className="product-title">{product.title}</h3>
              <div className="product-price">
                from LE {product.price.toFixed(2)} per unit
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-controls">
        <div className="dots">
          {products.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <div className="arrows">
          <button className="arrow prev" onClick={prevSlide}>
            ←
          </button>
          <button className="arrow next" onClick={nextSlide}>
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
