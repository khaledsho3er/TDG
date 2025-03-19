import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom"; // Navigation Hook
import "swiper/css";
import "swiper/css/navigation";

const VendorProductsCard = ({ products }) => {
  const navigate = useNavigate();

  return (
    <div className="vendor-related-products-container">
      <Swiper
        modules={[Navigation]}
        slidesPerView="auto"
        spaceBetween={20}
        navigation
        loop={true}
        className="vendor-related-swiper"
      >
        {products.map((product) => (
          <SwiperSlide
            key={product._id}
            className="vendor-swiper-slide"
            onClick={() => navigate(`/product/${product._id}`)} // Navigate on Click
          >
            <div className="vendor-related-product-card">
              <div className="vendor-related-product-image-container">
                <img
                  src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                  alt={product.title}
                  className="vendor-related-img"
                />
              </div>
              <div className="vendor-related-info">
                <h3 className="vendor-related-name">{product.title}</h3>
                <p className="vendor-related-price">{product.price} E£</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VendorProductsCard;
