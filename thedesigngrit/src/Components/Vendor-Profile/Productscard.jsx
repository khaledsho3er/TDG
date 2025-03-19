import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
const VendorProductsCard = ({ _id, title, description, price, mainImage }) => {
  return (
    <div className="reviews-section" style={{ padding: "10px", width: "100%" }}>
      <div className="related-products-container">
        <Swiper
          modules={[Navigation]}
          slidesPerView={3}
          spaceBetween={20}
          navigation
          loop={true}
          className="related-swiper"
        >
          <SwiperSlide key={_id} style={{ width: "250px" }}>
            <div className="related-product-card">
              <div className="related-product-image-container">
                <img
                  src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${mainImage}`}
                  alt={title}
                  className="related-img"
                />
              </div>
              <div className="related-info">
                <h3 className="related-name">{title}</h3>
                <p className="related-price">{price} E£</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default VendorProductsCard;
