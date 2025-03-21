import React, { useState, useEffect } from "react";
import axios from "axios";
import { useVendor } from "../../utils/vendorContext";

const QuotationsPage = () => {
  const { vendor } = useVendor(); // Access vendor data from context
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null); // State to store the selected quotation for popup

  // Fetch quotations for a brand when the component mounts
  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await axios.get(
          `https://tdg-db.onrender.com/api/quotation/quotations/brand/${vendor.brandId}`
        );
        setQuotations(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quotations:", err); // Log error for debugging
        // setError(err.response?.data?.message || "Failed to load quotations"); // Show API error message if available
        // setLoading(false);
      }
    };

    fetchQuotations();
  }, [vendor.brandId]); // Add vendor.brandId to the dependencies

  const handleCardClick = (quotation) => {
    setSelectedQuotation(quotation); // Set the clicked quotation to show in the popup
  };

  const handleClosePopup = () => {
    setSelectedQuotation(null); // Close the popup by resetting the selected quotation
  };

  if (loading) {
    return <div>Loading quotations...</div>;
  }

  return (
    <div className="quotations-page">
      <h1>Quotations for Brand</h1>

      {quotations.length > 0 ? (
        <div className="quotations-list">
          {quotations.map((quotation) => (
            <div
              key={quotation._id}
              className="quotation-card"
              onClick={() => handleCardClick(quotation)}
            >
              <img
                src={
                  quotation.productId.mainImage
                    ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${quotation.productId.mainImage}`
                    : "/default-product-image.jpg"
                }
                alt={quotation.productId.name}
                className="quotation-card-img"
              />
              <div className="quotation-card-info">
                <h2>{quotation.productId.name}</h2>
                <p>ID: {quotation._id}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-quotations">
          <p>No quotations yet!</p>
          <span className="exclamation">⚠️</span>
        </div>
      )}

      {/* Popup for displaying quotation details */}
      {selectedQuotation && (
        <div className="quotation-popup">
          <div className="quotation-popup-content">
            <span className="close-btn" onClick={handleClosePopup}>
              &times;
            </span>
            <h2>Quotation For: {selectedQuotation.productId.name}</h2>
            <img
              src={
                selectedQuotation.productId.mainImage
                  ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedQuotation.productId.mainImage}`
                  : "/default-product-image.jpg"
              }
              alt={selectedQuotation.productId.name}
              className="quotation-popup-img"
            />
            <p>
              <strong>Material:</strong> {selectedQuotation.material}
            </p>
            <p>
              <strong>Size:</strong> {selectedQuotation.size}
            </p>
            <p>
              <strong>Color:</strong> {selectedQuotation.color}
            </p>
            <p>
              <strong>Customization:</strong> {selectedQuotation.customization}
            </p>
            <p>
              <strong>User:</strong> {selectedQuotation.userId.firstName}{" "}
              {selectedQuotation.userId.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedQuotation.userId.email}
            </p>
            <p>
              <strong>Number:</strong> {selectedQuotation.userId.phoneNumber}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedQuotation.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsPage;
