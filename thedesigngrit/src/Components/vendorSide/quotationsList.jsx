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
          `https://api.thedesigngrit.com/api/quotation/quotations/brand/${vendor.brandId}`
        );
        setQuotations(response.data);
      } catch (err) {
        console.error("Error fetching quotations:", err);
      } finally {
        setLoading(false);
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
      <div className="dashboard-header-title" style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <h2>Quotations</h2>
        </div>
        <p style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
          Home &gt; Quotations Requests
        </p>
      </div>

      {quotations.length === 0 ? (
        <div className="no-quotations">
          <p>No quotations yet!</p>
        </div>
      ) : (
        <div className="quotations-list">
          {quotations.map((quotation) => (
            <div
              key={quotation?._id || Math.random()}
              className="quotation-card"
              onClick={() => handleCardClick(quotation)}
            >
              <img
                src={
                  quotation?.productId?.mainImage
                    ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${quotation?.productId?.mainImage}`
                    : "/default-product-image.jpg"
                }
                alt={quotation?.productId?.name || "Unnamed Product"}
                className="quotation-card-img"
              />
              <div className="quotation-card-info">
                <h2>{quotation?.productId?.name || "Unnamed Product"}</h2>
                <p>ID: {quotation?.productId?._id || "No ID"}</p>
                <p>User: {quotation?.userId?.firstName || "Unknown"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup for displaying quotation details */}
      {selectedQuotation && (
        <div className="quotation-popup">
          <div className="quotation-popup-content">
            <span className="close-btn" onClick={handleClosePopup}>
              &times;
            </span>
            <h2>
              Quotation For:{" "}
              {selectedQuotation?.productId?.name || "Unnamed Product"}
            </h2>
            <img
              src={
                selectedQuotation?.productId?.mainImage
                  ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedQuotation?.productId?.mainImage}`
                  : "/default-product-image.jpg"
              }
              alt={selectedQuotation?.productId?.name || "Unnamed Product"}
              className="quotation-popup-img"
            />
            <p>
              <strong>Material:</strong> {selectedQuotation?.material || "N/A"}
            </p>
            <p>
              <strong>Size:</strong> {selectedQuotation?.size || "N/A"}
            </p>
            <p>
              <strong>Color:</strong> {selectedQuotation?.color || "N/A"}
            </p>
            <p>
              <strong>Customization:</strong>{" "}
              {selectedQuotation?.customization || "N/A"}
            </p>
            <p>
              <strong>User:</strong>
              {selectedQuotation?.userId?.firstName || "Unknown"}
              {selectedQuotation?.userId?.lastName || " User"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {selectedQuotation?.userId?.email || "No Email"}
            </p>
            <p>
              <strong>Number:</strong>{" "}
              {selectedQuotation?.userId?.phoneNumber || "No Phone Number"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {selectedQuotation?.createdAt
                ? new Date(selectedQuotation.createdAt).toLocaleDateString()
                : "No Date"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsPage;
