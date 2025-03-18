import React from "react";

const VendorProductsCard = ({ title, description, price, mainImage }) => {
  return (
    <div className="vendorprofile-products-card">
      {/* Image Section */}
      <img
        src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${mainImage}`}
        alt={`${title} ImageProducts`}
        className="vendorprofile-products-card-media"
      />
      {/* Card Content Section */}
      <div className="vendorprofile-products-card-content">
        <p className="vendorprofile-products-card-title">{title}</p>
        <p className="vendorprofile-products-card-description">
          {description.split(" ").slice(0, 10).join(" ")}
        </p>
        <p className="vendorprofile-products-card-price">{price}</p>
      </div>
    </div>
  );
};

export default VendorProductsCard;
