import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const SetDeliveryDialog = ({ open, handleClose, orderId, cartItems }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [subDeliveryDate, setSubDeliveryDate] = useState("");

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleSubDateChange = (event) => {
    setSubDeliveryDate(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !subDeliveryDate) {
      alert("Please select a product and set a delivery date.");
      return;
    }

    try {
      const selectedProductId = cartItems.find(
        (item) => item.name === selectedProduct
      )?._id;

      if (!selectedProductId) {
        alert("Selected product not found.");
        return;
      }

      const response = await axios.put(
        `https://tdg-db.onrender.com/api/orders/${orderId}/product/${selectedProductId}/update-sub-delivery`,
        {
          subDeliveryDate,
          subOrderStatus: "Confirmed", // You can set this dynamically
        }
      );

      alert(response.data.message);
      handleClose();
    } catch (error) {
      console.error("Error updating sub-delivery date:", error);
      alert("Failed to update sub-delivery date.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Set Delivery Date</DialogTitle>
      <DialogContent>
        <Select
          value={selectedProduct}
          onChange={handleProductChange}
          fullWidth
        >
          {cartItems.map((product) => (
            <MenuItem key={product._id} value={product.name}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
        <TextField
          type="date"
          fullWidth
          margin="normal"
          value={subDeliveryDate}
          onChange={handleSubDateChange}
        />
      </DialogContent>
      <DialogActions>
        <Button className="cancel-btn" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="submit-btn" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetDeliveryDialog;
