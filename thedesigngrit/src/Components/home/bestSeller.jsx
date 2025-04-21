import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(5); // Start from first real slide
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const visibleCount = 5;

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await axios.get(
          "https://tdg-db.onrender.com/api/orders/bestsellers"
        );
        const data = response.data;
        if (data.length > 0) {
          const clonedStart = data.slice(-visibleCount);
          const clonedEnd = data.slice(0, visibleCount);
          const fullSlides = [...clonedStart, ...data, ...clonedEnd];
          setProducts(fullSlides);
          console.log("bestsellers: ", data);
        }
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
      }
    };

    fetchBestSellers();
  }, []);

  const slideTo = (index) => {
    setTransitionEnabled(true);
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    slideTo(currentIndex + 1);
  };

  const prevSlide = () => {
    slideTo(currentIndex - 1);
  };

  // Loop jump logic
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
  }, [currentIndex, products]);

  const getSlideStyle = () => ({
    transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
    transition: transitionEnabled ? "transform 0.3s ease-in-out" : "none",
    display: "flex",
  });

  return (
    <div className="slider-container-home">
      <h1 className="slider-title">BEST SELLERS</h1>

      <div className="slider-wrapper" style={{ overflow: "hidden" }}>
        <div className="slider-content" style={getSlideStyle()} ref={sliderRef}>
          {products.map((product, index) => (
            <div
              key={index}
              className="product-card"
              style={{
                width: `${100 / products.length}%`,
                flexShrink: 0,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="product-image-home" style={{ width: "100%" }}>
                <img
                  src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                  alt={product.name}
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
