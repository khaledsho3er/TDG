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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  return (
    <div className="slider-container-home">
      <h1 className="slider-title">BEST SELLERS</h1>

      <div
        className="slider-content"
        style={{
          width: products.length === 1 ? "1000px" : "100%",
          justifyContent: products.length > 3 ? "center" : "flex-start",
        }}
      >
        {products.map((product, index) => (
          <div
            key={product._id}
            className="product-card"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/product/${product._id}`)} // Navigate on click
          >
            <div className="product-image-home" style={{ width: "348px" }}>
              <img
                src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                alt={product.name}
              />
            </div>

            <div className="product-info" style={{ width: "245px" }}>
              <h3 className="product-title-bestseller">{product.name}</h3>
              <div className="product-price-bestseller">
                {product.salePrice ? (
                  <span
                    style={{
                      textDecoration: "line-through",
                      marginRight: "5px",
                    }}
                  >
                    {product.price} E£
                  </span>
                ) : (
                  product.price
                )}
                {product.salePrice && (
                  <span style={{ color: "red" }}>{product.salePrice}E£</span>
                )}{" "}
              </div>
            </div>
          </div>
        ))}
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
