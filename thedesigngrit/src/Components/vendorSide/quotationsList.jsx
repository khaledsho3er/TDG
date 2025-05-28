import React, { useState, useEffect } from "react";
import axios from "axios";
import { useVendor } from "../../utils/vendorContext";

const QuotationsPage = () => {
  const { vendor } = useVendor();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const [note, setNote] = useState("");
  const [quotePrice, setQuotePrice] = useState("");
  const [file, setFile] = useState(null);

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
  }, [vendor.brandId]);

  const handleCardClick = (quotation) => {
    setSelectedQuotation(quotation);
    setNote(quotation.note || "");
    setQuotePrice(quotation.quotePrice || "");
    setFile(null);
  };

  const handleClosePopup = () => {
    setSelectedQuotation(null);
    setNote("");
    setQuotePrice("");
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("note", note);
    formData.append("quotePrice", quotePrice);
    formData.append("dateOfQuotePrice", new Date().toISOString());
    if (file) formData.append("file", file);

    try {
      const res = await axios.put(
        `https://api.thedesigngrit.com/api/quotation/update/${selectedQuotation._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Quotation updated successfully!");
      handleClosePopup();
      window.location.reload();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update quotation.");
    }
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quotation?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://api.thedesigngrit.com/api/quotation/delete/${selectedQuotation._id}`
      );
      alert("Quotation deleted successfully!");
      handleClosePopup();
      window.location.reload();
    } catch (error) {
      console.error("Deletion failed:", error);
      alert("Failed to delete quotation.");
    }
  };
  if (loading) {
    return <div>Loading quotations...</div>;
  }

  return (
    <div className="quotations-page">
      <div className="dashboard-header-title" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              key={quotation?._id}
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
              <strong>User:</strong>{" "}
              {selectedQuotation?.userId?.firstName || "Unknown"}{" "}
              {selectedQuotation?.userId?.lastName || "User"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {selectedQuotation?.userId?.email || "No Email"}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {selectedQuotation?.userId?.phoneNumber || "No Phone Number"}
            </p>
            <p>
              <strong>Requested At:</strong>{" "}
              {new Date(selectedQuotation?.createdAt).toLocaleDateString()}
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
              <label>Note:</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />

              <label>Quote Price:</label>
              <input
                type="number"
                value={quotePrice}
                onChange={(e) => setQuotePrice(e.target.value)}
                required
              />

              <label>Upload Quotation Invoice (optional):</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />

              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button type="submit">Submit Quotation</button>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{ backgroundColor: "#ff4d4d", color: "#fff" }}
                >
                  Delete Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsPage;
