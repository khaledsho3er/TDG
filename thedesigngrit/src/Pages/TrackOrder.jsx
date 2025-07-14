import React, { useState, useEffect, useContext } from "react";
import { Box, MenuItem, Select, FormControl } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { LuPackage } from "react-icons/lu";
import InteractiveStarRating from "../Components/rating";
import { UserContext } from "../utils/userContext";
import LoadingScreen from "./loadingScreen";
import { GiConfirmed } from "react-icons/gi";
import { pdf } from "@react-pdf/renderer";
import { CiUndo } from "react-icons/ci";
import InvoicePDF from "../Components/invoiceOrderCustomer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ConfirmationDialog from "../Components/confirmationMsg";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

function TrackOrder() {
  const [ordersData, setOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSubOrder, setSelectedSubOrder] = useState(null);
  const { userSession } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [pendingReason, setPendingReason] = useState("");
  // Add review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");
  // Add state for review popup
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // Move fetchOrders here so it can be used in handleReturnOrder
  const fetchOrders = async () => {
    if (!userSession?.id) return; // Ensure userSession is available

    try {
      const response = await fetch(
        `https://api.thedesigngrit.com/api/orders/orders/customer/${userSession.id}`
      ); // Adjust API endpoint as needed
      const data = await response.json();

      // Filter orders for the logged-in user
      const userOrders = data.filter(
        (order) => order.customerId._id === userSession.id
      );

      setOrdersData(userOrders);
      setSelectedOrder(userOrders[0] || null); // Default to the first order if available
      setSelectedSubOrder(userOrders[0]?.cartItems[0] || null); // Default to the first cart item
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders based on userSession.id
  useEffect(() => {
    fetchOrders();
  }, [userSession]);
  const handleReturnOrder = () => {
    setPendingReason("");
    setShowReasonDialog(true);
  };

  const handleReasonSubmit = () => {
    if (!pendingReason.trim()) {
      alert("Please enter a reason for return.");
      return;
    }
    setShowReasonDialog(false);
    setShowReturnConfirm(true);
  };

  const handleConfirmReturn = async () => {
    setShowReturnConfirm(false);
    try {
      const res = await fetch(
        `https://api.thedesigngrit.com/api/returns-order/returns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: selectedOrder._id,
            reason: pendingReason,
            userId: userSession.id, // <-- add this
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Return request submitted successfully.");
      } else {
        alert(data?.error || "Failed to submit return request.");
      }
      await fetchOrders();
    } catch (err) {
      console.error("Return request failed:", err);
      alert("Something went wrong.");
    }
  };

  const handleLazyInvoiceDownload = async () => {
    try {
      const [{ pdf }, { default: InvoicePDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("../Components/invoiceOrderCustomer"),
      ]);

      const doc = <InvoicePDF order={selectedOrder} />;
      const blob = await pdf(doc).toBlob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };
  const openInvoiceInNewTab = async () => {
    const blob = await pdf(<InvoicePDF order={selectedOrder} />).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };
  if (loading) return <LoadingScreen />;
  const shouldShowReturnButton =
    selectedOrder &&
    new Date(selectedOrder.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000 >
      new Date().getTime();

  // Review submit handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSubmitted(false);
    if (!reviewRating || !reviewComment.trim()) {
      setReviewError("Please provide a rating and a review comment.");
      return;
    }
    try {
      const response = await fetch(
        `https://api.thedesigngrit.com/api/reviews/createreviews/${selectedSubOrder.productId._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewerName: `${userSession.firstName} ${userSession.lastName}`,
            userId: userSession.id,
            rating: reviewRating,
            comment: reviewComment,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      setReviewSubmitted(true);
      setReviewRating(0);
      setReviewComment("");
    } catch (error) {
      setReviewError("Failed to submit review. Please try again later.");
    }
  };

  // When a star is clicked, open the dialog and set the rating
  const handleStarClick = (star) => {
    setReviewRating(star);
    setReviewHover(star);
    setReviewDialogOpen(true);
  };

  // On dialog close, reset hover
  const handleReviewDialogClose = () => {
    setReviewDialogOpen(false);
    setReviewHover(0);
    setReviewError("");
    setReviewSubmitted(false);
  };
  return (
    <Box sx={{ fontFamily: "Montserrat" }}>
      <Box sx={{ paddingBottom: "25rem" }}>
        <p
          style={{
            fontWeight: "normal",
            fontSize: "15px",
            fontFamily: "Montserrat",
          }}
        >
          Select Order
        </p>
        <FormControl fullWidth sx={{ marginBottom: "20px" }}>
          <Select
            labelId="order-select-label"
            id="order-select"
            value={selectedOrder?._id || ""}
            onChange={(e) => {
              const order = ordersData.find(
                (order) => order._id === e.target.value
              );
              setSelectedOrder(order);
              setSelectedSubOrder(order?.cartItems[0] || null);
            }}
          >
            {ordersData
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order) => (
                <MenuItem key={order._id} value={order._id}>
                  Order No. : {order._id}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <div className="terms-container">
          {/* Sidebar */}
          {/* Content Section */}
          <div className="order-details">
            {selectedOrder && selectedSubOrder && (
              <>
                {/* Order Info */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                  className="order-card-title"
                >
                  <Box>
                    <h3
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        fontFamily: "Montserrat",
                      }}
                    >
                      Order: {selectedOrder._id}
                    </h3>
                    <Box
                      sx={{ display: "flex", gap: 1, flexDirection: "column" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: "column",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat",
                            color: "#ccc",
                          }}
                        >
                          {" "}
                          Order Date:
                        </span>{" "}
                        <p style={{ fontWeight: "bold" }}>
                          {new Date(
                            selectedOrder.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: "column",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat",
                            color: "#ccc",
                          }}
                        >
                          {" "}
                          Delivery Date:{" "}
                        </span>
                        <p style={{ fontWeight: "bold" }}>
                          {selectedOrder.orderStatus === "Pending"
                            ? "Not specified yet"
                            : selectedOrder.orderStatus === "Delivered"
                            ? "Already Delivered"
                            : new Date(
                                selectedOrder.deliveryDate
                              ).toLocaleDateString()}
                        </p>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    style={{ display: "flex", gap: 1, flexDirection: "column" }}
                  >
                    <select
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "5px",
                        width: "100%",
                        height: "40px",
                      }}
                      value={selectedSubOrder?.productId?.name || ""}
                      onChange={(e) =>
                        setSelectedSubOrder(
                          selectedOrder.cartItems.find(
                            (item) => item.productId.name === e.target.value
                          )
                        )
                      }
                    >
                      {selectedOrder.cartItems.map((item) => (
                        <option
                          key={item._id}
                          value={item?.productId?.name || "Unknown"}
                        >
                          {item?.productId?.name || "Unknown"}
                        </option>
                      ))}
                    </select>

                    {/* Download Invoice Button */}
                    <button
                      className="submit-btn"
                      onClick={handleLazyInvoiceDownload}
                    >
                      Download Invoice
                    </button>
                  </Box>
                </Box>

                {/* Order Summary */}
                <div className="order-card">
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                    className="order-card-title"
                  >
                    <Box>
                      <h2>Order Summary</h2>
                      <span
                        className="status paid"
                        style={{
                          backgroundColor:
                            selectedOrder.orderStatus === "Pending"
                              ? "#f8d7da"
                              : selectedOrder.orderStatus === "Delivered"
                              ? "#d4edda"
                              : "#FFE5B4",
                          color:
                            selectedOrder.orderStatus === "Pending"
                              ? "#721c24"
                              : selectedOrder.orderStatus === "Delivered"
                              ? "#155724"
                              : "#FF7518",
                        }}
                      >
                        {selectedOrder.orderStatus}
                      </span>
                    </Box>
                    <div className="progress-container-track">
                      {["Pending", "Confirmed", "Shipping", "Delivered"].map(
                        (step, i) => {
                          const isCompleted =
                            (selectedOrder.orderStatus === "Pending" &&
                              i === 0) ||
                            selectedOrder.orderStatus === "Shipped" ||
                            (selectedOrder.orderStatus === "Confirmed" &&
                              i <= 1) ||
                            selectedOrder.orderStatus === "Delivered";

                          return (
                            <div
                              key={i}
                              className={`progress-step ${
                                isCompleted ? "completed" : ""
                              }`}
                            >
                              <div
                                className={`step-circle-track ${
                                  isCompleted ? "completed" : ""
                                }`}
                              >
                                {step === "Pending" ? (
                                  <ShoppingCartIcon />
                                ) : step === "Confirmed" ? (
                                  <GiConfirmed />
                                ) : step === "Shipping" ? (
                                  <LocalShippingIcon />
                                ) : (
                                  <LuPackage />
                                )}
                              </div>
                              <span className="step-label-track">{step}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p>Subtotal:</p>
                    <p>{selectedOrder.subtotal.toLocaleString("en-us")} E£</p>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p>Shipping:</p>
                    <p>
                      {selectedOrder.shippingFee.toLocaleString("en-us")} E£
                    </p>
                  </Box>
                  <Box className="order-pays-subtotal">
                    <p className="total">Total:</p>
                    <p className="total">
                      {selectedOrder.total.toLocaleString("en-us")} E£
                    </p>
                  </Box>
                </div>

                {/* Order Items */}
                <div className="order-card">
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <h3 style={{ fontFamily: "Horizon", fontWeight: "bold" }}>
                        Order Item
                      </h3>
                      <h4>{selectedSubOrder.productId.name}</h4>
                      <span
                        className="status shipped"
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                          backgroundColor:
                            selectedOrder.orderStatus === "Pending"
                              ? "#f8d7da"
                              : selectedOrder.orderStatus === "Delivered"
                              ? "#d4edda"
                              : "#FFE5B4",
                          color:
                            selectedOrder.orderStatus === "Pending"
                              ? "#721c24"
                              : selectedOrder.orderStatus === "Delivered"
                              ? "#155724"
                              : "#FF7518",
                        }}
                      >
                        {selectedOrder.orderStatus}
                      </span>
                    </Box>
                    <Box
                      sx={{
                        paddingTop: "26px",
                        display: "flex",
                        gap: 2,
                        flexDirection: "column",
                        width: "60%",
                      }}
                    >
                      <a
                        href={`mailto:getsupport@thedesigngrit.com?subject=Support Request for Order ${
                          selectedOrder?._id || ""
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textAlign: "right",
                          color: "#6b7b58",
                        }}
                      >
                        Get Support?
                      </a>
                    </Box>
                  </Box>
                  <div className="item">
                    <div className="item-details">
                      <Box
                        className="suborder-item-details"
                        sx={{
                          display: "flex",
                          gap: "10px",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "10px",
                          margin: "auto",
                          position: "relative",
                        }}
                      >
                        {/* Info Icon - right side, opposite to image */}
                        {selectedSubOrder.productId && (
                          <a
                            href={`https://thedesigngrit.com/product/${selectedSubOrder.productId._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              position: "absolute",
                              top: 30,
                              right: 8,
                              color: "#2d2d2d",
                              textDecoration: "none",
                              zIndex: 2,
                            }}
                            title="View Product Page"
                          >
                            <InfoOutlinedIcon fontSize="medium" />
                          </a>
                        )}
                        <img
                          src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedSubOrder.productId.mainImage}`}
                          alt={selectedSubOrder.productId.name}
                          style={{
                            width: " 96px",
                            height: "93px",
                            borderRadius: "5px",
                          }}
                        />
                        <div className="trackorder-suborder-item-details">
                          <h5>{selectedSubOrder.productId.name}</h5>
                          <p>
                            {selectedSubOrder.totalPrice.toLocaleString(
                              "en-US"
                            )}{" "}
                            E£
                          </p>
                          <p>
                            <strong>Quantity: </strong>
                            {selectedSubOrder.quantity}
                          </p>
                        </div>
                      </Box>
                    </div>
                  </div>
                  {/* Review Trigger (stars) */}
                  <div
                    style={{
                      marginTop: 32,
                      padding: 16,
                      background: "#f9f9f9",
                      borderRadius: 8,
                    }}
                  >
                    <h4 style={{ marginBottom: 8 }}>
                      Write a Review for this Product
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <InteractiveStarRating
                        value={reviewRating}
                        onChange={(star) => {
                          setReviewRating(star);
                          setReviewHover(star);
                          setReviewDialogOpen(true);
                        }}
                        size={28}
                      />
                    </div>
                  </div>
                  {/* Review Popup Dialog */}
                  {reviewDialogOpen && (
                    <div className="review-form-overlay">
                      <div className="review-form-container">
                        <button
                          className="close-form-btn"
                          onClick={handleReviewDialogClose}
                          style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </button>
                        <h3>Write a Review</h3>
                        <form
                          onSubmit={handleSubmitReview}
                          className="review-form"
                        >
                          <div className="form-group">
                            <label>Rating</label>
                            <div className="star-rating">
                              <InteractiveStarRating
                                value={reviewRating}
                                onChange={setReviewRating}
                                size={28}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Your Review</label>
                            <textarea
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              required
                              className="review-textarea"
                              rows={4}
                            />
                          </div>
                          <div style={{ marginBottom: 8, color: "red" }}>
                            {reviewError}
                          </div>
                          {reviewSubmitted && (
                            <div style={{ color: "green", marginBottom: 8 }}>
                              Review submitted successfully!
                            </div>
                          )}
                          <button type="submit" className="submit-review-btn">
                            Submit Review
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "end",
                    }}
                  >
                    {shouldShowReturnButton && (
                      <button
                        className="submit-btn return-btn"
                        aria-label="Return order"
                        title="Return order"
                        onClick={handleReturnOrder}
                      >
                        <CiUndo />
                        Return Order
                      </button>
                    )}{" "}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Box>
      {/* Show Invoice in Modal or Full Screen */}
      {showInvoice && (
        <div className="invoice-modal">
          <p>Preparing your invoice...</p>
          <button onClick={openInvoiceInNewTab}>Open PDF</button>
          <button onClick={() => setShowInvoice(false)}>Close</button>
        </div>
      )}
      {/* Reason Dialog */}
      <Dialog
        open={showReasonDialog}
        onClose={() => setShowReasonDialog(false)}
        sx={{
          zIndex: 9999,
          position: "fixed",
          backdropFilter: "blur(4px)",
          "& .MuiPaper-root": {
            borderRadius: "16px",
            backdropFilter: "blur(5px)",
            backgroundColor: "#6b7b58",
          },
        }}
      >
        <DialogTitle
          style={{
            fontWeight: "normal",
            backgroundColor: "#6b7b58",
            color: "white",
            paddingLeft: "16px",
            border: "none",
          }}
        >
          Return Order Reason
        </DialogTitle>
        <DialogContent
          style={{
            fontWeight: "bold",
            backgroundColor: "#6b7b58",
            color: "white",
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            label="Reason for return"
            type="text"
            fullWidth
            variant="outlined"
            className="review-textarea"
            value={pendingReason}
            onChange={(e) => setPendingReason(e.target.value)}
            sx={{
              borderRadius: 1,
              input: { color: "#2d2d2d" },
              label: { fontSize: 18 },
            }}
            InputLabelProps={{ style: { fontSize: 18 } }}
            InputProps={{ style: { fontSize: 18, minHeight: 60 } }}
          />
        </DialogContent>
        <DialogActions
          style={{
            fontWeight: "bold",
            backgroundColor: "#6b7b58",
          }}
        >
          <Button
            onClick={() => setShowReasonDialog(false)}
            sx={{
              color: "white",
              border: "none",
              "&:hover": {
                backgroundColor: "#2d2d2d",
                border: "none",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReasonSubmit}
            sx={{
              color: "white",
              border: "none",
              "&:hover": {
                backgroundColor: "#2d2d2d",
                border: "none",
              },
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showReturnConfirm}
        title="Confirm Return Request"
        content={
          <>
            Are you sure you want to return this order?
            <br />
            <strong>Reason:</strong> {pendingReason}
          </>
        }
        onConfirm={handleConfirmReturn}
        onCancel={() => setShowReturnConfirm(false)}
      />
    </Box>
  );
}

export default TrackOrder;
