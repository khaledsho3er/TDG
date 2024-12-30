import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Use Link for React Router

const CategoryCard = ({ title, image, buttonText, link }) => {
  return (
    <div className="category-card" style={{ backgroundImage: `url(${image})` }}>
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

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories"); // Assuming your backend has a /api/categories route
        const data = await response.json();
        setCategories(data); // Update state with fetched categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="shop-by-category">
      <h2>Shop by Category</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            title={category.name}
            image={category.image} // Assuming you have an image field for each category
            buttonText="Shop Products"
            link={`/category/${category._id}/${category.name}/products`}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory;
