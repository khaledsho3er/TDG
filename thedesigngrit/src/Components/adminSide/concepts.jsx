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
    "https://api.thedesigngrit.com/api/concepts/concepts",
    fetcher
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuConceptId, setMenuConceptId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingConcept, setEditingConcept] = useState(null);

  const imageRef = useRef();

  useEffect(() => {
    fetch("https://api.thedesigngrit.com/api/products/getproducts")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched products:", data);
        setProducts(data.products ?? data); // Handles both structures
      })
      .catch((err) => console.error("Error fetching products:", err));
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
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setCurrentCoords({ x, y });
    setProductDialogOpen(true); // Open product selection dialog
  };

  const handleProductSelect = (productId) => {
    setNodes([...nodes, { x: currentCoords.x, y: currentCoords.y, productId }]);
    setProductDialogOpen(false);
  };

  const handleSave = async () => {
    if (!title) return; // Ensure title is provided

    setLoading(true);
    const formData = new FormData();

    if (imageFile) {
      formData.append("image", imageFile); // Only add image if it's new
    }

    formData.append("title", title);
    formData.append("description", description);
    formData.append("nodes", JSON.stringify(nodes));

    const url = isEditMode
      ? `https://api.thedesigngrit.com/api/concepts/concepts/${editingConcept._id}`
      : "https://api.thedesigngrit.com/api/concepts/concepts";

    const method = isEditMode ? "PUT" : "POST";

    await fetch(url, {
      method,
      body: formData,
    });

    setLoading(false);
    setOpen(false);
    setImageFile(null);
    setPreviewUrl(null);
    setNodes([]);
    setTitle("");
    setDescription("");
    setIsEditMode(false); // Reset after save
    mutate(); // Refresh data
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://api.thedesigngrit.com/api/concepts/concepts/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        handleMenuClose();
        mutate(); // Refresh data
      } else {
        console.error("Failed to delete concept.");
      }
    } catch (error) {
      console.error("Error deleting concept:", error);
    }
  };

  const handleDeleteNode = (index) => {
    const newNodes = [...nodes];
    newNodes.splice(index, 1);
    setNodes(newNodes);
  };

  const handleMoveNode = (index, newCoords) => {
    const updatedNodes = [...nodes];
    updatedNodes[index] = { ...updatedNodes[index], ...newCoords };
    setNodes(updatedNodes);
  };

  return (
    <div
      style={{
        padding: "16px",
        fontFamily: "Montserrat",
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
        <div className="dashboard-header-title">
          <h2>Concepts</h2>
          <p>Home &gt; Concepts</p>
        </div>
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
        <DialogTitle>
          {isEditMode ? "Edit Concept" : "Upload Concept Image"}
        </DialogTitle>
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
                    left: `${node.x * 100}%`, // Convert fractional x to percentage
                    top: `${node.y * 100}%`, // Convert fractional y to percentage
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#6c7c59",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: "2px solid white",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newCoords = {
                      x:
                        (e.clientX - imageRef.current.offsetLeft) /
                        imageRef.current.offsetWidth,
                      y:
                        (e.clientY - imageRef.current.offsetTop) /
                        imageRef.current.offsetHeight,
                    };
                    handleMoveNode(index, newCoords); // Update node position if clicked
                  }}
                >
                  {/* Add Delete Button */}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering node click
                      handleDeleteNode(index); // Delete the node
                    }}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      padding: 4,
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "#d32f2f" }}>
                      X
                    </span>{" "}
                    {/* Delete icon */}
                  </IconButton>
                </Box>
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
                    image={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${product.mainImage}`}
                    alt={product.name}
                  />
                  <MUICardContent>
                    <Typography variant="body1">{product.name}</Typography>
                    <Typography variant="body1">{product.price}</Typography>
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
                style={{
                  position: "absolute",
                  top: "28px",
                  right: "8px",
                  backgroundColor: "#fff",
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && menuConceptId === concept._id}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={() => {
                    const conceptToEdit = concepts.concepts.find(
                      (c) => c._id === menuConceptId
                    );
                    setEditingConcept(conceptToEdit);
                    setTitle(conceptToEdit.title);
                    setDescription(conceptToEdit.description);
                    setPreviewUrl(
                      `https://pub-8aa8289e571a4ef1a067e89c0e294837.r2.dev/${conceptToEdit.imageUrl}`
                    );
                    setNodes(conceptToEdit.nodes || []);
                    setOpen(true);
                    setIsEditMode(true);
                    handleMenuClose();
                  }}
                >
                  Edit
                </MenuItem>
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
