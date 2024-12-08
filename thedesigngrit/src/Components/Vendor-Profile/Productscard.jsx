import React from "react";

const VendorProductsCard = ({ title, description, price, image }) => {
  return (
    <div className="vendorprofile-products-card">
      {/* Image Section */}
      <img
        src={image}
        alt={`${title} Image`}
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
