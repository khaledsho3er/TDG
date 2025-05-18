import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Keyboard,
  Mousewheel,
  EffectCoverflow,
} from "swiper/modules";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const swiperRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // Scroll animation values
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -50]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 1],
    [0, 1, 1, 0.8]
  );
  const scale = useTransform(scrollYProgress, [0, 0.2, 1], [0.8, 1, 1.05]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

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

  // Card hover animation variants
  const cardVariants = {
    hover: {
      y: -15,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  // Staggered children animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="slider-container-home">
        <h1 className="slider-title">BEST SELLERS</h1>
        <div className="loading-placeholder" style={{ height: "400px" }} />
      </div>
    );
  }

  return (
    <motion.div
      ref={sectionRef}
      className="slider-container-home"
      style={{
        opacity: springOpacity,
        scale: springScale,
        y: springY,
      }}
    >
      <motion.h2
        className="slider-title"
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        BEST SELLERS
      </motion.h2>

      <motion.div
        ref={sliderContainerRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        <Swiper
          modules={[
            Navigation,
            Pagination,
            Keyboard,
            Mousewheel,
            EffectCoverflow,
          ]}
          effect={isMobile ? "coverflow" : "slide"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          spaceBetween={isMobile ? 10 : 20}
          slidesPerView={visibleCount}
          navigation={!isMobile}
          pagination={{
            clickable: true,
            el: ".bestseller-pagination",
            type: "bullets",
          }}
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
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 10,
              effect: "coverflow",
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 15,
              effect: "slide",
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
              effect: "slide",
            },
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={product._id || index}>
              <motion.div
                className="product-card"
                variants={itemVariants}
                whileHover="hover"
                style={{
                  cursor: "pointer",
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <motion.div
                  className="product-image-home"
                  whileHover={{
                    rotateY: [-2, 2, -2],
                    rotateX: [2, -2, 2],
                    transition: {
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "mirror",
                    },
                  }}
                >
                  <img
                    src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}?width=250&height=200&format=webp`}
                    alt={product.name}
                    loading={index < visibleCount ? "eager" : "lazy"}
                    width="300"
                    height="200"
                  />
                </motion.div>

                <motion.div
                  className="product-info-bestseller"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
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
                        <motion.span
                          style={{ color: "red" }}
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut",
                          }}
                        >
                          {product.salePrice} E£
                        </motion.span>
                      </span>
                    ) : (
                      <span>{product.price} E£</span>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom pagination and navigation container */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            flexDirection: isMobile ? "row-reverse" : "row",
          }}
        >
          <div
            className="bestseller-pagination"
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          ></div>

          {!isMobile && (
            <div style={{ display: "flex", gap: "10px" }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => swiperRef.current?.slidePrev()}
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                ←
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => swiperRef.current?.slideNext()}
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                →
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductSlider;
