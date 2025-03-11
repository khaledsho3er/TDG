import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const RelatedProducts = ({ productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [productId]);

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(
        `https://tdg-db.onrender.com/api/products/related/${productId}`
      );
      setRelatedProducts(response.data);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        padding: "20px",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h2
        style={{ textAlign: "center", color: "#2d2d2d", marginBottom: "20px" }}
      >
        Related Products
      </h2>

      <Swiper
        modules={[Navigation]}
        slidesPerView={3}
        spaceBetween={15}
        navigation={{ nextEl: ".next", prevEl: ".prev" }}
        loop={true}
      >
        {relatedProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                textAlign: "center",
                backgroundColor: "#fff",
                padding: "10px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={product.mainImage}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
              <h4 style={{ margin: "10px 0", fontSize: "16px", color: "#333" }}>
                {product.name}
              </h4>
              <p style={{ fontWeight: "bold", color: "#6a8452" }}>
                ${product.price}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        className="prev"
        style={{
          position: "absolute",
          top: "50%",
          left: "-40px",
          transform: "translateY(-50%)",
          background: "#6a8452",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          padding: "10px",
          cursor: "pointer",
          zIndex: "10",
        }}
      >
        <FaArrowLeft size={20} />
      </button>

      <button
        className="next"
        style={{
          position: "absolute",
          top: "50%",
          right: "-40px",
          transform: "translateY(-50%)",
          background: "#6a8452",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          padding: "10px",
          cursor: "pointer",
          zIndex: "10",
        }}
      >
        <FaArrowRight size={20} />
      </button>
    </div>
  );
};

export default RelatedProducts;
