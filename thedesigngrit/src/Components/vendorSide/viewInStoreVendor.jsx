import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import { useVendor } from "../../utils/vendorContext";
import { FaSearch } from "react-icons/fa";
import ConfirmationDialog from "../confirmationMsg";
import { LuInfo } from "react-icons/lu";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";

const ViewInStoreVendor = () => {
  const { vendor } = useVendor(); // Access vendor data from context
  const [viewInStores, setViewInStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedViewInStore, setSelectedViewInStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [showProductInfo, setShowProductInfo] = useState(false);

  // Helper: check if status is locked (approved/rejected for 5+ min)
  const isStatusLocked = (entry) => {
    if (!entry) return false;
    const status = (entry.status || "").toLowerCase();
    if (status !== "approved" && status !== "rejected") return false;
    // Use statusUpdatedAt if available, else fallback to createdAt
    const updatedAt =
      entry.statusUpdatedAt || entry.updatedAt || entry.createdAt;
    if (!updatedAt) return false;
    const updatedTime = new Date(updatedAt).getTime();
    const now = Date.now();
    return now - updatedTime > 5 * 60 * 1000; // 5 minutes in ms
  };

  useEffect(() => {
    const fetchViewInStores = async () => {
      try {
        const response = await axios.get(
          `https://api.thedesigngrit.com/api/view-in-store/brand/${vendor.brandId}`
        );
        setViewInStores(
          (response.data || [])
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
        setLoading(false);
      } catch (err) {
        setError("Failed to load ViewInStore entries");
        setLoading(false);
      }
    };

    fetchViewInStores();
  }, [vendor.brandId]);

  const handleCardClick = (viewInStore) => {
    setSelectedViewInStore(viewInStore);
  };

  const handleClosePopup = () => {
    setSelectedViewInStore(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filteredSuggestions = viewInStores.filter(
        (entry) =>
          entry.userName.toLowerCase().includes(value.toLowerCase()) ||
          entry.code.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (entry) => {
    setSelectedViewInStore(entry);
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    if (!selectedViewInStore) return;
    setPendingStatus(newStatus);
    setConfirmOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedViewInStore || !pendingStatus) return;
    try {
      await axios.put(
        `https://api.thedesigngrit.com/api/view-in-store/${selectedViewInStore._id}`,
        { status: pendingStatus }
      );
      // Update local state
      setViewInStores((prev) =>
        prev.map((item) =>
          item._id === selectedViewInStore._id
            ? {
                ...item,
                status: pendingStatus,
                statusUpdatedAt: new Date().toISOString(),
              }
            : item
        )
      );
      // Update selected entry state
      setSelectedViewInStore((prev) => ({
        ...prev,
        status: pendingStatus,
        statusUpdatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setConfirmOpen(false);
      setPendingStatus(null);
    }
  };

  const handleCancelStatusChange = () => {
    setConfirmOpen(false);
    setPendingStatus(null);
  };

  if (loading) {
    return <div>Loading ViewInStore entries...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="quotations-page">
      <div className="dashboard-header-title" style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: "10px",
          }}
        >
          <h2>View In Store</h2>
        </div>
        <p style={{ fontSize: "12px", fontFamily: "Montserrat" }}>
          Home &gt; View In Store
        </p>
      </div>{" "}
      <Box
        className="view-in-store-search"
        sx={{
          marginBottom: "50px",
          display: "flex",
          alignItems: "center",
          width: "50%",
          backgroundColor: "#fff",
          padding: "0.5rem",
          borderRadius: "10px",
        }}
      >
        <FaSearch style={{ fontSize: "1.2rem", marginRight: "0.5rem" }} />
        <input
          type="text"
          placeholder="Search by user name or code..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
          style={{ flex: 1, border: 0 }}
        />
      </Box>
      {suggestions.length > 0 && (
        <div
          className="suggestions-dropdown"
          style={{
            marginTop: "10px",
            margin: "auto",
            top: "31%",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
            width: "37.5%",
            zIndex: "100",
          }}
        >
          {suggestions.map((entry) => (
            <div
              key={entry._id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(entry)}
            >
              {entry.userName} - {entry.code}
            </div>
          ))}
        </div>
      )}
      {viewInStores.length > 0 ? (
        <div
          className="quotations-list"
          style={{ marginTop: "50px", justifyContent: "flex-start" }}
        >
          {viewInStores.map((entry) => (
            <div
              key={entry._id}
              className="quotation-card"
              onClick={() => handleCardClick(entry)}
            >
              <img
                src={
                  entry.productId?.mainImage
                    ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${entry.productId.mainImage}`
                    : "/default-product-image.jpg"
                }
                alt={entry.productId?.name || "Product"}
                className="quotation-popup-img"
                width={"100%"}
                style={{ marginBottom: "0px" }}
              />
              <div className="quotation-card-info" style={{ padding: "10px" }}>
                <h2>{entry.productId?.name || "Product Name Not Available"}</h2>
                <p>User: {entry.userName}</p>
                <p>Code: {entry.code}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No View In Store entries available for this brand.</div>
      )}
      {/* Popup for displaying entry details */}
      {selectedViewInStore && (
        <div className="quotation-popup">
          <div className="quotation-popup-content">
            <span className="close-btn" onClick={handleClosePopup}>
              &times;
            </span>
            <h2>
              Details for: {selectedViewInStore.productId?.name || "Product"}
            </h2>
            <div style={{ position: "relative" }}>
              <img
                src={
                  selectedViewInStore.productId?.mainImage
                    ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedViewInStore.productId.mainImage}`
                    : "/default-product-image.jpg"
                }
                alt={selectedViewInStore.productId?.name || "Product"}
                className="quotation-popup-img"
              />
              <IconButton
                aria-label="Product Info"
                onClick={() => setShowProductInfo(true)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 1,
                }}
              >
                <LuInfo color="white" size={30} />
              </IconButton>
            </div>
            <p>
              <strong>Code:</strong> {selectedViewInStore.code}
            </p>
            <p>
              <strong>User:</strong> {selectedViewInStore.userName}
            </p>
            <p>
              <strong>Brand:</strong>{" "}
              {selectedViewInStore.brandId?.brandName ||
                "Brand Name Not Available"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <select
                value={selectedViewInStore.status}
                onChange={handleStatusChange}
                disabled={isStatusLocked(selectedViewInStore)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Paid Online</option>
                <option value="rejected">Paid In Store</option>
              </select>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedViewInStore.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
      {/* Confirmation Dialog for status change */}
      <ConfirmationDialog
        open={confirmOpen}
        title="Confirm Status Change"
        content={`Are you sure you want to change the status to '${pendingStatus}'?`}
        onConfirm={handleConfirmStatusChange}
        onCancel={handleCancelStatusChange}
      />
      {/* Product Info Dialog */}
      <Dialog
        open={showProductInfo}
        onClose={() => setShowProductInfo(false)}
        maxWidth="sm"
        fullWidth
        sx={{ borderRadius: "8px", height: "80vh" }}
      >
        <DialogTitle>Product Information</DialogTitle>
        <DialogContent dividers>
          {selectedViewInStore && (
            <Box>
              <img
                src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedViewInStore.productId.mainImage}`}
                alt={selectedViewInStore.productId.name}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <Typography variant="h6" mt={2}>
                {selectedViewInStore.productId.name}
              </Typography>
              <Typography>
                <strong> Price: E£</strong>{" "}
                {selectedViewInStore.productId.salePrice ? (
                  <del style={{ color: "#a1a1a1" }}>
                    {selectedViewInStore.productId.price.toLocaleString()}E£
                  </del>
                ) : (
                  selectedViewInStore.productId.price.toLocaleString()
                )}
                {selectedViewInStore.productId.salePrice && (
                  <span style={{ color: "red" }}>
                    {" "}
                    {selectedViewInStore.productId.salePrice.toLocaleString()}E£
                  </span>
                )}
              </Typography>
              <Typography>
                <strong> SKU:</strong> {selectedViewInStore.productId.sku}
              </Typography>
              <Typography>
                <strong> Collection:</strong>{" "}
                {selectedViewInStore.productId.collection}
              </Typography>
              <Typography>
                <strong> Year:</strong>{" "}
                {selectedViewInStore.productId.manufactureYear}
              </Typography>
              <Typography>
                <strong> Colors:</strong>{" "}
                {selectedViewInStore.productId.colors?.join(", ")}
              </Typography>
              <Typography>
                <strong> Sizes: </strong>{" "}
                {selectedViewInStore.productId.sizes?.join(", ")}
              </Typography>
              <Typography>
                <strong> Dimensions:</strong>
                {
                  selectedViewInStore.productId.technicalDimensions?.length
                } x {selectedViewInStore.productId.technicalDimensions?.width} x{" "}
                {selectedViewInStore.productId.technicalDimensions?.height} cm
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              backgroundColor: "#2d2d2d",
              color: "white",
              "&:hover": {
                backgroundColor: "#6b7b58",
                transform: "scale(1.1)",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)",
              },
            }}
            onClick={() => setShowProductInfo(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewInStoreVendor;
