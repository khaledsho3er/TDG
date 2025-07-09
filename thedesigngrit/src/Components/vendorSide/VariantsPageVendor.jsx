import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useVendor } from "../../utils/vendorContext";
import ConfirmationDialog from "../confirmationMsg";

const VariantsPageVendor = () => {
  const { vendor } = useVendor();
  const [variants, setVariants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const variantsPerPage = 12;
  const [menuOpen, setMenuOpen] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    if (vendor?.brandId) {
      fetch(
        `https://api.thedesigngrit.com/api/product-variants/brand/${vendor.brandId}`
      )
        .then((res) => res.json())
        .then((data) => setVariants(Array.isArray(data) ? data : []));
    }
  }, [vendor]);

  const toggleMenu = (variantId) => {
    setMenuOpen((prevId) => (prevId === variantId ? null : variantId));
  };

  const closeAllMenus = () => setMenuOpen(null);

  useEffect(() => {
    const handleClickOutside = () => closeAllMenus();
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleEdit = (variant) => {
    setSelectedVariant(variant);
    setEditForm({
      title: variant.title,
      size: variant.size,
      color: variant.color,
      price: variant.price,
      stock: variant.stock,
      sku: variant.sku,
    });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(
        `https://api.thedesigngrit.com/api/product-variants/${selectedVariant._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      if (!res.ok) throw new Error("Failed to update variant");
      setVariants((prev) =>
        prev.map((v) =>
          v._id === selectedVariant._id ? { ...v, ...editForm } : v
        )
      );
      setEditDialogOpen(false);
      setSelectedVariant(null);
    } catch (err) {
      alert("Failed to update variant");
    }
  };

  const handleDelete = async () => {
    if (!variantToDelete) return;
    try {
      await fetch(
        `https://api.thedesigngrit.com/api/product-variants/${variantToDelete._id}`,
        { method: "DELETE" }
      );
      setVariants((prev) => prev.filter((v) => v._id !== variantToDelete._id));
      setConfirmDialogOpen(false);
      setVariantToDelete(null);
    } catch (err) {
      alert("Failed to delete variant");
    }
  };

  const indexOfLast = currentPage * variantsPerPage;
  const indexOfFirst = indexOfLast - variantsPerPage;
  const currentVariants = variants.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(variants.length / variantsPerPage);

  return (
    <div className="product-list-page-vendor">
      <header className="dashboard-header-vendor">
        <div className="dashboard-header-title">
          <h2>All Product Variants</h2>
          <p> Home &gt; Product Variants</p>
        </div>
      </header>
      <div className="product-grid">
        {currentVariants.map((variant) => (
          <div className="promotion-card" key={variant._id}>
            <div className="promotion-image-container">
              {variant.mainImage && (
                <img
                  src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${variant.mainImage}`}
                  alt={variant.title || "Variant"}
                  className="promotion-image"
                />
              )}
            </div>
            <div className="promotion-details">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <h3 className="promotion-details">{variant.title}</h3>
                <div className="menu-container">
                  <BsThreeDotsVertical
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(variant._id);
                    }}
                    className="three-dots-icon"
                  />
                  {menuOpen === variant._id && (
                    <div className="menu-dropdown">
                      <button onClick={() => handleEdit(variant)}>
                        <AiOutlineEdit /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setVariantToDelete(variant);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <AiOutlineDelete /> Delete
                      </button>
                      <button
                        onClick={() =>
                          window.open(
                            `/product/${variant.productId?._id}`,
                            "_blank"
                          )
                        }
                      >
                        <AiOutlineEye /> View
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="price-container">
                <span className="original-price">
                  E£{variant.price?.toLocaleString()}
                </span>
              </div>
              <p className="product-summary">
                SKU: {variant.sku} | Color: {variant.color} | Size:{" "}
                {variant.size}
              </p>
            </div>
            <div className="product-card-body">
              <h5>Summary</h5>
              <div className="metrics-container">
                <div className="metric">
                  <span className="metric-label">Stock</span>
                  <span className="metric-value">{variant.stock}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Available</span>
                  <span className="metric-value">
                    {variant.available ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            style={{
              margin: "5px",
              padding: "8px 12px",
              backgroundColor:
                currentPage === index + 1 ? "#2d2d2d" : "#efebe8",
              color: currentPage === index + 1 ? "#fff" : "#2d2d2d",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Variant</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            value={editForm.title || ""}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Size"
            name="size"
            value={editForm.size || ""}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Color"
            name="color"
            value={editForm.color || ""}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            type="number"
            value={editForm.price || ""}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Stock"
            name="stock"
            type="number"
            value={editForm.stock || ""}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="SKU"
            name="sku"
            value={editForm.sku || ""}
            onChange={handleEditChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Variant"
        content="Are you sure you want to delete this variant?"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setVariantToDelete(null);
        }}
      />
    </div>
  );
};

export default VariantsPageVendor;
