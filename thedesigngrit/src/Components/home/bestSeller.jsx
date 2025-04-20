import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(
          "https://tdg-db.onrender.com/api/orders/bestsellers"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
      }
    };

    fetchBestSellers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval); // Clear on unmount
  }, [products, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  return (
    <div className="slider-container-home">
      <h1 className="slider-title">BEST SELLERS</h1>

      <div className="slider-wrapper">
        <div
          className="slider-track"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${products.length * 100}%`,
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="product-image-home">
                <img
                  src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                  alt={product.name}
                />
              </div>

              <div className="product-info">
                <h3 className="product-title-bestseller">{product.name}</h3>
                <div className="product-price-bestseller">
                  {product.salePrice ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          marginRight: "5px",
                        }}
                      >
                        {product.price} E£
                      </span>
                      <span style={{ color: "red" }}>
                        {product.salePrice} E£
                      </span>
                    </>
                  ) : (
                    `${product.price} E£`
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="slider-controls-home">
        <div className="dots">
          {products.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <div className="arrows-home">
          <button className="arrow-home prev" onClick={prevSlide}>
            ←
          </button>
          <button className="arrow-home next" onClick={nextSlide}>
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
