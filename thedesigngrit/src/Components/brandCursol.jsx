import React, { useState, useEffect } from "react";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";

export default function BrandCursol({ brandId }) {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!brandId || !brandId._id) return;
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://tdg-db.onrender.com/api/products/getproducts/brand/${brandId._id}`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setProducts(data.slice(0, 5)); // Limit to 5 products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [brandId]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
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
                {product.price ? `${product.price} E£` : "Price Unavailable"}
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
  );
}
