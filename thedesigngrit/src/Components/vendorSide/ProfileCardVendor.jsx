import React from "react";

const ProfileCardVendor = ({ vendor, brandName, onClose }) => (
  <div className="profile-card-flip-container">
    <div className="profile-card-flip">
      <div className="profile-card-front">
        <h2>Employee Card</h2>
        <div className="profile-card-content">
          <p>
            <strong>Name:</strong> {vendor.firstName} {vendor.lastName}
          </p>
          <p>
            <strong>Email:</strong> {vendor.email}
          </p>
          <p>
            <strong>Phone:</strong> {vendor.phoneNumber}
          </p>
          <p>
            <strong>Employee #:</strong> {vendor.employeeNumber}
          </p>
          <p>
            <strong>Role:</strong> {vendor.role}
          </p>
          <p>
            <strong>Tier:</strong> {vendor.tier}
          </p>
          <p>
            <strong>Brand:</strong> {brandName}
          </p>
        </div>
        <button className="profile-card-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);

export default ProfileCardVendor;
