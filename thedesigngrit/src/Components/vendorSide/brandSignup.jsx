import React, { useState } from "react";

const BrandSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    brandName: "",
    commercialRegisterNumber: "",
    taxNumber: "",
    companyAddress: "",
    phoneNumber: "",
    email: "",
    bankAccountDetails: "",
    websiteUrl: "",
    instagramLink: "",
    facebookLink: "",
    linkedinLink: "",
    tiktokLink: "",
    shippingPolicy: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., API call or state update)
    console.log("Brand Signup Data:", formData);
  };

  return (
    <div className="brand-signup-form">
      <h2>Brand Signup</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="form-field">
          <label>Name of Person Registering</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter Your Name"
            required
          />
        </div>
        <div className="form-field">
          <label>Role at Company</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="Enter your Title at Company"
            required
          />
        </div>
        <div className="form-field">
          <label>Brand Name</label>
          <input
            type="text"
            name="brandName"
            value={formData.brandName}
            onChange={handleInputChange}
            placeholder="Enter the official brand name"
            required
          />
        </div>
        <div className="form-field">
          <label>Commercial Register Number</label>
          <input
            type="text"
            name="commercialRegisterNumber"
            value={formData.commercialRegisterNumber}
            onChange={handleInputChange}
            placeholder="Enter the commercial register number"
            required
          />
        </div>
        <div className="form-field">
          <label>Tax Number</label>
          <input
            type="text"
            name="taxNumber"
            value={formData.taxNumber}
            onChange={handleInputChange}
            placeholder="Enter the tax identification number"
            required
          />
        </div>
        <div className="form-field">
          <label>Company Address</label>
          <input
            type="text"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleInputChange}
            placeholder="Enter the company address"
            required
          />
        </div>
        <div className="form-field">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter a contact phone number"
            required
          />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter a primary email for business inquiries"
            required
          />
        </div>
        <div className="form-field">
          <label>Bank Account Details</label>
          <input
            type="text"
            name="bankAccountDetails"
            value={formData.bankAccountDetails}
            onChange={handleInputChange}
            placeholder="Enter the bank account details for payment processing"
            required
          />
        </div>
        <div className="form-field">
          <label>Website URL</label>
          <input
            type="url"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleInputChange}
            placeholder="Enter the official website URL"
            required
          />
        </div>

        {/* Social Media Links - 2 per row */}
        <div className="form-field social-links">
          <div className="social-link">
            <label>Instagram Link</label>
            <input
              type="url"
              name="instagramLink"
              value={formData.instagramLink}
              onChange={handleInputChange}
              placeholder="Enter the Instagram page URL"
              required
            />
          </div>
          <div className="social-link">
            <label>Facebook Link</label>
            <input
              type="url"
              name="facebookLink"
              value={formData.facebookLink}
              onChange={handleInputChange}
              placeholder="Enter the Facebook page URL"
              required
            />
          </div>
          <div className="social-link">
            <label>LinkedIn Link</label>
            <input
              type="url"
              name="linkedinLink"
              value={formData.linkedinLink}
              onChange={handleInputChange}
              placeholder="Enter the LinkedIn page URL"
              required
            />
          </div>
          <div className="social-link">
            <label>TikTok Link</label>
            <input
              type="url"
              name="tiktokLink"
              value={formData.tiktokLink}
              onChange={handleInputChange}
              placeholder="Enter the TikTok page URL"
              required
            />
          </div>
        </div>
        <div className="form-field">
          <label>Shipping Policy/Fee and System</label>
          <textarea
            name="shippingPolicy"
            value={formData.shippingPolicy}
            onChange={handleInputChange}
            placeholder="Please describe your shipping policy and associated fees, including which shipping system or provider you use."
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BrandSignup;
