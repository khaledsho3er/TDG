import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  const visibleCount = isMobile ? 1 : isTablet ? 3 : 5;

  const fetchBestSellers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://api.thedesigngrit.com/api/orders/bestsellers"
      );
      const data = response.data;
      setProducts(data);
    } catch (error) {
      console.error("Error fetching bestsellers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

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

      <Swiper
        modules={[Navigation, Pagination, Keyboard, Mousewheel]}
        spaceBetween={isMobile ? 10 : 20}
        slidesPerView={visibleCount}
        navigation={!isMobile}
        pagination={isMobile ? { clickable: true } : false}
        keyboard={{ enabled: true }}
        mousewheel={true}
        grabCursor={true}
        loop={true}
        className="bestseller-swiper"
        breakpoints={{
          // When window width is >= 0px (mobile)
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          // When window width is >= 768px (tablet)
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          // When window width is >= 1024px (desktop)
          1024: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
      >
        {products.map((product, index) => (
          <SwiperSlide key={product._id || index}>
            <div
              className="product-card"
              style={{
                cursor: "pointer",
              }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="product-image-home">
                <img
                  src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}?width=250&height=200&format=webp`}
                  alt={product.name}
                  loading={index < visibleCount ? "eager" : "lazy"}
                  width="300"
                  height="200"
                />
              </div>

              <div className="product-info">
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
