import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ For navigation
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { BsExclamationOctagon } from "react-icons/bs";

const RelatedProducts = ({ productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  // const [categories, setCategories] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const isMobile = windowWidth < 768;
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response =
          await axios.get(`https://api.thedesigngrit.com/api/related-products/related/${productId}
`);
        setRelatedProducts(response.data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };
    if (productId) fetchRelatedProducts();
  }, [productId]);
  // Fetch categories
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

  return (
    <div className="related-products-container">
      {relatedProducts.length > 0 ? (
        <Swiper
          modules={[Navigation]}
          spaceBetween={isMobile ? 10 : 20}
          slidesPerView={isMobile ? 1 : undefined}
          navigation={!isMobile}
          loop={true}
          breakpoints={{
            // When window width is >= 0px
            0: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            // When window width is >= 768px (tablet and above)
            768: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            // When window width is >= 1024px (desktop)
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="related-swiper"
        >
          {relatedProducts.map((product) => {
            const categoryId =
              typeof product.category === "object"
                ? product.category._id
                : product.category;

            const category = categories.find((cat) => cat._id === categoryId);
            const categoryName = isLoading
              ? "Loading..."
              : category?.name || "Unknown Category";
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
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <BsExclamationOctagon size={50} color="#ccc" />

          <p className="no-reviews">No products yet </p>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
