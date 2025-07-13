import React, { useState, useEffect } from "react";
import axios from "axios";
import { useVendor } from "../../utils/vendorContext";
import { LuInfo } from "react-icons/lu";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
const QuotationsPage = () => {
  const { vendor } = useVendor();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showProductInfo, setShowProductInfo] = useState(false);
  const [note, setNote] = useState("");
  const [quotePrice, setQuotePrice] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const response = await axios.get(
          `https://api.thedesigngrit.com/api/quotation/quotations/brand/${vendor.brandId}`
        );
        setQuotations(
          (response.data || [])
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      } catch (err) {
        console.error("Error fetching quotations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [vendor.brandId]);
  const handleVendorConfirm = async () => {
    try {
      const res = await axios.patch(
        `https://api.thedesigngrit.com/api/quotation/quotation/${selectedQuotation._id}/vendor-approval`
      );
      console.log("Vendor approval response:", res.data);
      alert("Quotation approved by vendor!");
      handleClosePopup(); // optional: close modal
      window.location.reload(); // or update state instead
    } catch (error) {
      console.error("Vendor approval failed:", error);
      alert(
        error?.response?.data?.message ||
          "Failed to approve quotation. Try again later."
      );
    }
  };

  const handleCardClick = (quotation) => {
    setSelectedQuotation(quotation);
    setNote(quotation.note || "");
    setQuotePrice(quotation.quotePrice || "");
    setLeadTime(quotation.customizationLeadTime || "");
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
    formData.append("customizationLeadTime", leadTime);
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
      console.log("Update response:", res.data);
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
            <div style={{ position: "relative" }}>
              <img
                src={
                  selectedQuotation?.productId?.mainImage
                    ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedQuotation?.productId?.mainImage}`
                    : "/default-product-image.jpg"
                }
                alt={selectedQuotation?.productId?.name || "Unnamed Product"}
                className="quotation-popup-img"
              />
              <IconButton
                aria-label="Product Info"
                onClick={() => setShowProductInfo(true)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                }}
              >
                <LuInfo color="white" size={30} />
              </IconButton>
            </div>
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
            <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>
              Quotation Details:{" "}
            </h3>
            <p>
              <strong>Requested Material:</strong> {selectedQuotation?.material}
            </p>
            <p>
              <strong>Requested size:</strong> {selectedQuotation?.size}
            </p>
            <p>
              <strong>Requested color:</strong> {selectedQuotation?.color}
            </p>
            <p>
              <strong>Requested customization:</strong>{" "}
              {selectedQuotation?.customization}
            </p>
            {/* <label
              style={{
                color: selectedQuotation?.ClientApproval
                  ? "#155724"
                  : "#721c24",
                border: "1px solid #d4edda",
                backgroundColor: selectedQuotation?.ClientApproval
                  ? "#def9bf"
                  : "#f8d7da",
                borderRadius: "5px",
                padding: "5px",
                marginTop: "15px",
                width: "30%",
                textAlign: "center",
              }}
            >
              {selectedQuotation?.ClientApproval
                ? "Client Approved"
                : "Client Not Approved"}
            </label> */}
            <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
              <label>Note:</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                style={{ backgroundColor: "#fff" }}
                readOnly={selectedQuotation?.ClientApproval === true}
              />
              <label>Estimated Lead Time:</label>
              <input
                type="text"
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                placeholder="Enter lead time range (e.g., 5-7 days)"
                required
                pattern="\d+-\d+"
                title="Please enter a valid range (e.g., 5-7)"
              />
              <label>Quote Price:</label>
              <input
                type="number"
                value={quotePrice}
                onChange={(e) => setQuotePrice(e.target.value)}
                required
                readOnly={selectedQuotation?.ClientApproval === true}
              />

              <label>Upload Quotation Invoice (optional):</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                disabled={selectedQuotation?.ClientApproval === true}
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                  justifyContent: "space-around",
                  alignItems: "baseline",
                }}
              >
                {/* {selectedQuotation?.paymentDetails.paid === true && (
                  <label
                    style={{
                      backgroundColor: "#d4edda",
                      border: "1px solid #d4edda",
                      color: "#155724",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    Paid
                  </label>
                )}
                {selectedQuotation?.paymentDetails.paid === false && (
                  <label
                    style={{
                      backgroundColor: "#f8d7da",
                      border: "1px solid #f5c6cb",
                      color: "#721c24",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    Not Paid Yet
                  </label>
                )} */}
                {selectedQuotation?.paymentDetails.paid !== undefined && (
                  <label
                    style={{
                      backgroundColor: selectedQuotation.paymentDetails.paid
                        ? "#d4edda"
                        : "#f8d7da",
                      border: selectedQuotation.paymentDetails.paid
                        ? "1px solid #d4edda"
                        : "1px solid #f5c6cb",
                      color: selectedQuotation.paymentDetails.paid
                        ? "#155724"
                        : "#721c24",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {selectedQuotation.paymentDetails.paid
                      ? "Paid"
                      : "Not Paid Yet"}
                  </label>
                )}
                {selectedQuotation?.ClientApproval && (
                  <p style={{ marginTop: "15px" }}>Deal is sealed</p>
                )}

                {/* // ) : (
                //   <button
                //     onClick={handleVendorConfirm}
                //     disabled={!selectedQuotation?.ClientApproval}
                //     style={{
                //       backgroundColor: selectedQuotation?.ClientApproval
                //         ? "#1e7e34"
                //         : "#ccc",
                //       color: "#fff",
                //       padding: "10px 15px",
                //       borderRadius: "4px",
                //       border: "none",
                //       cursor: selectedQuotation?.ClientApproval
                //         ? "pointer"
                //         : "not-allowed",
                //       marginTop: "15px",
                //     }}
                //   >
                //     Confirm
                //   </button>
                // )
                 */}

                <button
                  onClick={handleDelete}
                  disabled={selectedQuotation?.paymentDetails.paid === true}
                  style={{
                    backgroundColor: "#fff",
                    color: "#2d2d2d",
                    border: "1px solid red",
                    padding: "10px 15px",
                    borderRadius: "4px",
                    cursor:
                      selectedQuotation?.paymentDetails.paid === true
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      selectedQuotation?.paymentDetails.paid === true ? 0.6 : 1,
                    "&:hover": {
                      backgroundColor: "red",
                      color: "#fff",
                      transform: "scale(1.1)",
                      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  Delete Quotation
                </button>
                {!selectedQuotation.quotePrice && (
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#2d2d2d",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#6b7b58",
                        transform: "scale(1.1) !important",
                        boxShadow: "0 0 10px rgba(0,0,0,0.2) !important",
                      },
                    }}
                  >
                    Submit Quotation
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      <Dialog
        open={showProductInfo}
        onClose={() => setShowProductInfo(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          borderRadius: "8px",
          height: "80vh",
        }}
      >
        <DialogTitle>Product Information</DialogTitle>
        <DialogContent dividers>
          {selectedQuotation && (
            <Box>
              <img
                src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedQuotation.productId.mainImage}`}
                alt={selectedQuotation.productId.name}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <Typography variant="h6" mt={2}>
                {selectedQuotation.productId.name}
              </Typography>
              <Typography>
                <strong> Price: E£</strong>{" "}
                {selectedQuotation.productId.salePrice ? (
                  <del style={{ color: "#a1a1a1" }}>
                    {selectedQuotation.productId.price.toLocaleString()}E£
                  </del>
                ) : (
                  selectedQuotation.productId.price.toLocaleString()
                )}
                {selectedQuotation.productId.salePrice && (
                  <span style={{ color: "red" }}>
                    {" "}
                    {selectedQuotation.productId.salePrice.toLocaleString()}E£
                  </span>
                )}
              </Typography>
              <Typography>
                {" "}
                <strong> SKU:</strong> {selectedQuotation.productId.sku}
              </Typography>
              {/* <Typography>
                <strong> Manufacturer:</strong>{" "}
                {selectedQuotation.productId.manufacturer}
              </Typography> */}
              <Typography>
                <strong> Collection:</strong>{" "}
                {selectedQuotation.productId.collection}
              </Typography>
              <Typography>
                <strong> Year:</strong>{" "}
                {selectedQuotation.productId.manufactureYear}
              </Typography>
              <Typography>
                <strong> Colors:</strong>{" "}
                {selectedQuotation.productId.colors || "N/A"}
              </Typography>
              <Typography>
                <strong> Sizes: </strong>{" "}
                {selectedQuotation.productId.sizes || "N/A"}
              </Typography>
              <Typography>
                <strong> Dimensions:</strong>
                {selectedQuotation.productId.technicalDimensions?.length} x{" "}
                {selectedQuotation.productId.technicalDimensions?.width} x{" "}
                {selectedQuotation.productId.technicalDimensions?.height} cm
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              backgroundColor: "#2d2d2d",
              color: "white",
              "&:hover": {
                backgroundColor: "#6b7b58",
                transform: "scale(1.1)",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)",
              },
            }}
            onClick={() => setShowProductInfo(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default QuotationsPage;
