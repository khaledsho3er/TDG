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

const PendingBrandUpdates = () => {
  const [pendingBrands, setPendingBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchPendingBrands();
  }, []);

  const fetchPendingBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.thedesigngrit.com/api/brand/admin/brands/pending"
      );
      setPendingBrands(response.data || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch pending brands",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (brand) => {
    setSelectedBrand(brand);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBrand(null);
  };

  const handleApprove = async () => {
    if (!selectedBrand) return;
    setActionLoading(true);
    try {
      await axios.put(
        `https://api.thedesigngrit.com/api/brand/admin/brands/${selectedBrand._id}/approve`
      );
      setSnackbar({
        open: true,
        message: "Brand update approved",
        severity: "success",
      });
      fetchPendingBrands();
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
    if (!selectedBrand) return;
    setActionLoading(true);
    try {
      await axios.put(
        `https://api.thedesigngrit.com/api/brand/admin/brands/${selectedBrand._id}/reject`
      );
      setSnackbar({
        open: true,
        message: "Brand update rejected",
        severity: "success",
      });
      fetchPendingBrands();
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

  // Helper to check if a field is an image (by key or value)
  const isImageField = (key, value) => {
    const imageFields = ["brandlogo", "coverPhoto", "logo", "image", "photo"];
    const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".avif"];
    if (imageFields.includes(key)) return true;
    if (typeof value === "string") {
      return imageExtensions.some((ext) => value.toLowerCase().endsWith(ext));
    }
    return false;
  };

  // Helper to render an image if value is a filename
  const renderImage = (filename, alt) => {
    if (!filename) return "N/A";
    return (
      <img
        src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${filename}`}
        alt={alt}
        style={{
          maxWidth: 120,
          maxHeight: 80,
          display: "block",
          margin: "8px 0",
          borderRadius: 6,
          border: "1px solid #eee",
        }}
      />
    );
  };

  const renderFieldDiff = (field, current, pending) => {
    if (isImageField(field, current) || isImageField(field, pending)) {
      return (
        <Box>
          <Typography variant="body2" color="text.secondary">
            Current:
          </Typography>
          {renderImage(current, "Current")}
          <Typography variant="body2" color="primary">
            Pending:
          </Typography>
          {renderImage(pending, "Pending")}
        </Box>
      );
    }
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

  const renderBrandCards = (brandsList) => (
    <Grid container spacing={3}>
      {brandsList.map((brand) => (
        <Grid item xs={12} sm={6} md={4} key={brand._id}>
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
            onClick={() => handleCardClick(brand)}
          >
            <CardMedia
              component="img"
              height="140"
              image={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${
                brand.brandlogo
              }?t=${Date.now()}`}
              alt={brand.brandName}
              sx={{
                objectFit: "contain",
                padding: 2,
                backgroundColor: "#f5f5f5",
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="div">
                {brand.brandName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {brand.brandDescription?.substring(0, 100)}...
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>Address:</strong> {brand.companyAddress}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Phone:</strong> {brand.phoneNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {brand.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderBrandDetails = () => {
    if (!selectedBrand) return null;
    const { pendingUpdates = {}, ...currentBrand } = selectedBrand;
    // Show all fields in pendingUpdates
    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {Object.keys(pendingUpdates).length === 0 ? (
            <Typography>No pending updates for this brand.</Typography>
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
                {renderFieldDiff(key, currentBrand[key], pendingValue)}
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
        Pending Brand Updates
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress size={60} thickness={4} sx={{ color: "#6b7b58" }} />
        </Box>
      ) : pendingBrands.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="h6" color="text.secondary">
            No brand updates pending approval.
          </Typography>
        </Box>
      ) : (
        <Box>{renderBrandCards(pendingBrands)}</Box>
      )}
      {/* Brand Details Dialog */}
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
          {selectedBrand?.brandName}
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{renderBrandDetails()}</DialogContent>
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

export default PendingBrandUpdates;
