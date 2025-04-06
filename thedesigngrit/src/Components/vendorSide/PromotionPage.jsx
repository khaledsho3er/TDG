import React, { useState, useEffect } from "react";
import axios from "axios";

const PromotionsPage = () => {
  const [currentPromotions, setCurrentPromotions] = useState([]);
  const [pastPromotions, setPastPromotions] = useState([]);
  const [newPromotion, setNewPromotion] = useState({
    salePrice: "",
    startDate: "",
    endDate: "",
  });

  // Fetch current and past promotions from backend
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const currentResponse = await axios.get(
          "https://tdg-db.onrender.com/api/promotions/promotions/current"
        );
        const pastResponse = await axios.get(
          "https://tdg-db.onrender.com/api/promotions/promotions/past"
        );
        setCurrentPromotions(currentResponse.data);
        setPastPromotions(pastResponse.data);
      } catch (error) {
        console.error("Error fetching promotions", error);
      }
    };
    fetchPromotions();
  }, []);

  // Handle new promotion form submission
  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    try {
      const { salePrice, startDate, endDate } = newPromotion;
      const response = await axios.post(
        "https://tdg-db.onrender.com/api/promotions/promotions",
        {
          salePrice,
          startDate,
          endDate,
        }
      );
      setCurrentPromotions([response.data, ...currentPromotions]);
    } catch (error) {
      console.error("Error creating promotion", error);
    }
  };

  // Handle change in new promotion form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion((prev) => ({ ...prev, [name]: value }));
  };

  // End promotion function
  const endPromotion = async (id) => {
    try {
      const response = await axios.post(
        `https://tdg-db.onrender.com/api/promotions/promotions/end/${id}`
      );
      setCurrentPromotions(
        currentPromotions.filter((promotion) => promotion._id !== id)
      );
    } catch (error) {
      console.error("Error ending promotion", error);
    }
  };

  return (
    <div>
      <h1>Promotions Page</h1>

      {/* Current Promotions Section */}
      <h2>Current Promotions</h2>
      <div>
        {currentPromotions.map((promotion) => (
          <div key={promotion._id}>
            <h3>{promotion.productName}</h3>
            <p>
              <span style={{ textDecoration: "line-through" }}>
                {promotion.originalPrice}
              </span>{" "}
              {promotion.salePrice} ({promotion.discountPercentage}% off)
            </p>
            <p>
              Promotion runs from {promotion.promotionStartDate} to{" "}
              {promotion.promotionEndDate}
            </p>
            <button onClick={() => endPromotion(promotion._id)}>
              End Promotion
            </button>
          </div>
        ))}
      </div>

      {/* Past Promotions Section */}
      <h2>Past Promotions</h2>
      <div>
        {pastPromotions.map((promotion) => (
          <div key={promotion._id}>
            <h3>{promotion.productName}</h3>
            <p>
              {promotion.salePrice} (Was {promotion.originalPrice})
            </p>
            <p>Ended on: {promotion.promotionEndDate}</p>
            {/* Metrics */}
            <p>Sales: {promotion.sales}</p>
            <p>Views: {promotion.views}</p>
            <p>Turnover: {promotion.turnover}%</p>
          </div>
        ))}
      </div>

      {/* Create New Promotion Form */}
      <h2>Create New Promotion</h2>
      <form onSubmit={handleCreatePromotion}>
        <div>
          <label>Sale Price</label>
          <input
            type="number"
            name="salePrice"
            value={newPromotion.salePrice}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={newPromotion.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={newPromotion.endDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Create Promotion</button>
      </form>
    </div>
  );
};

export default PromotionsPage;
