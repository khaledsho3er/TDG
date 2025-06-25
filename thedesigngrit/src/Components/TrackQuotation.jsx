import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";
import { UserContext } from "../utils/userContext";
import LoadingScreen from "../Pages/loadingScreen";
import { Link, useNavigate } from "react-router-dom";
import QuotationDealSuccess from "./quotationDealSuccess";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import paymobService from "../services/paymobService";
import { useCart } from "../Context/cartcontext";

function TrackQuotation() {
  const { userSession } = useContext(UserContext);
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDealSuccess, setShowDealSuccess] = useState(false);
  const [payError, setPayError] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [iframeModalOpen, setIframeModalOpen] = useState(false);
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

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
        if (decision === true) {
          setShowDealSuccess(true);
        }
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

  const handlePayNow = () => {
    setPayError("");
    setPayLoading(true);
    try {
      if (!selectedQuotation) {
        setPayError("No quotation selected.");
        setPayLoading(false);
        return;
      }
      // Prevent duplicate quotation in cart
      const alreadyInCart = cartItems.some(
        (item) =>
          item.fromQuotation && item.quotationId === selectedQuotation._id
      );
      if (alreadyInCart) {
        setPayError("This quotation is already in your cart.");
        setPayLoading(false);
        navigate("/checkout");
        return;
      }
      // Generate a unique id for the cart item
      let uniqueId;
      try {
        // Try to use nanoid if available
        // eslint-disable-next-line global-require
        uniqueId = require("nanoid").nanoid();
      } catch {
        uniqueId = Date.now().toString();
      }
      const cartItem = {
        id: uniqueId,
        productId: selectedQuotation.productId?._id,
        name: selectedQuotation.productId?.name || "Quoted Product",
        unitPrice: selectedQuotation.quotePrice,
        quantity: 1,
        description: selectedQuotation.note || "",
        brandId: selectedQuotation.productId?.brandId,
        variantId: selectedQuotation.variantId || null,
        fromQuotation: true,
        quotationId: selectedQuotation._id,
        color: selectedQuotation.color || undefined,
        size: selectedQuotation.size || undefined,
        material: selectedQuotation.material || undefined,
        customization: selectedQuotation.customization || undefined,
      };
      addToCart(cartItem);
      setPayLoading(false);
      navigate("/checkout");
    } catch (err) {
      setPayError(err.message || "Failed to add quotation to cart.");
      setPayLoading(false);
    }
  };

  const handleCloseIframeModal = () => {
    setIframeModalOpen(false);
    setIframeUrl(null);
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
              alignItems: "baseline",
            }}
          >
            {selectedQuotation?.ClientApproval === true &&
              selectedQuotation?.vendorApproval === true &&
              selectedQuotation?.quotePrice && (
                <button
                  onClick={handlePayNow}
                  className="submit-btn"
                  disabled={payLoading}
                  style={{ marginRight: 8 }}
                >
                  {payLoading ? "Processing..." : "Pay Now"}
                </button>
              )}
            {selectedQuotation?.status === "approved" ? (
              <Typography sx={{ fontWeight: "bold" }}>Deal Sealed</Typography>
            ) : selectedQuotation?.status === "rejected" ? (
              <Typography sx={{ color: "#2d2d2d" }}>
                No Deal. You can consider other{" "}
                <Link
                  to="/products/readytoship"
                  style={{ color: "#6b7b58", textDecoration: "none" }}
                >
                  Products
                </Link>
                .
              </Typography>
            ) : (
              <>
                <button
                  onClick={() => handleDealDecision(true)}
                  className="submit-btn"
                  disabled={
                    selectedQuotation?.ClientApproval ||
                    selectedQuotation?.status === "rejected" ||
                    selectedQuotation?.status === "approved"
                  }
                >
                  Deal
                </button>
                <button
                  onClick={() => handleDealDecision(false)}
                  className="cancel-btn"
                  disabled={
                    selectedQuotation?.ClientApproval ||
                    selectedQuotation?.status === "rejected" ||
                    selectedQuotation?.status === "approved"
                  }
                >
                  No Deal
                </button>
              </>
            )}
          </Box>
          {payError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {payError}
            </Typography>
          )}
        </Box>
      )}
      <QuotationDealSuccess
        show={showDealSuccess}
        closePopup={() => setShowDealSuccess(false)}
      />
      {/* Paymob Iframe Modal */}
      <Dialog
        open={iframeModalOpen}
        onClose={handleCloseIframeModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Complete Payment
          <IconButton onClick={handleCloseIframeModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ p: 2 }}>
          {iframeUrl && (
            <iframe
              src={iframeUrl}
              style={{
                width: "100%",
                height: "600px",
                border: "none",
                display: "block",
              }}
              allow="camera; microphone; accelerometer; gyroscope; payment"
              allowFullScreen
              title="Paymob Payment"
              id="paymob-iframe"
              referrerPolicy="origin"
              sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}

export default TrackQuotation;
