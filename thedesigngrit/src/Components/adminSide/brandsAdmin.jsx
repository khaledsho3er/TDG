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
  TextField,
  Tabs,
  Tab,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { FaTiktok } from "react-icons/fa";

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedBrand, setEditedBrand] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.thedesigngrit.com/api/brand/"
      );
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch brands",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCardClick = (brand) => {
    setSelectedBrand(brand);
    setOpenDialog(true);
    setEditMode(false);
    setEditedBrand(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBrand(null);
    setEditMode(false);
    setEditedBrand(null);
    setConfirmDelete(false);
  };

  const handleEditClick = () => {
    setEditMode(true);
    setEditedBrand({ ...selectedBrand });
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `https://api.thedesigngrit.com/api/brand/admin/brands/${selectedBrand._id}`
      );
      setSnackbar({
        open: true,
        message: "Brand deleted successfully",
        severity: "success",
      });
      fetchBrands();
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting brand:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete brand",
        severity: "error",
      });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBrand({
      ...editedBrand,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `https://api.thedesigngrit.com/api/brand/admin/brands/${selectedBrand._id}`,
        editedBrand
      );
      setSnackbar({
        open: true,
        message: "Brand updated successfully",
        severity: "success",
      });
      fetchBrands();
      setSelectedBrand(editedBrand);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating brand:", error);
      setSnackbar({
        open: true,
        message: "Failed to update brand",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const getActiveBrands = () => {
    return brands.filter((brand) => brand.status === "active");
  };

  const getPendingBrands = () => {
    return brands.filter((brand) => brand.status === "pending");
  };

  const renderBrandCards = (brandsList) => {
    return (
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
                image={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${brand.brandlogo}`}
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {brand.brandDescription.substring(0, 100)}...
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
  };

  const renderBrandDetails = () => {
    if (!selectedBrand) return null;

    return (
      <Box sx={{ p: 2 }}>
        {/* Cover Photo and Logo */}
        <Box sx={{ position: "relative", mb: 4 }}>
          <CardMedia
            component="img"
            height="200"
            image={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedBrand.coverPhoto}`}
            alt="Cover Photo"
            sx={{ borderRadius: 2 }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -40,
              left: 20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <img
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedBrand.brandlogo}`}
              alt={selectedBrand.brandName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </Box>

        {/* Social Media Links */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mb: 4,
            mt: 1,
          }}
        >
          {selectedBrand.facebookURL && (
            <IconButton
              color="primary"
              component="a"
              href={
                selectedBrand.facebookURL.startsWith("http")
                  ? selectedBrand.facebookURL
                  : `https://${selectedBrand.facebookURL}`
              }
              target="_blank"
            >
              <FacebookIcon />
            </IconButton>
          )}
          {selectedBrand.instagramURL && (
            <IconButton
              color="primary"
              component="a"
              href={
                selectedBrand.instagramURL.startsWith("http")
                  ? selectedBrand.instagramURL
                  : `https://${selectedBrand.instagramURL}`
              }
              target="_blank"
            >
              <InstagramIcon />
            </IconButton>
          )}
          {selectedBrand.tiktokURL && (
            <IconButton
              color="primary"
              component="a"
              href={
                selectedBrand.tiktokURL.startsWith("http")
                  ? selectedBrand.tiktokURL
                  : `https://${selectedBrand.tiktokURL}`
              }
              target="_blank"
            >
              <FaTiktok />
            </IconButton>
          )}
          {selectedBrand.linkedinURL && (
            <IconButton
              color="primary"
              component="a"
              href={
                selectedBrand.linkedinURL.startsWith("http")
                  ? selectedBrand.linkedinURL
                  : `https://${selectedBrand.linkedinURL}`
              }
              target="_blank"
            >
              <LinkedInIcon />
            </IconButton>
          )}
        </Box>

        {/* Brand Details */}
        <Grid container spacing={2}>
          {Object.entries(selectedBrand).map(([key, value]) => {
            // Skip these fields
            if (
              [
                "_id",
                "__v",
                "createdAt",
                "updatedAt",
                "brandlogo",
                "coverPhoto",
                "digitalCopiesLogo",
                "catalogues",
                "documents",
                "types",
              ].includes(key)
            ) {
              return null;
            }

            // Format URLs
            const isUrl = [
              "websiteURL",
              "instagramURL",
              "facebookURL",
              "tiktokURL",
              "linkedinURL",
            ].includes(key);

            return (
              <Grid item xs={12} sm={6} key={key}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </Typography>

                {editMode ? (
                  <TextField
                    fullWidth
                    name={key}
                    value={editedBrand[key] || ""}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    margin="dense"
                  />
                ) : (
                  <Typography variant="body1">
                    {isUrl && value ? (
                      <a
                        href={
                          value.startsWith("http") ? value : `https://${value}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1976d2", textDecoration: "none" }}
                      >
                        {value}
                      </a>
                    ) : (
                      value || "N/A"
                    )}
                  </Typography>
                )}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Brand Management
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={`Active Brands (${getActiveBrands().length})`} />
        <Tab label={`Pending Brands (${getPendingBrands().length})`} />
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {tabValue === 0 && renderBrandCards(getActiveBrands())}
          {tabValue === 1 && renderBrandCards(getPendingBrands())}
        </Box>
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
          {!confirmDelete ? (
            <>
              {editMode ? (
                <>
                  <Button onClick={() => setEditMode(false)} color="inherit">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveChanges}
                    className="approve-btn"
                    startIcon={<SaveIcon />}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleDeleteClick}
                    color="error"
                    startIcon={<DeleteIcon />}
                    className="reject-btn"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={handleEditClick}
                    className="approve-btn"
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Typography
                variant="body1"
                sx={{ flexGrow: 1, color: "error.main" }}
              >
                Are you sure you want to delete this brand?
              </Typography>
              <Button onClick={handleCancelDelete} color="inherit">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} className="reject-btn">
                Confirm Delete
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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

export default BrandManagement;
