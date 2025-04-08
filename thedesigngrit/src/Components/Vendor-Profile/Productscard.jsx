import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; //
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const VendorProductsCard = ({ vendor, products }) => {
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://tdg-db.onrender.com/api/categories/categories/"
        );
        const data = await response.json();
        setCategories(data); // Store all categories
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
          // Find category name based on product's cateory
          const category = categories.find(
            (cat) => cat._id === product.categoryId
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
                    />
                  </div>
                  <div className="related-info">
                    <p className="related-category">{categoryName}</p>
                    <h3 className="related-name">{product.name}</h3>
                    <p className="related-price">{product.price} E£</p>
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
