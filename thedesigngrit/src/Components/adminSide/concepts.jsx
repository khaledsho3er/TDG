import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardMedia,
  CardContent as MUICardContent,
  Box,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ConceptManager() {
  const [open, setOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [products, setProducts] = useState([]);
  const { data: concepts, mutate } = useSWR(
    "https://tdg-db.onrender.com/api/concepts/concepts",
    fetcher
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuConceptId, setMenuConceptId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const imageRef = useRef();

  useEffect(() => {
    fetch("https://tdg-db.onrender.com/api/products/getproducts")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMenuClick = (event, conceptId) => {
    setAnchorEl(event.currentTarget);
    setMenuConceptId(conceptId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuConceptId(null);
  };

  const handleImageClick = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width).toFixed(4);
    const y = ((e.clientY - rect.top) / rect.height).toFixed(4);
    setCurrentCoords({ x, y });
    setProductDialogOpen(true);
  };

  const handleProductSelect = (productId) => {
    setNodes([...nodes, { x: currentCoords.x, y: currentCoords.y, productId }]);
    setProductDialogOpen(false);
  };

  const handleSave = async () => {
    if (!imageFile || !title) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("nodes", JSON.stringify(nodes));

    await fetch("https://tdg-db.onrender.com/api/concepts/concepts", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    setOpen(false);
    setImageFile(null);
    setPreviewUrl(null);
    setNodes([]);
    setTitle("");
    setDescription("");
    mutate();
  };

  const handleDelete = async (id) => {
    await fetch(`https://tdg-db.onrender.com/api/concepts/concepts/${id}`, {
      method: "DELETE",
    });
    handleMenuClose();
    mutate();
  };

  return (
    <div
      style={{
        padding: "16px",
        fontFamily: "Montserrat",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        color: "#2d2d2d",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Typography
          variant="h4"
          style={{ fontWeight: "bold", fontFamily: "Horizon-bold" }}
        >
          Concepts
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          style={{ backgroundColor: "#6c7c59", color: "#ffffff" }}
          startIcon={<AddIcon />}
        >
          New Concept
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Concept Image</DialogTitle>
        <DialogContent>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", margin: "12px 0" }}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", marginBottom: "12px" }}
          />
          {previewUrl && (
            <div
              style={{
                marginTop: "16px",
                position: "relative",
                border: "1px dashed #6c7c59",
                height: "400px",
              }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                ref={imageRef}
                onClick={handleImageClick}
              />
              {nodes.map((node, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    left: `${node.x * 100}%`,
                    top: `${node.y * 100}%`,
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#6c7c59",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: "2px solid white",
                  }}
                />
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            style={{ backgroundColor: "#6c7c59", color: "#ffffff" }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={productDialogOpen}
        onClose={() => setProductDialogOpen(false)}
      >
        <DialogTitle>Select a Product for Node</DialogTitle>
        <DialogContent>
          <Grid
            container
            spacing={2}
            sx={{ maxHeight: 400, overflowY: "auto" }}
          >
            {products.map((product) => (
              <Grid item xs={6} key={product._id}>
                <Card
                  onClick={() => handleProductSelect(product._id)}
                  style={{ cursor: "pointer" }}
                >
                  <CardMedia
                    component="img"
                    height="120"
                    image={product.images?.[0]}
                    alt={product.name}
                  />
                  <MUICardContent>
                    <Typography variant="body1">{product.name}</Typography>
                  </MUICardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      <Grid container spacing={3}>
        {(concepts?.concepts || []).map((concept) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={concept._id}
            style={{ position: "relative" }}
          >
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`https://pub-8aa8289e571a4ef1a067e89c0e294837.r2.dev/${concept.imageUrl}`}
                alt={concept.title}
              />
              <MUICardContent>
                <Typography variant="h6">{concept.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {concept.description}
                </Typography>
              </MUICardContent>
              <IconButton
                aria-label="settings"
                onClick={(e) => handleMenuClick(e, concept._id)}
                style={{ position: "absolute", top: 8, right: 8 }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && menuConceptId === concept._id}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                <MenuItem onClick={() => handleDelete(concept._id)}>
                  Delete
                </MenuItem>
              </Menu>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
