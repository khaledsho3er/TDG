import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  Menu,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useVendor } from "../../utils/vendorContext"; // Import vendor context
import { BsThreeDotsVertical } from "react-icons/bs";

const BrandingPage = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    model: "",
    type: "",
    pdf: null,
    image: null,
  });
  const { vendor } = useVendor(); // Get vendor from context
  const brandId = vendor?.brandId; // Ensure brandId is available

  useEffect(() => {
    axios
      .get(`https://tdg-db.onrender.com/api/catalogs/${brandId}`)
      .then((res) => setCatalogs(res.data))
      .catch((err) => console.error("Error fetching catalogs:", err));
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

  // Handle file selection for both PDF and image
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
    if (formData.file) data.append("pdf", formData.file);
    if (formData.image) data.append("image", formData.image);
    data.append("title", formData.title);
    data.append("year", formData.year);
    data.append("model", formData.model);
    data.append("type", formData.type);
    data.append("brandId", brandId);

    try {
      const response = await axios.post(
        "https://tdg-db.onrender.com/api/catalogs/upload",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setCatalogs([...catalogs, { ...formData, id: response.data.id }]);
      handleCloseDialog();
    } catch (error) {
      console.error("Upload failed:", error);
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
        `https://tdg-db.onrender.com/api/catalogs/${selectedCatalog.id}`
      );
      setCatalogs(catalogs.filter((c) => c.id !== selectedCatalog.id));
    } catch (error) {
      console.error("Error deleting catalog:", error);
    }
    handleMenuClose();
  };

  return (
    <div className="branding-page-form">
      <h2>Branding Page</h2>
      <Box
        sx={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          minHeight: "200px",
        }}
      >
        <button className="submit-btn" onClick={handleOpenDialog}>
          Upload Catalog
        </button>
        <div
          className="catalogs-container"
          style={{ display: "flex", overflowX: "auto", marginTop: "20px" }}
        >
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              style={{ position: "relative", marginRight: "10px" }}
            >
              <a
                href={`https://pub-8c9ce55fbad6475eb1afe9472bd396e0.r2.dev/${catalog.pdf}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    width: "180px",
                    height: "220px",
                    backgroundImage: `url(https://pub-8c9ce55fbad6475eb1afe9472bd396e0.r2.dev/${catalog.image})`,
                    backgroundSize: "cover",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#fff",
                      color: "#2d2d2d",
                      fontFamily: "Montserrat",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      textDecoration: "none",
                      fontSize: "14px",
                      border: "1px solid #2d2d2d",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    {catalog.title}
                  </span>
                </div>
              </a>
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                sx={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  backgroundColor: "transparent",
                  color: "#2d2d2d",
                }}
                onClick={(e) => handleMenuOpen(e, catalog)}
              >
                <BsThreeDotsVertical
                  style={{ fontSize: "12px", backgroundColor: "transparent" }}
                />
              </IconButton>
            </div>
          ))}
        </div>
      </Box>

      {/* Upload Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <Box padding={3}>
          <h3
            style={{
              color: "#2d2d2d",
              fontFamily: "Horizon",
              textAlign: "center",
              fontWeight: "bold",
              padding1: "15px",
            }}
          >
            {selectedCatalog ? "Edit Catalog" : "Upload Catalog"}
          </h3>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="year"
            label="Year"
            value={formData.year}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="model"
            label="Model"
            value={formData.model}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="type"
            label="Type"
            value={formData.type}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <label>Upload PDF:</label>
          <input
            type="file"
            accept=".pdf"
            name="pdf"
            onChange={(e) => handleFileChange(e, "file")}
          />
          <label>Upload Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "image")}
          />
          <button className="submit-btn" onClick={handleUpload}>
            {selectedCatalog ? "Update" : "Upload"}
          </button>
        </Box>
      </Dialog>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default BrandingPage;
