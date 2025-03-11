import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ For navigation
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const RelatedProducts = ({ productId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response =
          await axios.get(`https://tdg-db.onrender.com/api/related-products/related/${productId}
`);
        setRelatedProducts(response.data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    if (productId) fetchRelatedProducts();
  }, [productId]);

  return (
    <div className="related-products-container">
      <Swiper
        modules={[Navigation]}
        slidesPerView={3}
        spaceBetween={20}
        navigation
        loop={true}
        className="related-swiper"
      >
        {relatedProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <Link
              to={`/product/${product._id}`}
              className="related-product-card"
            >
              <img
                src={product.mainImage}
                alt={product.name}
                className="related-img"
              />
              <div className="related-info">
                <p className="related-category">{product.category}</p>
                <h3 className="related-name">{product.name}</h3>
                <p className="related-description">{product.description}</p>
                <p className="related-price">${product.price}</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RelatedProducts;
