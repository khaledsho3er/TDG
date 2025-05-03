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

const BrandingPage = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    model: "",
    type: "",
    pdf: null,
    image: null,
  });

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
      .then((res) => setBrandData(res.data))
      .catch((err) => console.error("Error fetching brand data:", err));
  }, [brandId]);

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

  const handleBrandImageUpload = async () => {
    if (!logoFile && !coverFile) return;

    const formData = new FormData();
    if (logoFile) formData.append("brandLogo", logoFile);
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
    } catch (error) {
      console.error("Failed to update brand images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="branding-page-form">
      <h2>Branding Page</h2>
      {/* Brand Logo and Cover */}
      <Box sx={{ backgroundColor: "#fff", p: 3, mb: 3, borderRadius: "10px" }}>
        <Typography variant="h5" sx={{ fontFamily: "Horizon" }}>
          Brand Logo & Cover
        </Typography>

        <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
          <Box>
            <Typography>Current Logo</Typography>
            {brandData?.brandLogo && (
              <img
                src={brandData.brandLogo}
                alt="Logo"
                style={{ width: "120px", height: "auto", borderRadius: 8 }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "logo")}
              style={{ marginTop: 8 }}
            />
          </Box>

          <Box>
            <Typography>Current Cover</Typography>
            {brandData?.coverPhoto && (
              <img
                src={brandData.coverPhoto}
                alt="Cover"
                style={{
                  width: "200px",
                  height: "auto",
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "cover")}
              style={{ marginTop: 8 }}
            />
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleBrandImageUpload}
          sx={{ mt: 3 }}
        >
          Save Brand Images
        </Button>
      </Box>
      {/* Catalogs Section */}
      <Box sx={{ backgroundColor: "#fff", p: 3, borderRadius: "10px" }}>
        <h2 style={{ fontFamily: "Horizon", color: "#2d2d2d" }}>Catalogs</h2>
        <button className="submit-btn" onClick={handleOpenDialog}>
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
                sx={{ position: "absolute", top: 5, right: 5 }}
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
