import React from "react";

const VendorProductsCard = ({ title, description, price, mainImage }) => {
  return (
    <div className="vendorprofile-products-card">
      {/* Image Section */}
      <img
        src={`https://pub-8c9ce55fbad6475eb1afe9472bd396e0.r2.dev/${mainImage}`}
        alt={`${title} ImageProducts`}
        className="vendorprofile-products-card-media"
      />
      {/* Card Content Section */}
      <div className="vendorprofile-products-card-content">
        <p className="vendorprofile-products-card-title">{title}</p>
        <p className="vendorprofile-products-card-description">{description}</p>
        <p className="vendorprofile-products-card-Price">{price}</p>
      </div>
    </div>
  );
};

export default VendorProductsCard;
