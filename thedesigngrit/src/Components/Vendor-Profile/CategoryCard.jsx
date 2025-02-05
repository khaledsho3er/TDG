import React from "react";

const VendorCategoryCard = ({ title, image }) => {
  return (
    <div className="vendorprofile-card">
      {/* Card Content Section */}
      <div className="vendorprofile-card-content">
        <p className="vendorprofile-card-title">{title}</p>
      </div>

      {/* Image Section */}
      <img
        src={image}
        alt={`${title} ImageLogo`}
        className="vendorprofile-card-media"
      />
    </div>
  );
};

export default VendorCategoryCard;
