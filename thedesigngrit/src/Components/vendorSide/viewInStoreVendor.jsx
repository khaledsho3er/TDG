import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import { useVendor } from "../../utils/vendorContext";
import { FaSearch } from "react-icons/fa";

const ViewInStoreVendor = () => {
  const { vendor } = useVendor(); // Access vendor data from context
  const [viewInStores, setViewInStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedViewInStore, setSelectedViewInStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

    try {
      await axios.put(
        `https://api.thedesigngrit.com/api/view-in-store/${selectedViewInStore._id}`,
        { status: newStatus }
      );

      // Update local state
      setViewInStores((prev) =>
        prev.map((item) =>
          item._id === selectedViewInStore._id
            ? { ...item, status: newStatus }
            : item
        )
      );

      // Update selected entry state
      setSelectedViewInStore((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Failed to update status", error);
    }
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
            <img
              src={
                selectedViewInStore.productId?.mainImage
                  ? `https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedViewInStore.productId.mainImage}`
                  : "/default-product-image.jpg"
              }
              alt={selectedViewInStore.productId?.name || "Product"}
              className="quotation-popup-img"
            />
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
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedViewInStore.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewInStoreVendor;
