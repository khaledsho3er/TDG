import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Modal,
  Button,
} from "@mui/material";
import LoadingScreen from "../Pages/loadingScreen";
import { UserContext } from "../utils/userContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useCart } from "../Context/cartcontext";
import { useNavigate } from "react-router-dom";

function TrackViewInStore() {
  const { userSession } = useContext(UserContext);
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payError, setPayError] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [showOptionPopup, setShowOptionPopup] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    color: false,
    size: false,
  });

  // Helper: get available sizes for selected color
  const getAvailableSizes = () => {
    const product = selectedRequest?.productId;
    if (!product) return [];
    if (!selectedColor || !product.sizes) return product.sizes || [];
    // If variants logic is needed, add here
    return product.sizes;
  };

  // Helper: get available colors
  const getAvailableColors = () => {
    const product = selectedRequest?.productId;
    if (!product) return [];
    return product.colors || [];
  };

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userSession?.id) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.thedesigngrit.com/api/view-in-store/user/${userSession.id}`
        );
        const data = await response.json();
        setRequests(Array.isArray(data) ? data : []);
        setSelectedRequest(
          Array.isArray(data) && data.length > 0 ? data[0] : null
        );
      } catch (err) {
        setRequests([]);
        setSelectedRequest(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [userSession]);

  const handlePayNow = () => {
    setPayError("");
    setPayLoading(true);
    try {
      if (!selectedRequest) {
        setPayError("No request selected.");
        setPayLoading(false);
        return;
      }
      // Prevent duplicate in cart
      const alreadyInCart = cartItems.some(
        (item) =>
          item.fromViewInStore && item.viewInStoreId === selectedRequest._id
      );
      if (alreadyInCart) {
        setPayError("This product is already in your cart.");
        setPayLoading(false);
        navigate("/checkout");
        return;
      }
      // Check if color/size selection is needed
      const product = selectedRequest.productId;
      const colors = product?.colors || [];
      const sizes = product?.sizes || [];
      if (
        (colors.length > 1 && !selectedColor) ||
        (sizes.length > 1 && !selectedSize)
      ) {
        setShowOptionPopup(true);
        setPayLoading(false);
        return;
      }
      // Generate a unique id for the cart item
      let uniqueId;
      try {
        uniqueId = require("nanoid").nanoid();
      } catch {
        uniqueId = Date.now().toString();
      }
      const brand = product?.brandId || selectedRequest.brandId || {};
      const cartItem = {
        id: uniqueId,
        productId: product?._id,
        name: product?.name || "View In Store Product",
        unitPrice: product?.salePrice || product?.price || 0,
        quantity: 1,
        mainImage: product?.mainImage || "",
        brandId: brand,
        color: selectedColor || "default",
        size: selectedSize || "default",
        code: product?.sku || selectedRequest.code || "N/A",
        shippingFee: brand?.fees || 0,
        fromViewInStore: true,
        viewInStoreId: selectedRequest._id,
      };
      addToCart(cartItem);
      setPayLoading(false);
      navigate("/checkout");
    } catch (err) {
      setPayError(err.message || "Failed to add product to cart.");
      setPayLoading(false);
    }
  };

  // Handler for confirming color/size selection
  const handleOptionConfirm = () => {
    const product = selectedRequest.productId;
    const colors = product?.colors || [];
    const sizes = product?.sizes || [];
    const errors = {
      color: colors.length > 1 && !selectedColor,
      size: sizes.length > 1 && !selectedSize,
    };
    setValidationErrors(errors);
    if (errors.color || errors.size) return;
    setShowOptionPopup(false);
    setPayLoading(true);
    // Now call handlePayNow logic with selected options
    // (simulate as if handlePayNow was called with these selections)
    // Generate a unique id for the cart item
    let uniqueId;
    try {
      uniqueId = require("nanoid").nanoid();
    } catch {
      uniqueId = Date.now().toString();
    }
    const brand = product?.brandId || selectedRequest.brandId || {};
    const cartItem = {
      id: uniqueId,
      productId: product?._id,
      name: product?.name || "View In Store Product",
      unitPrice: product?.salePrice || product?.price || 0,
      quantity: 1,
      mainImage: product?.mainImage || "",
      brandId: brand,
      color: selectedColor || "default",
      size: selectedSize || "default",
      code: product?.sku || selectedRequest.code || "N/A",
      shippingFee: brand?.fees || 0,
      fromViewInStore: true,
      viewInStoreId: selectedRequest._id,
    };
    addToCart(cartItem);
    setPayLoading(false);
    navigate("/checkout");
  };

  if (loading) return <LoadingScreen />;

  if (!requests.length) {
    return (
      <Box sx={{ fontFamily: "Montserrat", paddingBottom: "10rem" }}>
        <Typography variant="h6" gutterBottom>
          Track Your View In Store Request
        </Typography>
        <Typography>No requests found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ fontFamily: "Montserrat", paddingBottom: "10rem" }}>
      <Typography variant="h6" gutterBottom>
        Track Your View In Store Request
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 4 }}>
        <Select
          value={selectedRequest?._id || ""}
          onChange={(e) => {
            const req = requests.find((r) => r._id === e.target.value);
            setSelectedRequest(req);
          }}
        >
          {requests.map((req) => (
            <MenuItem key={req._id} value={req._id}>
              Request {req.code} – {req.productId?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedRequest && (
        <Box
          sx={{
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#fff",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 6px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Info Icon - top right, links to product page */}
          {selectedRequest.productId && (
            <a
              href={`https://thedesigngrit.com/product/${selectedRequest.productId._id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "#2d2d2d",
                textDecoration: "none",
                zIndex: 2,
              }}
              title="View Product Page"
            >
              <InfoOutlinedIcon fontSize="large" />
            </a>
          )}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Request Summary
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Product:</strong> {selectedRequest.productId?.name || "N/A"}
          </Typography>
          <Typography>
            <strong>Brand:</strong>{" "}
            {selectedRequest.brandId?.brandName || "N/A"}
          </Typography>
          {selectedRequest.productId?.mainImage && (
            <img
              src={`https://pub-03f15f93661b46629dc2abcc2c668d72.r2.dev/${selectedRequest.productId.mainImage}`}
              alt={selectedRequest.productId.name}
              style={{ width: "200px", borderRadius: "6px", marginTop: "10px" }}
            />
          )}
          <Typography sx={{ mt: 2 }}>
            <strong>Purchase Code:</strong> {selectedRequest.code}
          </Typography>
          <Typography>
            <strong>User:</strong> {selectedRequest.userName || "N/A"}
          </Typography>
          <Typography>
            <strong>Email:</strong> {selectedRequest.userId?.email || "N/A"}
          </Typography>
          <Typography>
            <strong>Phone:</strong>{" "}
            {selectedRequest.userId?.phoneNumber || "N/A"}
          </Typography>
          <Typography>
            <strong>Status:</strong> {selectedRequest.status}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            <strong>Product Description:</strong>{" "}
            {selectedRequest.productId?.description || "N/A"}
          </Typography>
          <Typography>
            <strong>Technical Dimensions:</strong>{" "}
            {selectedRequest.productId?.technicalDimensions
              ? `${selectedRequest.productId.technicalDimensions.length} x ${selectedRequest.productId.technicalDimensions.width} x ${selectedRequest.productId.technicalDimensions.height} cm, ${selectedRequest.productId.technicalDimensions.weight} kg`
              : "N/A"}
          </Typography>
          <Typography>
            <strong>Warranty:</strong>{" "}
            {selectedRequest.productId?.warrantyInfo
              ? `${
                  selectedRequest.productId.warrantyInfo.warrantyYears
                } years - ${selectedRequest.productId.warrantyInfo.warrantyCoverage.join(
                  ", "
                )}`
              : "N/A"}
          </Typography>
          <Typography sx={{ color: "gray", mt: 2 }}>
            Requested On:{" "}
            {new Date(selectedRequest.createdAt).toLocaleDateString()}
          </Typography>
          {/* Status-based actions/messages */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              gap: 2,
              justifyContent: "end",
              flexDirection: "row-reverse",
              alignItems: "baseline",
            }}
          >
            {selectedRequest.status === "approved" && (
              <button
                className="submit-btn"
                style={{ marginRight: 8 }}
                onClick={handlePayNow}
                disabled={payLoading}
              >
                {payLoading ? "Processing..." : "Pay Now"}
              </button>
            )}
            {selectedRequest.status === "rejected" && (
              <Typography sx={{ color: "#2d2d2d", fontWeight: "bold" }}>
                Unfortunately, you have rejected the product.
              </Typography>
            )}
            {selectedRequest.status === "pending" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "end",
                  gap: "0px",
                }}
              >
                <Typography
                  sx={{
                    color: "#2d2d2d",
                    fontWeight: "bold",
                    mr: 2,
                    mb: "0px",
                  }}
                >
                  Waiting for your visit
                </Typography>
                {selectedRequest.brandId?.companyAddress && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedRequest.brandId.companyAddress
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="submit-btn" style={{ marginRight: 8 }}>
                      Get Directions
                    </button>
                  </a>
                )}
              </div>
            )}
          </Box>
          {payError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {payError}
            </Typography>
          )}
        </Box>
      )}
      {/* Color/Size Selection Popup */}
      <Modal open={showOptionPopup} onClose={() => setShowOptionPopup(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Select Color and Size
          </Typography>
          {/* Color selection */}
          {getAvailableColors().length > 1 && (
            <Box sx={{ mb: 2 }}>
              <Typography>Color:</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {getAvailableColors().map((color, idx) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "contained" : "outlined"}
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      minWidth: 40,
                      bgcolor: selectedColor === color ? "#6B7B58" : undefined,
                      color: selectedColor === color ? "#fff" : undefined,
                    }}
                  >
                    {color}
                  </Button>
                ))}
              </Box>
              {validationErrors.color && (
                <Typography color="error">Please select a color</Typography>
              )}
            </Box>
          )}
          {/* Size selection */}
          {getAvailableSizes().length > 1 && (
            <Box sx={{ mb: 2 }}>
              <Typography>Size:</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {getAvailableSizes().map((size, idx) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "contained" : "outlined"}
                    onClick={() => setSelectedSize(size)}
                    sx={{
                      minWidth: 40,
                      bgcolor: selectedSize === size ? "#6B7B58" : undefined,
                      color: selectedSize === size ? "#fff" : undefined,
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </Box>
              {validationErrors.size && (
                <Typography color="error">Please select a size</Typography>
              )}
            </Box>
          )}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            <Button
              onClick={() => setShowOptionPopup(false)}
              color="secondary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOptionConfirm}
              color="primary"
              variant="contained"
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default TrackViewInStore;
