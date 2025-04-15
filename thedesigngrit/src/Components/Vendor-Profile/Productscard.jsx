import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Box, Typography } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";

const VendorProductsCard = ({ vendor, products }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://tdg-db.onrender.com/api/categories/categories/"
        );
        const data = await response.json();
        setCategories(data);
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
      {products && products.length > 0 ? (
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
                        style={{ fontSize: "15px", color: "#ccc" }}
                      >
                        {product.salePrice ? (
                          <span
                            style={{
                              textDecoration: "line-through",
                              marginRight: "5px",
                            }}
                          >
                            {product.price} E£
                          </span>
                        ) : (
                          `${product.price} E£`
                        )}
                        {product.salePrice && (
                          <span style={{ color: "red" }}>
                            {product.salePrice} E£
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
        <Box
          sx={{
            padding: "40px 0",
            textAlign: "center",
            minHeight: "200px",
            border: "1px dashed #ccc",
            borderRadius: "12px",
            width: "100%",
            margin: "0 auto",
            marginTop: "20px",
          }}
        >
          <Typography variant="body1" sx={{ color: "#888" }}>
            No products available for this vendor yet.
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default VendorProductsCard;
