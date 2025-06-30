import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const PendingProductUpdates = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.thedesigngrit.com/api/admin/products/pending"
      );
      setPendingProducts(response.data || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch pending products",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleApprove = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    try {
      await axios.patch(
        `https://api.thedesigngrit.com/api/admin/products/approve/${selectedProduct._id}`
      );
      setSnackbar({
        open: true,
        message: "Product update approved",
        severity: "success",
      });
      fetchPendingProducts();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to approve update",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    try {
      await axios.patch(
        `https://api.thedesigngrit.com/api/admin/products/reject/${selectedProduct._id}`
      );
      setSnackbar({
        open: true,
        message: "Product update rejected",
        severity: "success",
      });
      fetchPendingProducts();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to reject update",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper to safely render any value (stringify objects)
  const renderValue = (val) => {
    if (val === null || val === undefined) return "N/A";
    if (typeof val === "object") return JSON.stringify(val, null, 2);
    return val;
  };

  const renderFieldDiff = (field, current, pending) => {
    if (JSON.stringify(current) === JSON.stringify(pending)) {
      return <Typography variant="body1">{renderValue(current)}</Typography>;
    }
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          Current: {renderValue(current)}
        </Typography>
        <Typography variant="body2" color="primary">
          Pending: {renderValue(pending)}
        </Typography>
      </Box>
    );
  };

  const renderProductCards = (productsList) => (
    <Grid container spacing={3}>
      {productsList.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              },
            }}
            onClick={() => handleCardClick(product)}
          >
            <CardMedia
              component="img"
              height="140"
              image={
                product.mainImage
                  ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`
                  : "https://via.placeholder.com/140x140?text=No+Image"
              }
              alt={product.name}
              sx={{
                objectFit: "contain",
                padding: 2,
                backgroundColor: "#f5f5f5",
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {product.description?.substring(0, 100)}...
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>SKU:</strong> {product.sku}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Stock:</strong> {product.stock}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Price:</strong> {product.price}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderProductDetails = () => {
    if (!selectedProduct) return null;
    const { pendingUpdates = {}, ...currentProduct } = selectedProduct;
    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {Object.keys(pendingUpdates).length === 0 ? (
            <Typography>No pending updates for this product.</Typography>
          ) : (
            Object.entries(pendingUpdates).map(([key, pendingValue]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Typography>
                {renderFieldDiff(key, currentProduct[key], pendingValue)}
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pending Product Updates
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress size={60} thickness={4} sx={{ color: "#6b7b58" }} />
        </Box>
      ) : pendingProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="h6" color="text.secondary">
            No product updates pending approval.
          </Typography>
        </Box>
      ) : (
        <Box>{renderProductCards(pendingProducts)}</Box>
      )}
      {/* Product Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {selectedProduct?.name}
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{renderProductDetails()}</DialogContent>
        <DialogActions>
          <Button onClick={handleReject} color="error" disabled={actionLoading}>
            {actionLoading ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            onClick={handleApprove}
            color="primary"
            disabled={actionLoading}
          >
            {actionLoading ? "Approving..." : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PendingProductUpdates;
