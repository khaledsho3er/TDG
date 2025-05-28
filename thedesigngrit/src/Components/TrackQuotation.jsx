import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";
import { UserContext } from "../utils/userContext";
import LoadingScreen from "../Pages/loadingScreen";

function TrackQuotation() {
  const { userSession } = useContext(UserContext);
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotations = async () => {
      if (!userSession?.id) return;

      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/quotation/customer/${userSession.id}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setQuotations(data);
          setSelectedQuotation(data[0] || null);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (err) {
        console.error("Error fetching quotations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [userSession]);
  const handleDealDecision = async (decision) => {
    if (!selectedQuotation?._id) return;

    try {
      const res = await fetch(
        `https://api.thedesigngrit.com/api/quotation/quotation/${selectedQuotation._id}/client-approval`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approved: decision }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        // Update the quotation locally
        setQuotations((prev) =>
          prev.map((q) => (q._id === data.quotation._id ? data.quotation : q))
        );
        setSelectedQuotation(data.quotation);
      } else {
        console.error("Error updating approval:", data.message);
      }
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const quotation = quotations.find((q) => q._id === selectedId);
    setSelectedQuotation(quotation);
  };

  if (loading) return <LoadingScreen />;

  return (
    <Box sx={{ fontFamily: "Montserrat", paddingBottom: "10rem" }}>
      <Typography variant="h6" gutterBottom>
        Track Your Quotation
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 4 }}>
        <Select
          value={selectedQuotation?._id || ""}
          onChange={handleSelectChange}
        >
          {quotations.map((quotation) => (
            <MenuItem key={quotation._id} value={quotation._id}>
              Quotation {quotation._id.slice(-6)} – {quotation.productId?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedQuotation && (
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quotation Summary
          </Typography>

          <Typography>
            <strong>Product:</strong>{" "}
            {selectedQuotation.productId?.name || "N/A"}
          </Typography>

          {selectedQuotation.productId?.mainImage && (
            <img
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedQuotation.productId.mainImage}`}
              alt={selectedQuotation.productId.name}
              style={{ width: "200px", borderRadius: "6px", marginTop: "10px" }}
            />
          )}

          <Typography sx={{ mt: 2 }}>
            <strong>Color:</strong> {selectedQuotation.color || "N/A"}
          </Typography>
          <Typography>
            <strong>Size:</strong> {selectedQuotation.size || "N/A"}
          </Typography>
          <Typography>
            <strong>Material:</strong> {selectedQuotation.material || "N/A"}
          </Typography>
          <Typography>
            <strong>Customization Ref:</strong>{" "}
            {selectedQuotation.customization || "N/A"}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            <strong>Quoted Price:</strong>{" "}
            {selectedQuotation.quotePrice
              ? `${selectedQuotation.quotePrice.toLocaleString()} E£`
              : "Not yet provided"}
          </Typography>

          <Typography>
            <strong>Vendor Note:</strong>{" "}
            {selectedQuotation.note || "No note provided by vendor."}
          </Typography>
          {selectedQuotation.quotationInvoice && (
            <Typography
              variant="body2"
              sx={{ mt: 2, cursor: "pointer" }}
              onClick={() => {
                const link = document.createElement("a");
                link.href = `https://pub-64ea2c5c4ba5460991425897a370f20c.r2.dev/${selectedQuotation.quotationInvoice}`;
                link.setAttribute(
                  "download",
                  selectedQuotation.quotationInvoice
                );
                link.setAttribute("target", "_blank");
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <strong>Quotation Invoice:</strong>{" "}
              <u>{selectedQuotation.quotationInvoice}</u>
            </Typography>
          )}

          <Typography sx={{ color: "gray", mt: 2 }}>
            Requested On:{" "}
            {new Date(selectedQuotation.createdAt).toLocaleDateString()}
            <br />
            Quoted On:{" "}
            {selectedQuotation.dateOfQuotePrice
              ? new Date(
                  selectedQuotation.dateOfQuotePrice
                ).toLocaleDateString()
              : "Pending"}
          </Typography>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              gap: 2,
              justifyContent: "end",
              flexDirection: "row-reverse",
            }}
          >
            <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "end" }}>
              <button
                onClick={() => handleDealDecision(true)}
                className="submit-btn"
                disabled={
                  selectedQuotation?.ClientApproval ||
                  selectedQuotation?.status === "rejected"
                }
              >
                Deal
              </button>
              <button
                onClick={() => handleDealDecision(false)}
                className="cancel-btn"
                disabled={
                  selectedQuotation?.ClientApproval ||
                  selectedQuotation?.status === "rejected"
                }
              >
                No Deal
              </button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default TrackQuotation;
