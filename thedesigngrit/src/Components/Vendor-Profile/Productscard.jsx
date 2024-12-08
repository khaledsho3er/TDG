import React from "react";

const VendorProductsCard = ({ title, description, price, image }) => {
  return (
    <div className="vendorprofile-card">
      {/* Image Section */}
      <img
        src={image}
        alt={`${title} Image`}
        className="vendorprofile-card-media"
      />
      {/* Card Content Section */}
      <div className="vendorprofile-card-content">
        <p className="vendorprofile-card-title">{title}</p>
      </div>
    </div>
  );
};

export default VendorProductsCard;
