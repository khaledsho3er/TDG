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
  const [categoryNames, setCategoryNames] = useState({});

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
  // Fetch categories
  useEffect(() => {
    const fetchCategoryName = async (id) => {
      try {
        const res = await axios.get(
          `https://tdg-db.onrender.com/api/categories/categories/${id}`
        );
        return res.data.name;
      } catch (error) {
        console.error("Error fetching category name:", error);
        return "Unknown Category";
      }
    };

    const fetchAllCategoryNames = async () => {
      const namesMap = {};
      for (const product of relatedProducts) {
        if (!categoryNames[product.category]) {
          const name = await fetchCategoryName(product.category);
          namesMap[product.category] = name;
        }
      }
      setCategoryNames((prev) => ({ ...prev, ...namesMap }));
    };

    if (relatedProducts.length > 0) {
      fetchAllCategoryNames();
    }
  }, [relatedProducts, categoryNames]);
  return (
    <div className="related-products-container">
      {relatedProducts.length > 0 ? (
        <Swiper
          modules={[Navigation]}
          slidesPerView={3}
          spaceBetween={20}
          navigation
          loop={true}
          className="related-swiper"
        >
          {relatedProducts.map((product) => {
            // Find category name based on product's cateory
            // const category = categories.find(
            //   (cat) => cat._id === product.categoryId
            // );
            // const categoryName = category ? category.name : "Unknown Category";

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
                      <p className="related-category">
                        {categoryNames[product.category] || "Loading..."}
                      </p>
                      <h3 className="related-name">{product.name}</h3>
                      <p className="related-price">{product.price} E£</p>
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

          <p className="no-reviews">No related products yet </p>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
