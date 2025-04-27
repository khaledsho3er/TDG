import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const VendorProductsCard = ({ vendor, products }) => {
  const [categories, setCategories] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.thedesigngrit.com/api/categories/categories/"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (swiperInstance && products.length === 1) {
      const wrapper = swiperInstance.el.querySelector(".swiper-wrapper");
      if (wrapper) {
        wrapper.style.width = "1000px";
      }
    }
  }, [swiperInstance, products]);

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
          loop={products.length > 1} // disable loop if only one
          className="related-swiper"
          onSwiper={setSwiperInstance}
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
