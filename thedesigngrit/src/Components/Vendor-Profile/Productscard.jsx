import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const VendorProductsCard = ({ vendor, products }) => {
  const [categories, setCategories] = useState([]);

  // Fetch all categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://tdg-db.onrender.com/api/categories/categories/"
        );
        const data = await response.json();
        setCategories(data); // Save all categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      className="related-products-container"
      style={{ padding: "49px 110px" }}
    >
      <Swiper
        modules={[Navigation]}
        slidesPerView={3}
        spaceBetween={20}
        navigation
        loop={true}
        className="related-swiper"
      >
        {products.map((product) => {
          const category = categories.find(
            (cat) => cat._id === product.category
          );
          const categoryName = category ? category.name : "Unknown Category";

          return (
            <SwiperSlide key={product._id}>
              <Link
                to={`/product/${product._id}`}
                className="related-product-card"
              >
                <div className="related-product-card">
                  <div className="related-product-image-container">
                    <img
                      src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                      alt={product.name}
                      className="related-img"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                  <div className="related-info" style={{ marginTop: "10px" }}>
                    <p
                      className="related-category"
                      style={{
                        fontSize: "14px",
                        color: "#888",
                        marginBottom: "4px",
                      }}
                    >
                      {categoryName}
                    </p>
                    <h3
                      className="related-name"
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginBottom: "4px",
                        color: "#222",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="related-price"
                      style={{ fontSize: "15px", color: "#e91e63" }}
                    >
                      {product.price} E£
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default VendorProductsCard;
