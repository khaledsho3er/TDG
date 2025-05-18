import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const PromotionsPageAdmin = () => {
  const [currentPromotions, setCurrentPromotions] = useState([]);
  const [pastPromotions, setPastPromotions] = useState([]);
  const [futurePromotions, setFuturePromotions] = useState([]);
  const [showCurrentSection, setShowCurrentSection] = useState(true);
  const [showPastSection, setShowPastSection] = useState(false);
  const [showFutureSection, setShowFutureSection] = useState(false);
  const [promotionMetrics, setPromotionMetrics] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(""); // NEW
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  // Approval related states
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchPromotions();
  }, []);
  const fetchPromotions = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      // Fetch all products with promotions
      const response = await axios.get(
        "https://api.thedesigngrit.com/api/products/admin/products-promotions"
      );
      console.log(response.data);
      // Separate current, past, and future promotions
      const now = new Date();

      const current = response.data.filter(
        (product) =>
          product.promotionStartDate &&
          product.promotionEndDate &&
          new Date(product.promotionStartDate) <= now &&
          new Date(product.promotionEndDate) >= now
      );

      const past = response.data.filter(
        (product) =>
          product.promotionStartDate &&
          product.promotionEndDate &&
          new Date(product.promotionEndDate) < now
      );

      const future = response.data.filter(
        (product) =>
          product.promotionStartDate &&
          product.promotionEndDate &&
          new Date(product.promotionStartDate) > now
      );

      setCurrentPromotions(current);
      setPastPromotions(past);
      setFuturePromotions(future);

      // Fetch promotion metrics
      const metricsResponse = await axios.get(
        "https://api.thedesigngrit.com/api/products/admin/products-promotion-metrics"
      );
      setPromotionMetrics(metricsResponse.data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setIsLoading(false); // Set loading to false when fetching completes
    }
  };
  const calculatePromotionMetrics = (product) => {
    const metrics = promotionMetrics.find(
      (metric) => metric.productId === (product._id || product.productId)
    );

    if (metrics) {
      return {
        unitsSoldBefore: metrics.unitsSoldBefore,
        unitsSoldDuring: metrics.unitsSoldDuring,
        turnoverBefore: metrics.turnoverBefore,
        turnoverDuring: metrics.turnoverDuring,
        salesUpliftPercent: metrics.salesUpliftPercent,
      };
    }

    return {
      unitsSoldBefore: 0,
      unitsSoldDuring: 0,
      turnoverBefore: 0,
      turnoverDuring: 0,
      salesUpliftPercent: 0,
    };
  };

  const handleProductClick = (productId) => {
    window.open(`/product/${productId}`, "_blank");
  };
  // Open approval dialog
  const handleOpenApprovalDialog = (product, e) => {
    e.stopPropagation(); // Prevent navigation to product page
    setSelectedPromotion(product);
    setApprovalDialogOpen(true);
  };

  // Handle approve action
  const handleApprove = async () => {
    try {
      await axios.put(
        `https://api.thedesigngrit.com/api/promotions/approval/${selectedPromotion._id}`,
        { promotionApproved: true }
      );

      // Close dialog and refresh data
      setApprovalDialogOpen(false);
      fetchPromotions();
      alert("Promotion approved successfully");
    } catch (error) {
      console.error("Error approving promotion:", error);
      alert("Failed to approve promotion");
    }
  };

  // Open rejection dialog
  const handleOpenRejectionDialog = () => {
    setApprovalDialogOpen(false);
    setRejectionDialogOpen(true);
  };

  // Handle reject action
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      await axios.put(
        `https://api.thedesigngrit.com/api/promotions/approval/${selectedPromotion._id}`,
        {
          promotionApproved: false,
          promotionRejectedNote: rejectionReason,
        }
      );

      // Close dialog, reset form and refresh data
      setRejectionDialogOpen(false);
      setRejectionReason("");
      fetchPromotions();
      alert("Promotion rejected successfully");
    } catch (error) {
      console.error("Error rejecting promotion:", error);
      alert("Failed to reject promotion");
    }
  };

  const renderPromotionCard = (product, showMetrics = false) => {
    const metrics = showMetrics ? calculatePromotionMetrics(product) : null;
    const discountAmount = product.price - product.salePrice;
    const discountPercent =
      product.discountPercentage ||
      Math.round((discountAmount / product.price) * 100);

    return (
      <div
        className="promotion-card"
        key={product._id}
        onClick={() => handleProductClick(product._id)}
      >
        <div className="promotion-image-container">
          <img
            src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
            alt={product.name}
            className="promotion-image"
          />
          <div className="discount-badge">{discountPercent}% OFF</div>
          {/* Review button for pending promotions */}
          {(!product.promotionApproved ||
            product.promotionApproved === false) && (
            <button
              onClick={(e) => handleOpenApprovalDialog(product, e)}
              style={{
                position: "absolute",
                top: "30px",
                right: "10px",
                padding: "4px 8px",
                borderRadius: "4px",
                backgroundColor: "#2d2d2d",
                color: "white",
                border: "none",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              Review
            </button>
          )}
        </div>

        <div className="promotion-details">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div className="promotion-details">
              <h3>{product.name}</h3>
              <p className="brand-name">{product.brandId?.brandName}</p>
              <div className="price-container">
                <span className="original-price">E£{product.price}</span>
                <span className="sale-price">E£{product.salePrice}</span>
              </div>
            </div>
            <div>
              {product.promotionApproved !== undefined && (
                <div
                  className="approval-status"
                  style={{
                    backgroundColor: product.promotionApproved
                      ? "#d4edda"
                      : "#f8d7da",
                    color: product.promotionApproved ? "#155724" : "#721c24",
                    border: product.promotionApproved
                      ? "none"
                      : "1px solid #721c24",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  {product.promotionApproved ? "APPROVED" : "REJECTED"}
                </div>
              )}
            </div>
          </div>
          {showMetrics && metrics && (
            <div className="metrics-container">
              <div className="metric">
                <span className="metric-label">Sales Before</span>
                <span className="metric-value">{metrics.unitsSoldBefore}</span>
                <span className="metric-label">Unit Sold During Sale</span>
                <span className="metric-value">{metrics.unitsSoldDuring}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Sales Uplift %</span>
                <span className="metric-value">
                  {metrics.salesUpliftPercent}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Turnover Before</span>
                <span className="metric-value">+{metrics.turnoverBefore}%</span>
                <span className="metric-label">During sale</span>
                <span className="metric-value">+{metrics.turnoverDuring}%</span>
              </div>
            </div>
          )}

          {!showMetrics && (
            <div className="promotion-dates">
              {new Date(product.promotionStartDate).toLocaleDateString()} -
              {new Date(product.promotionEndDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    );
  };
  const filterPromotions = (promotions) => {
    if (!selectedBrand) return promotions;
    return promotions.filter(
      (product) => product.brandId?.brandName === selectedBrand
    );
  };
  const uniqueBrands = Array.from(
    new Map(
      [...currentPromotions, ...futurePromotions, ...pastPromotions]
        .filter((product) => product.brandId) // Make sure brand exists
        .map((product) => [product.brandId._id, product.brandId])
    ).values()
  );

  return (
    <div className="promotions-page-container">
      <div className="promotions-content">
        <div className="promotions-header">
          <h1>Promotions</h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              marginBottom: "20px",
            }}
          >
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="brand-select-label">Brand</InputLabel>
              <Select
                labelId="brand-select-label"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                sx={{
                  width: "200px",
                  color: "#2d2d2d",
                  backgroundColor: "#fff",
                }}
              >
                <MenuItem value="">All Brands</MenuItem>
                {uniqueBrands.map((brand) => (
                  <MenuItem key={brand._id} value={brand.brandName}>
                    {brand.brandName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              width: "100%",
            }}
          >
            <CircularProgress
              size={60}
              thickness={4}
              sx={{ color: "#6b7b58" }}
            />
          </Box>
        ) : (
          <>
            {/* Current Promotions Section */}
            <div className="promotion-section">
              <div
                className="section-header"
                onClick={() => setShowCurrentSection((prev) => !prev)}
              >
                <h2>Current Promotions</h2>
                <span className="toggle-icon">
                  {showCurrentSection ? <AiOutlineUp /> : <AiOutlineDown />}
                </span>
              </div>

              {showCurrentSection && (
                <div className="promotion-grid">
                  {filterPromotions(currentPromotions).length === 0 ? (
                    <p className="no-promotions">
                      {selectedBrand
                        ? "No active promotions for this brand."
                        : "No active promotions."}
                    </p>
                  ) : (
                    filterPromotions(currentPromotions).map((product) =>
                      renderPromotionCard(product, true)
                    )
                  )}
                </div>
              )}
            </div>

            {/* Future Promotions Section */}
            <div className="promotion-section">
              <div
                className="section-header"
                onClick={() => setShowFutureSection((prev) => !prev)}
              >
                <h2>Upcoming Promotions</h2>
                <span className="toggle-icon">
                  {showFutureSection ? <AiOutlineUp /> : <AiOutlineDown />}
                </span>
              </div>

              {showFutureSection && (
                <div className="promotion-grid">
                  {filterPromotions(futurePromotions).length === 0 ? (
                    <p className="no-promotions">
                      {selectedBrand
                        ? "No upcoming promotions for this brand."
                        : "No upcoming promotions."}{" "}
                    </p>
                  ) : (
                    filterPromotions(futurePromotions).map((product) =>
                      renderPromotionCard(product)
                    )
                  )}
                </div>
              )}
            </div>

            {/* Past Promotions Section */}
            <div className="promotion-section">
              <div
                className="section-header"
                onClick={() => setShowPastSection((prev) => !prev)}
              >
                <h2>Past Promotions</h2>
                <span className="toggle-icon">
                  {showPastSection ? <AiOutlineUp /> : <AiOutlineDown />}
                </span>
              </div>

              {showPastSection && (
                <div className="promotion-grid">
                  {filterPromotions(pastPromotions).length === 0 ? (
                    <p className="no-promotions">
                      No past promotions available.
                    </p>
                  ) : (
                    filterPromotions(pastPromotions).map((product) =>
                      renderPromotionCard(product, true)
                    )
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      {/* Promotion Approval Dialog */}
      <Dialog
        open={approvalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Review Promotion
          <IconButton
            aria-label="close"
            onClick={() => setApprovalDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPromotion && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <img
                  src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedPromotion.mainImage}`}
                  alt={selectedPromotion.name}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="h6" gutterBottom>
                  {selectedPromotion.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Brand: {selectedPromotion.brandId?.brandName}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Promotion Details:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Original Price:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      E£{selectedPromotion.price}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Sale Price:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="error">
                      E£{selectedPromotion.salePrice}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Discount:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="error">
                      {selectedPromotion.discountPercentage ||
                        Math.round(
                          ((selectedPromotion.price -
                            selectedPromotion.salePrice) /
                            selectedPromotion.price) *
                            100
                        )}
                      %
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Promotion Period:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Start Date:</Typography>
                    <Typography variant="body2">
                      {new Date(
                        selectedPromotion.promotionStartDate
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">End Date:</Typography>
                    <Typography variant="body2">
                      {new Date(
                        selectedPromotion.promotionEndDate
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Duration:</Typography>
                    <Typography variant="body2">
                      {Math.ceil(
                        (new Date(selectedPromotion.promotionEndDate) -
                          new Date(selectedPromotion.promotionStartDate)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleOpenRejectionDialog}
          >
            Reject
          </Button>
          <Button variant="contained" color="success" onClick={handleApprove}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
      {/* Rejection Reason Dialog */}
      <Dialog
        open={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Provide Rejection Reason
          <IconButton
            aria-label="close"
            onClick={() => setRejectionDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this promotion. This will be
            sent to the vendor.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="rejection-reason"
            label="Rejection Reason"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setRejectionDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
          >
            Reject Promotion
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PromotionsPageAdmin;
