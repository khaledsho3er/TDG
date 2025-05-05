import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(5);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const visibleCount =
    window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 3 : 5;
  //khaled cimit
  const fetchBestSellers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://api.thedesigngrit.com/api/orders/bestsellers"
      );
      const data = response.data;
      if (data.length > 0) {
        const clonedStart = data.slice(-visibleCount);
        const clonedEnd = data.slice(0, visibleCount);
        const fullSlides = [...clonedStart, ...data, ...clonedEnd];
        setProducts(fullSlides);
      }
    } catch (error) {
      console.error("Error fetching bestsellers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [visibleCount]);

  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

  const slideTo = useCallback((index) => {
    setTransitionEnabled(true);
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    slideTo(currentIndex + 1);
  }, [currentIndex, slideTo]);

  const prevSlide = useCallback(() => {
    slideTo(currentIndex - 1);
  }, [currentIndex, slideTo]);

  useEffect(() => {
    if (products.length === 0) return;

    const totalLength = products.length;
    const realLength = totalLength - visibleCount * 2;

    if (currentIndex === totalLength - visibleCount) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(visibleCount);
      }, 300);
    }

    if (currentIndex === 0) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentIndex(realLength);
      }, 300);
    }
  }, [currentIndex, products, visibleCount]);

  const getSlideStyle = () => ({
    transform: `translateX(-${currentIndex * (100 / visibleCount) + 18}%)`,
    transition: transitionEnabled ? "transform 0.3s ease-in-out" : "none",
    display: "flex",
  });

  if (isLoading) {
    return (
      <div className="slider-container-home">
        <h1 className="slider-title">BEST SELLERS</h1>
        <div className="loading-placeholder" style={{ height: "400px" }} />
      </div>
    );
  }

  return (
    <div className="slider-container-home">
      <h2 className="slider-title">BEST SELLERS</h2>

      <div className="slider-wrapper" style={{ overflow: "hidden" }}>
        <div className="slider-content" style={getSlideStyle()} ref={sliderRef}>
          {products.map((product, index) => (
            <div
              key={index}
              className="product-card"
              style={{
                width: `${100 / visibleCount}%`,
                flexShrink: 0,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="product-image-home" style={{ width: "100%" }}>
                <img
                  src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}?width=250&height=200&format=webp`}
                  alt={product.name}
                  loading={index < visibleCount ? "eager" : "lazy"}
                  width="300"
                  height="200"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="product-info" style={{ padding: "10px" }}>
                <h3 className="product-title-bestseller">{product.name}</h3>
                <div className="product-price-bestseller">
                  {product.salePrice != null ? (
                    <span>
                      <span
                        style={{
                          textDecoration: "line-through",
                          marginRight: "5px",
                        }}
                      >
                        {product.price} E£
                      </span>
                      <br />
                      <span style={{ color: "red" }}>
                        {product.salePrice} E£
                      </span>
                    </span>
                  ) : (
                    <span>{product.price} E£</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="slider-controls-home" style={{ marginTop: "20px" }}>
        <div className="arrows-home">
          <button
            className="arrow-home prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            className="arrow-home next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
