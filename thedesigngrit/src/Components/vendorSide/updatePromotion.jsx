import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdatePromotionModal = ({ product, onClose }) => {
  const [discount, setDiscount] = useState(product.discount || "");
  const [startDate, setStartDate] = useState(product.startDate || "");
  const [endDate, setEndDate] = useState(product.endDate || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://tdg-db.onrender.com/api/products/updatepromotion/${product.id}`,
        {
          discount,
          startDate,
          endDate,
        }
      );
      console.log(response.data);
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating promotion:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Promotion</h2>
        <form onSubmit={handleUpdate}>
          <label>Discount:</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Enter new discount percentage"
            required
          />

          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <button type="submit">Update Promotion</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePromotionModal;
