import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

const CategoryCard = ({ title, image, buttonText, link }) => {
  const fullImagePath = `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${image}`; // Full image path for rendering
  return (
    <div
      className="category-card"
      style={{ backgroundImage: `url(${fullImagePath})` }}
    >
      <div className="card-content">
        <h3>{title}</h3>
        <Link to={link} className="shop-button">
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const isMobile = useMediaQuery("(max-width:768px)");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.thedesigngrit.com/api/categories/categories"
        );
        const data = await response.json();
        setCategories(data.slice(0, 6)); // Slice the first 6 categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="shop-by-category">
      <h2>Shop by Category</h2>
      <div
        className={`category-grid ${isMobile ? "mobile-grid" : "desktop-grid"}`}
      >
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            title={category.name}
            image={category.image} // Assuming `image` contains the image path
            buttonText="Shop Products"
            link={`/category/${category._id}/subcategories`} // URL-encode category name
          />
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory;
