import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, Menu, MenuItem, TextField } from "@mui/material";
import axios from "axios";
import { useVendor } from "../../utils/vendorContext"; // Import vendor context

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
    file: null,
  });
  const { vendor } = useVendor(); // Get vendor from context
  const brandId = vendor.brandId; // Example brandId, replace with dynamic value

  useEffect(() => {
    axios
      .get(`https://tdg-db.onrender.com/api/catalogues/${brandId}`)
      .then((res) => setCatalogs(res.data));
  }, [brandId]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCatalog(null);
    setFormData({ title: "", year: "", model: "", type: "", file: null });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async () => {
    const data = new FormData();
    data.append("file", formData.file);
    data.append("title", formData.title);
    data.append("year", formData.year);
    data.append("model", formData.model);
    data.append("type", formData.type);
    data.append("brandId", brandId);

    await axios.post("https://tdg-db.onrender.com/api/catalogues/upload", data);
    setCatalogs([...catalogs, { ...formData, id: Date.now() }]);
    handleCloseDialog();
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
    await axios.delete(
      `https://tdg-db.onrender.com/api/catalogues/${selectedCatalog.id}`
    );
    setCatalogs(catalogs.filter((c) => c.id !== selectedCatalog.id));
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
        <Button variant="contained" onClick={handleOpenDialog}>
          Upload Catalog
        </Button>
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
                href={catalog.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  style={{
                    width: "120px",
                    height: "160px",
                    background: "#ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {catalog.title}
                </div>
              </a>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={(e) => handleMenuOpen(e, catalog)}
              >
                ⋮
              </Button>
            </div>
          ))}
        </div>
      </Box>

      {/* Upload Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <Box padding={3}>
          <h3>{selectedCatalog ? "Edit Catalog" : "Upload Catalog"}</h3>
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
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <Button onClick={handleUpload}>
            {selectedCatalog ? "Update" : "Upload"}
          </Button>
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
