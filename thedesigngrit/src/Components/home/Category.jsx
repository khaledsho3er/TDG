import React from "react";

const CategoryCard = ({ title, image, buttonText, link }) => {
  return (
    <div className="category-card" style={{ backgroundImage: `url(${image})` }}>
      <div className="card-content">
        <h3>{title}</h3>
        <a href={link} className="shop-button">
          {buttonText}
        </a>
      </div>
    </div>
  );
};

const ShopByCategory = () => {
  const categories = [
    {
      title: "Furniture",
      image: "Assets/furniture.jpg",
      buttonText: "Shop Products",
      link: "/products",
    },
    {
      title: "Bathroom",
      image: "Assets/bathroom.jpeg",
      buttonText: "Shop Products",
      link: "/products",
    },
    {
      title: "Kitchen",
      image: "Assets/kitchen.jpg",
      buttonText: "Shop Products",
      link: "/products",
    },
    {
      title: "Lighting",
      image: "Assets/lighting.jpg",
      buttonText: "Shop Products",
      link: "/products",
    },
    {
      title: "Home Decor",
      image: "Assets/homedecor.jpg",
      buttonText: "Shop Products",
      link: "/products",
    },
    {
      title: "Outdoor",
      image: "Assets/outdoor.jpg",
      buttonText: "Shop Products",
      link: "/products",
    },
  ];

  return (
    <div className="shop-by-category">
      <h2>Shop by Category</h2>
      <div className="category-grid">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            image={category.image}
            buttonText={category.buttonText}
            link={category.link}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory;
