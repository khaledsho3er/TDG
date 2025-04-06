import React, { useState } from "react";
import axios from "axios";

const DiscountModal = ({ onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discount, setDiscount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProduct && discount && startDate && endDate) {
      try {
        const response = await axios.put(
          `https://tdg-db.onrender.com/api/products/updatepromotion/${selectedProduct.id}`,
          {
            discount,
            startDate,
            endDate,
          }
        );
        console.log(response.data);
        onClose(); // Close the modal after successful update
      } catch (error) {
        console.error("Error creating promotion:", error);
      }
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create Promotion</h2>
        <form onSubmit={handleSubmit}>
          <label>Select Product:</label>
          <select
            onChange={(e) => setSelectedProduct(JSON.parse(e.target.value))}
            required
          >
            <option value="">Select a product</option>
            {/* Map through your product list here */}
            {/* Example: */}
            {/* <option value={JSON.stringify(product)}>{product.name}</option> */}
          </select>

          <label>Discount:</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Enter discount percentage"
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

          <button type="submit">Create Promotion</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiscountModal;
