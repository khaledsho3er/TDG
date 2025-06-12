import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  Menu,
  MenuItem,
  TextField,
  IconButton,
  Backdrop,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useVendor } from "../../utils/vendorContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import Cropper from "react-easy-crop";

const getCroppedImg = (imageSrc, croppedAreaPixels) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    };
  });
};

const BrandingPage = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [openLogoModal, setOpenLogoModal] = useState(false);
  const [openCoverModal, setOpenCoverModal] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    model: "",
    type: "",
    pdf: null,
    image: null,
  });

  // Add new state variables for cropping
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentCropType, setCurrentCropType] = useState(null); // 'logo' or 'cover'

  const { vendor } = useVendor();
  const brandId = vendor?.brandId;

  useEffect(() => {
    axios
      .get(`https://api.thedesigngrit.com/api/catalogs/${brandId}`)
      .then((res) => setCatalogs(res.data))
      .catch((err) => console.error("Error fetching catalogs:", err));
    // Fetch brand data (logo and cover)
    axios
      .get(`https://api.thedesigngrit.com/api/brand/${brandId}`)
      .then((res) => {
        setBrandData(res.data);
        if (res.data.brandlogo) {
          setPreviewLogo(
            `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${res.data.brandlogo}`
          );
        }
        if (res.data.coverPhoto) {
          setPreviewCover(
            `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${res.data.coverPhoto}`
          );
        }
      })
      .catch((err) => console.error("Error fetching brand data:", err));
  }, [brandId, brandData]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCatalog(null);
    setFormData({
      title: "",
      year: "",
      model: "",
      type: "",
      pdf: null,
      image: null,
    });
  };
  const handleOpenLogoModal = () => setOpenLogoModal(true);
  const handleCloseLogoModal = () => setOpenLogoModal(false);
  const handleOpenCoverModal = () => setOpenCoverModal(true);
  const handleCloseCoverModal = () => setOpenCoverModal(false);
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result);
      setPendingFile(file);
      setCurrentCropType("logo");
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result);
      setPendingFile(file);
      setCurrentCropType("cover");
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async () => {
    if (!selectedImageSrc || !croppedAreaPixels) return;

    try {
      const blob = await getCroppedImg(selectedImageSrc, croppedAreaPixels);
      const croppedFile = new File([blob], pendingFile.name, {
        type: "image/jpeg",
      });

      if (currentCropType === "logo") {
        setLogoFile(croppedFile);
        setPreviewLogo(URL.createObjectURL(blob));
      } else {
        setCoverFile(croppedFile);
        setPreviewCover(URL.createObjectURL(blob));
      }

      setShowCropModal(false);
      setPendingFile(null);
      setSelectedImageSrc(null);
      setCurrentCropType(null);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleBrandImageUpload = async () => {
    if (!logoFile && !coverFile) return;

    const formData = new FormData();
    if (logoFile) formData.append("brandlogo", logoFile);
    if (coverFile) formData.append("coverPhoto", coverFile);

    try {
      setLoading(true);
      const res = await axios.put(
        `https://api.thedesigngrit.com/api/brand/brands/${brandId}/update-images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setBrandData(res.data);
      setLogoFile(null);
      setCoverFile(null);
      handleCloseLogoModal();
      handleCloseCoverModal();
    } catch (error) {
      console.error("Failed to update brand images:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prevData) => ({ ...prevData, [type]: file }));
  };
  const handleInputChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpload = async () => {
    const data = new FormData();
    if (formData.pdf) data.append("pdf", formData.pdf);
    if (formData.image) data.append("image", formData.image);
    data.append("title", formData.title);
    data.append("year", formData.year);
    data.append("model", formData.model);
    data.append("type", formData.type);
    data.append("brandId", brandId);
    setLoading(true);

    const url = selectedCatalog
      ? `https://api.thedesigngrit.com/api/catalogs/${selectedCatalog.id}`
      : `https://api.thedesigngrit.com/api/catalogs/upload`;

    const method = selectedCatalog ? "put" : "post";

    try {
      const response = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (selectedCatalog) {
        setCatalogs(
          catalogs.map((c) =>
            c.id === selectedCatalog.id ? response.data.catalog : c
          )
        );
      } else {
        setCatalogs([...catalogs, { ...formData, id: response.data.id }]);
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, catalog) => {
    setAnchorEl(event.currentTarget);
    setSelectedCatalog(catalog);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    setFormData(selectedCatalog);
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://api.thedesigngrit.com/api/catalogs/${selectedCatalog.id}`
      );
      setCatalogs(catalogs.filter((c) => c.id !== selectedCatalog.id));
    } catch (error) {
      console.error("Error deleting catalog:", error);
    }
    handleMenuClose();
  };

  return (
    <div className="branding-page-form">
      <div className="dashboard-header-title" style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <h2>Branding</h2>
        </div>
        <p style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
          Home &gt; Branding
        </p>
      </div>
      {/* Brand Logo and Cover */}
      <Box sx={{ backgroundColor: "#fff", p: 3, mb: 3, borderRadius: "10px" }}>
        <Typography variant="h5" sx={{ fontFamily: "Horizon", mb: 2 }}>
          Brand Logo & Cover
        </Typography>

        <Box
          sx={{
            position: "relative",
            height: "300px",
            width: "100%",
            borderRadius: "8px",
            mb: 8,
          }}
        >
          {/* Cover Photo */}
          {previewCover ? (
            <img
              src={previewCover}
              alt="Cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f0f2f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>No cover photo</Typography>
            </Box>
          )}

          {/* Edit Cover Button */}
          <IconButton
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": {
                backgroundColor: "#2d2d2d !important",
              },
            }}
            onClick={handleOpenCoverModal}
          >
            <MdOutlineModeEdit color="white" />
          </IconButton>

          {/* Logo */}
          <Box
            sx={{
              position: "absolute",
              bottom: -64,
              left: 24,
              width: 128,
              height: 128,
              borderRadius: "50%",
              border: "4px solid white",
              backgroundColor: "white",
            }}
          >
            {previewLogo ? (
              <img
                src={previewLogo}
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f0f2f5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography>No logo</Typography>
              </Box>
            )}

            {/* Edit Logo Button */}
            <IconButton
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "rgba(255,255,255,0.8)",
                "&:hover": {
                  backgroundColor: "#2d2d2d !important",
                },
              }}
              onClick={handleOpenLogoModal}
            >
              <MdOutlineModeEdit color="white" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Catalogs Section */}
      <Box sx={{ backgroundColor: "#fff", p: 3, mb: 3, borderRadius: "10px" }}>
        <Typography variant="h5" sx={{ fontFamily: "Horizon", mb: 2 }}>
          Catalogs
        </Typography>
        <button
          className="submit-btn"
          onClick={handleOpenDialog}
          style={{
            "&:hover": {
              backgroundColor: "#2d2d2d !important",
            },
          }}
        >
          Upload Catalog
        </button>
        <div
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            marginTop: "20px",
          }}
        >
          {catalogs.map((catalog) => (
            <div key={catalog.id} style={{ position: "relative" }}>
              <a
                href={`https://pub-8c9ce55fbad6475eb1afe9472bd396e0.r2.dev/${catalog.pdf}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  style={{
                    width: "180px",
                    height: "220px",
                    backgroundImage: `url(https://pub-8c9ce55fbad6475eb1afe9472bd396e0.r2.dev/${catalog.image})`,
                    backgroundSize: "cover",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#fff",
                      color: "#2d2d2d",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontSize: "14px",
                      fontFamily: "Montserrat",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  >
                    {catalog.title}
                  </span>
                </div>
              </a>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  "&:hover": {
                    backgroundColor: "#2d2d2d !important",
                  },
                }}
                onClick={(e) => handleMenuOpen(e, catalog)}
              >
                <BsThreeDotsVertical />
              </IconButton>
            </div>
          ))}
        </div>
      </Box>

      {/* Upload/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <Box sx={{ p: 3, width: "400px" }}>
          <h3
            style={{
              textAlign: "center",
              fontFamily: "Horizon",
              color: "#2d2d2d",
            }}
          >
            {selectedCatalog ? "Edit Catalog" : "Upload Catalog"}
          </h3>

          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2 }}>
            <label>Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileChange(e, "pdf")}
            />
            <br />
            <label>Upload Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
            />
          </Box>

          <button className="submit-btn" onClick={handleUpload}>
            {selectedCatalog ? "Save Changes" : "Upload"}
          </button>
        </Box>
      </Dialog>
      {/* Logo Edit Modal */}
      <Dialog open={openLogoModal} onClose={handleCloseLogoModal}>
        <Box sx={{ p: 3, width: "400px" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Brand Logo
          </Typography>

          {previewLogo && (
            <img
              src={previewLogo}
              alt="Current Logo"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "300px",
                objectFit: "contain",
                marginBottom: "16px",
              }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ marginBottom: "16px" }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={handleCloseLogoModal}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleBrandImageUpload}
              disabled={!logoFile || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Cover Edit Modal */}
      <Dialog open={openCoverModal} onClose={handleCloseCoverModal}>
        <Box sx={{ p: 3, width: "400px" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Cover Photo
          </Typography>

          {previewCover && (
            <img
              src={previewCover}
              alt="Current Cover"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "300px",
                objectFit: "contain",
                marginBottom: "16px",
              }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            style={{ marginBottom: "16px" }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={handleCloseCoverModal}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleBrandImageUpload}
              disabled={!coverFile || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Add Crop Modal */}
      {showCropModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, // Higher than the Dialog component
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "800px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "400px",
                width: "100%",
                background: "#333",
              }}
            >
              <Cropper
                image={selectedImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={currentCropType === "logo" ? 1 : 16 / 4}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setCroppedAreaPixels(area)}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={handleCropComplete}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  backgroundColor: "#8A9A5B",
                  color: "white",
                }}
              >
                Crop Image
              </button>
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setPendingFile(null);
                  setSelectedImageSrc(null);
                  setCurrentCropType(null);
                }}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default BrandingPage;
