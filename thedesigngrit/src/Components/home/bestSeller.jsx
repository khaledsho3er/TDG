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
  const swiperRef = useRef(null);
  const sliderContainerRef = useRef(null);

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

  // Handle wheel events for the entire slider container
  useEffect(() => {
    const handleWheel = (event) => {
      if (!swiperRef.current || !sliderContainerRef.current) return;

      const swiper = swiperRef.current;
      const { deltaX, deltaY } = event;

      // Determine if we should scroll horizontally or vertically
      const isHorizontalScroll = Math.abs(deltaX) > Math.abs(deltaY);
      const isAtBeginning = swiper.isBeginning;
      const isAtEnd = swiper.isEnd;

      // If scrolling horizontally or within the slider's bounds
      if (isHorizontalScroll || (!isAtBeginning && !isAtEnd)) {
        // Let the swiper handle horizontal scrolling
        swiper.mousewheel.handleMouseWheel(event);
        event.preventDefault();
      }
      // Otherwise, let the page scroll naturally (vertical scrolling)
    };

    const container = sliderContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="slider-container-home">
        <h1 className="slider-title">BEST SELLERS</h1>
        <div className="loading-placeholder" style={{ height: "400px" }} />
      </div>
    );
  }

  return (
    <div className="slider-container-home" ref={sliderContainerRef}>
      <h2 className="slider-title">BEST SELLERS</h2>

      <Swiper
        modules={[Navigation, Pagination, Keyboard, Mousewheel]}
        spaceBetween={isMobile ? 10 : 20}
        slidesPerView={visibleCount}
        navigation={!isMobile}
        pagination={isMobile ? { clickable: true } : false}
        keyboard={{ enabled: true }}
        mousewheel={{
          enabled: true,
          forceToAxis: true,
          sensitivity: 1,
          thresholdDelta: 50,
          thresholdTime: 300,
        }}
        grabCursor={true}
        loop={true}
        className="bestseller-swiper"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        // breakpoints={{
        //   // When window width is >= 0px (mobile)
        //   0: {
        //     slidesPerView: 1,
        //     spaceBetween: 10,
        //   },
        //   426: {
        //     slidesPerView: 2,
        //     spaceBetween: 10,
        //   },
        //   769: {
        //     slidesPerView: 3,
        //     spaceBetween: 20,
        //   },
        //   961: {
        //     slidesPerView: 3,
        //     spaceBetween: 30,
        //   },
        //   // When window width is >= 1024px (desktop)
        //   1024: {
        //     slidesPerView: 4,
        //     spaceBetween: 20,
        //   },
        //   1025: {
        //     slidesPerView: 5,
        //     spaceBetween: 20,
        //   },
        // }}
      >
        {products.map((product, index) => (
          <SwiperSlide key={product._id || index}>
            <div
              className="product-card-bestseller"
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

              <div className="related-info">
                <p className="related-category">{product?.brandName}</p>
                <h3 className="related-name">{product.name}</h3>
                {product.salePrice ? (
                  <>
                    <p
                      className="related-price"
                      style={{
                        textDecoration: "line-through",
                        color: "#999",
                      }}
                    >
                      {product.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      E£
                    </p>
                    <p
                      className="related-price"
                      style={{ color: "#e74c3c", fontWeight: "bold" }}
                    >
                      {product.salePrice.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      E£
                    </p>
                  </>
                ) : (
                  <p className="related-price">
                    {product.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    E£
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
