import React, { useState, useEffect, useRef } from "react";
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
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  PhotoCamera,
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
  const [newLogoFile, setNewLogoFile] = useState(null);
  const [newCoverFile, setNewCoverFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    // Reset image previews when selected brand changes
    if (selectedBrand) {
      setLogoPreview(
        selectedBrand.brandlogo
          ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedBrand.brandlogo}`
          : null
      );
      setCoverPreview(
        selectedBrand.coverPhoto
          ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedBrand.coverPhoto}`
          : null
      );
    }
  }, [selectedBrand]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.thedesigngrit.com/api/brand/"
      );

      // Add timestamp to image URLs to prevent caching
      const brandsWithTimestamp = response.data.map((brand) => ({
        ...brand,
        brandlogo: brand.brandlogo ? `${brand.brandlogo}?t=${Date.now()}` : "",
        coverPhoto: brand.coverPhoto
          ? `${brand.coverPhoto}?t=${Date.now()}`
          : "",
      }));

      setBrands(brandsWithTimestamp);
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
    setNewLogoFile(null);
    setNewCoverFile(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBrand(null);
    setEditMode(false);
    setEditedBrand(null);
    setConfirmDelete(false);
    setNewLogoFile(null);
    setNewCoverFile(null);
    setLogoPreview(null);
    setCoverPreview(null);
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

  const handleLogoClick = () => {
    if (editMode) {
      logoInputRef.current.click();
    }
  };

  const handleCoverClick = () => {
    if (editMode) {
      coverInputRef.current.click();
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateImages = async () => {
    if (!newLogoFile && !newCoverFile) return;

    try {
      setImageLoading(true);
      const formData = new FormData();

      if (newLogoFile) {
        formData.append("brandlogo", newLogoFile);
        console.log(
          "Adding logo file:",
          newLogoFile.name,
          newLogoFile.type,
          newLogoFile.size
        );
      }

      if (newCoverFile) {
        formData.append("coverPhoto", newCoverFile);
        console.log(
          "Adding cover file:",
          newCoverFile.name,
          newCoverFile.type,
          newCoverFile.size
        );
      }

      // Log the FormData contents (for debugging)
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      console.log(
        "Sending request to:",
        `https://api.thedesigngrit.com/api/brand/${selectedBrand._id}/media`
      );

      const response = await axios.put(
        `https://api.thedesigngrit.com/api/brand/${selectedBrand._id}/media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Full response:", response);
      console.log("Image update response data:", response.data);

      // Check if the response contains the expected fields
      if (response.data) {
        console.log("Response brandlogo:", response.data.brandlogo);
        console.log("Response coverPhoto:", response.data.coverPhoto);

        // Force refresh from API
        fetchBrands();

        // Update the selected brand with new image paths from response
        const updatedBrand = {
          ...selectedBrand,
          brandlogo: response.data.brandlogo || selectedBrand.brandlogo,
          coverPhoto: response.data.coverPhoto || selectedBrand.coverPhoto,
        };

        console.log("Updated brand object:", updatedBrand);
        setSelectedBrand(updatedBrand);

        // Force refresh the image previews with cache-busting
        if (response.data.brandlogo) {
          const newLogoUrl = `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${
            response.data.brandlogo
          }?t=${Date.now()}`;
          console.log("Setting new logo URL:", newLogoUrl);
          setLogoPreview(newLogoUrl);
        }

        if (response.data.coverPhoto) {
          const newCoverUrl = `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${
            response.data.coverPhoto
          }?t=${Date.now()}`;
          console.log("Setting new cover URL:", newCoverUrl);
          setCoverPreview(newCoverUrl);
        }

        setSnackbar({
          open: true,
          message: "Brand images updated successfully",
          severity: "success",
        });
      } else {
        console.error("Response data is missing expected fields");
        setSnackbar({
          open: true,
          message: "Response data is missing expected fields",
          severity: "error",
        });
      }

      // Reset file states
      setNewLogoFile(null);
      setNewCoverFile(null);
    } catch (error) {
      console.error("Error updating brand images:", error);
      console.error("Error details:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message:
          "Failed to update brand images: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
    } finally {
      setImageLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      // First update the brand data
      await axios.put(
        `https://api.thedesigngrit.com/api/brand/admin/brands/${selectedBrand._id}`,
        editedBrand
      );
      console.log("Brand data update response:", editedBrand);
      // Then update images if needed
      if (newLogoFile || newCoverFile) {
        await handleUpdateImages();
      }

      setSnackbar({
        open: true,
        message: "Brand updated successfully",
        severity: "success",
      });

      fetchBrands();
      setSelectedBrand({
        ...editedBrand,
        brandlogo: selectedBrand.brandlogo,
        coverPhoto: selectedBrand.coverPhoto,
      });
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

  const getDeactiveBrands = () => {
    return brands.filter((brand) => brand.status === "deactivated");
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
                image={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${
                  brand.brandlogo
                }?t=${Date.now()}`}
                alt={brand.brandName}
                key={brand._id + Date.now()} // Add key to force re-render
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

    // Generate unique timestamp to force image refresh
    const timestamp = Date.now();
    const logoUrl =
      logoPreview ||
      `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedBrand.brandlogo}?t=${timestamp}`;
    const coverUrl =
      coverPreview ||
      `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedBrand.coverPhoto}?t=${timestamp}`;

    return (
      <Box sx={{ p: 2 }}>
        {/* Cover Photo and Logo */}
        <Box sx={{ position: "relative", mb: 4 }}>
          {/* Cover Photo */}
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="200"
              image={coverUrl}
              alt="Cover Photo"
              sx={{
                borderRadius: 2,
                cursor: editMode ? "pointer" : "default",
                "&:hover": editMode
                  ? {
                      opacity: 0.8,
                    }
                  : {},
              }}
              onClick={handleCoverClick}
            />
            {editMode && (
              <Tooltip title="Change Cover Photo">
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                    },
                  }}
                  onClick={handleCoverClick}
                >
                  <PhotoCamera />
                </IconButton>
              </Tooltip>
            )}
            <input
              type="file"
              ref={coverInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleCoverChange}
            />
          </Box>

          {/* Logo */}
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
              cursor: editMode ? "pointer" : "default",
            }}
            onClick={handleLogoClick}
          >
            <img
              src={logoUrl}
              alt={selectedBrand.brandName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {editMode && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                <PhotoCamera sx={{ color: "white" }} />
              </Box>
            )}
            <input
              type="file"
              ref={logoInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleLogoChange}
            />
          </Box>
        </Box>

        {/* Image Update Button - Only show when in edit mode and images have changed */}
        {editMode && (newLogoFile || newCoverFile) && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateImages}
              disabled={imageLoading}
              startIcon={imageLoading ? <CircularProgress size={20} /> : null}
            >
              {imageLoading ? "Updating Images..." : "Update Images"}
            </Button>
          </Box>
        )}

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
                  key === "status" ? (
                    <TextField
                      select
                      fullWidth
                      name={key}
                      value={editedBrand[key] || ""}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      margin="dense"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="deactivated">Deactivated</option>
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      name={key}
                      value={editedBrand[key] || ""}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      margin="dense"
                    />
                  )
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
                    ) : key === "status" ? (
                      <span
                        style={{
                          color:
                            value === "active"
                              ? "green"
                              : value === "pending"
                              ? "orange"
                              : "red",
                          fontWeight: "500",
                        }}
                      >
                        {value || "N/A"}
                      </span>
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

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          "& .MuiTab-root:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Tab label={`Active Brands (${getActiveBrands().length})`} />
        <Tab label={`Pending Brands (${getPendingBrands().length})`} />
        <Tab label={`Deactivated Brands (${getDeactiveBrands().length})`} />
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {tabValue === 0 && renderBrandCards(getActiveBrands())}
          {tabValue === 1 && renderBrandCards(getPendingBrands())}
          {tabValue === 2 && renderBrandCards(getDeactiveBrands())}
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
