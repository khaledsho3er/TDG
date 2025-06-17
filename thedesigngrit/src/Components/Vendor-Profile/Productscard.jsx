import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Box, CircularProgress } from "@mui/material";

const VendorProductsCard = ({ vendor, products }) => {
  const [categories, setCategories] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://api.thedesigngrit.com/api/categories/categories/"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Determine the appropriate slidesPerView based on product count and screen size
  const getSlidesPerView = () => {
    const isMobile = window.innerWidth <= 768;

    if (products.length === 1) {
      return 1;
    } else if (products.length === 2) {
      return isMobile ? 1 : 2;
    } else {
      return isMobile ? 1 : 3;
    }
  };

  return (
    <div
      className="related-products-container"
      style={{
        padding: window.innerWidth <= 768 ? "30px 25px" : "49px 110px",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            width: "100%",
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: "#6b7b58" }} />
        </Box>
      ) : products && products.length > 0 ? (
        <Swiper
          modules={[Navigation]}
          slidesPerView={getSlidesPerView()}
          spaceBetween={window.innerWidth <= 768 ? 10 : 20}
          navigation={products.length > 1}
          loop={products.length > 2} // Only enable loop when there are more than 2 products
          className="related-swiper"
          onSwiper={setSwiperInstance}
          centeredSlides={products.length === 1}
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
                        style={{ fontSize: "15px", color: "#2d2d2d" }}
                      >
                        {product.salePrice ? (
                          <span
                            style={{
                              textDecoration: "line-through",
                              marginRight: "5px",
                            }}
                          >
                            {product.price.toLocaleString("en-US")} E£
                          </span>
                        ) : (
                          `${product.price.toLocaleString("en-US")} E£`
                        )}
                        {product.salePrice && (
                          <span style={{ color: "red" }}>
                            {product.salePrice.toLocaleString("en-US")} E£
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <p
          style={{
            color: "#888",
            fontStyle: "italic",
            textAlign: "center",
            padding: "40px 0",
          }}
        >
          No products available for this vendor yet.
        </p>
      )}
    </div>
  );
};

export default VendorProductsCard;
